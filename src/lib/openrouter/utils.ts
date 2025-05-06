/**
 * Utility functions for OpenRouter service
 */

import type { ResponseFormat } from "./types";
import { InvalidInputError } from "./errors";

/**
 * Calculate approximate token count from text
 * Note: This is a simplification; for production, a more accurate tokenizer should be used
 */
export function calculateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Validate response format
 */
export function validateResponseFormat(format: ResponseFormat): void {
  if (!format.json_schema || !format.json_schema.schema) {
    throw new InvalidInputError("Invalid response format: missing schema");
  }

  if (typeof format.json_schema.name !== "string") {
    throw new InvalidInputError("Invalid response format: name must be a string");
  }

  if (typeof format.json_schema.strict !== "boolean") {
    throw new InvalidInputError("Invalid response format: strict must be a boolean");
  }
}

/**
 * Safely parse JSON
 */
export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new InvalidInputError(`Invalid JSON: ${(error as Error).message}`);
  }
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create exponential backoff delay based on retry attempt
 */
export function exponentialBackoff(attempt: number, baseDelay = 1000, maxDelay = 30000): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent synchronized retries
  return delay + Math.random() * delay * 0.1;
}
