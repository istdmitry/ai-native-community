/**
 * YAML loader for assessment content files
 *
 * Loads and parses YAML files with error handling for malformed content.
 */

import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import * as yaml from 'js-yaml';
import type { AssessmentContent, DeckConfig, TestVectors } from '../types/assessment';

/**
 * Base path to content data directory
 * Use absolute path from project root to handle Next.js webpack bundling
 */
const DATA_DIR = process.env.CONTENT_DATA_DIR || resolve(process.cwd(), '../../packages/content/data');

/**
 * Load and parse a YAML file with error handling
 *
 * @param filePath - Absolute path to YAML file
 * @returns Parsed YAML content
 * @throws Error if file cannot be read or YAML is malformed
 */
function loadYAML<T>(filePath: string): T {
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const parsed = yaml.load(fileContent);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`Invalid YAML structure in ${filePath}`);
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load YAML from ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load core assessment content (English)
 *
 * @returns Parsed assessment content
 */
export function loadCoreContent(): AssessmentContent {
  const filePath = resolve(DATA_DIR, 'assessment.core.v5.yml');
  return loadYAML<AssessmentContent>(filePath);
}

/**
 * Load locale overlay content
 *
 * @param locale - Locale code (e.g., 'ru', 'es')
 * @returns Parsed locale overlay content (partial AssessmentContent)
 */
export function loadLocaleContent(locale: string): Partial<AssessmentContent> {
  const filePath = resolve(DATA_DIR, `assessment.${locale}.v5.yml`);
  return loadYAML<Partial<AssessmentContent>>(filePath);
}

/**
 * Load deck configuration by variant
 *
 * @param variant - 'A' or 'B'
 * @returns Parsed deck configuration
 */
export function loadDeckConfig(variant: 'A' | 'B'): DeckConfig {
  const filePath = resolve(DATA_DIR, `decks.variant${variant}.v5.yml`);
  return loadYAML<DeckConfig>(filePath);
}

/**
 * Load test vectors for golden tests
 *
 * @returns Parsed test vectors
 */
export function loadTestVectors(): TestVectors {
  const filePath = resolve(DATA_DIR, 'tests.v5.yml');
  return loadYAML<TestVectors>(filePath);
}
