/**
 * Custom error classes for OpenRouter service
 */

/**
 * Base OpenRouter error class
 */
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends OpenRouterError {
  constructor(message: string) {
    super(message, "authentication_error", 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends OpenRouterError {
  constructor(message: string) {
    super(message, "rate_limit_error", 429);
    this.name = "RateLimitError";
  }
}

/**
 * Quota exceeded error
 */
export class QuotaExceededError extends OpenRouterError {
  constructor(message: string) {
    super(message, "quota_exceeded", 403);
    this.name = "QuotaExceededError";
  }
}

/**
 * Service unavailable error
 */
export class ServiceUnavailableError extends OpenRouterError {
  constructor(message: string) {
    super(message, "service_unavailable", 503);
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends OpenRouterError {
  constructor(message: string) {
    super(message, "timeout", 408);
    this.name = "TimeoutError";
  }
}

/**
 * Invalid input error
 */
export class InvalidInputError extends OpenRouterError {
  constructor(message: string) {
    super(message, "invalid_input", 400);
    this.name = "InvalidInputError";
  }
}

/**
 * Content filtered error
 */
export class ContentFilteredError extends OpenRouterError {
  constructor(message: string) {
    super(message, "content_filtered", 400);
    this.name = "ContentFilteredError";
  }
}

/**
 * Network error
 */
export class NetworkError extends OpenRouterError {
  constructor(message: string) {
    super(message, "network_error", 0);
    this.name = "NetworkError";
  }
}
