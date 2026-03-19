import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { MCP_PORT } from './config.js';
import { registerAssessmentTools } from './tools/assessment.js';
import { registerContentTools } from './tools/content.js';
import { registerAgentTools } from './tools/agent.js';

function createServer() {
  const server = new McpServer(
    {
      name: 'ai-native-community',
      version: '1.0.0',
    },
    {
      capabilities: { logging: {} },
    }
  );

  // Register all 8 tools
  registerAssessmentTools(server);
  registerContentTools(server);
  registerAgentTools(server);

  return server;
}

const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', name: 'ai-native-community-mcp' });
});

// Transport store
const transports: Record<string, StreamableHTTPServerTransport> = {};

// MCP POST endpoint
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  try {
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid: string) => {
          transports[sid] = transport;
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          delete transports[sid];
        }
      };

      const server = createServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: No valid session ID provided' },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// MCP GET endpoint (SSE stream)
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  await transports[sessionId].handleRequest(req, res);
});

// MCP DELETE endpoint (session termination)
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  try {
    await transports[sessionId].handleRequest(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).send('Error processing session termination');
    }
  }
});

app.listen(MCP_PORT, () => {
  console.log(`AI-Native Community MCP Server listening on port ${MCP_PORT}`);
  console.log(`Endpoint: http://localhost:${MCP_PORT}/mcp`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  for (const sid in transports) {
    try {
      await transports[sid].close();
      delete transports[sid];
    } catch {}
  }
  process.exit(0);
});
