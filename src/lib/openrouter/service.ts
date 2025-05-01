/**
 * OpenRouter Service
 * Provides a clean interface for interacting with the OpenRouter API
 */

import type { Message, ModelParameters, ResponseFormat, RequestPayload, ChatCompletionResponse, Model } from "./types";

import { OpenRouterModel, DEFAULT_PARAMS } from "./types";

import {
  AuthenticationError,
  ContentFilteredError,
  InvalidInputError,
  NetworkError,
  OpenRouterError,
  QuotaExceededError,
  RateLimitError,
  ServiceUnavailableError,
  TimeoutError,
} from "./errors";

import { delay, exponentialBackoff } from "./utils";

/**
 * OpenRouter Service
 * Provides a simplified interface for making requests to the OpenRouter API
 */
export class OpenRouterService {
  /**
   * Creates a new OpenRouter service instance
   *
   * @param apiKey - OpenRouter API key
   * @param defaultModel - Default model to use for requests
   * @param defaultParams - Default parameters for requests
   * @param baseUrl - Base URL for the OpenRouter API
   */
  constructor(
    private readonly apiKey: string,
    private readonly defaultModel: string = OpenRouterModel.GPT35Turbo,
    private readonly defaultParams: ModelParameters = DEFAULT_PARAMS,
    private readonly baseUrl = "https://openrouter.ai/api/v1"
  ) {
    this.validateApiKey();
  }

  /**
   * Sends a chat completion request to OpenRouter API
   *
   * @param messages - Array of messages for the conversation
   * @param options - Optional parameters for the request
   * @returns Chat completion response
   */
  async chatCompletion(
    messages: Message[],
    options?: {
      model?: string;
      params?: Partial<ModelParameters>;
      responseFormat?: ResponseFormat;
    }
  ): Promise<ChatCompletionResponse> {
    // Merge default parameters with provided options
    const model = options?.model || this.defaultModel;
    const params = { ...this.defaultParams, ...options?.params };

    // Format the request
    const requestPayload = this.formatRequest(messages, model, params, options?.responseFormat);

    try {
      // Send the request with retry logic
      const response = await this.withRetry(() => this.sendRequest(`${this.baseUrl}/chat/completions`, requestPayload));

      // Parse and return the response
      return this.parseResponse(response);
    } catch (error) {
      // Handle and throw appropriate errors
      throw this.handleError(error);
    }
  }

  /**
   * Retrieves available models from OpenRouter API
   *
   * @returns Array of available models
   */
  async getAvailableModels(): Promise<Model[]> {
    try {
      const response = await this.withRetry(() => this.sendRequest(`${this.baseUrl}/models`, {}));

      // Define a type for the expected response structure
      interface ModelsResponse {
        data: Model[];
      }

      if (
        !response ||
        typeof response !== "object" ||
        !("data" in response) ||
        !Array.isArray((response as ModelsResponse).data)
      ) {
        throw new InvalidInputError("Invalid models response format");
      }

      return (response as ModelsResponse).data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Estimates cost for a given number of tokens
   *
   * Prices are based on OpenRouter's current rates
   * Source: https://openrouter.ai/models
   *
   * @param inputTokens - Number of input tokens
   * @param outputTokens - Number of output tokens
   * @param model - Model to estimate cost for
   * @returns Estimated cost in USD
   */
  estimateCost(inputTokens: number, outputTokens: number, model: string = this.defaultModel): number {
    // These rates are based on OpenRouter pricing as of the current date
    // Prices in USD per million tokens
    const rates: Record<string, { input: number; output: number }> = {
      // OpenAI models
      [OpenRouterModel.GPT4]: { input: 30.0, output: 60.0 },
      [OpenRouterModel.GPT4Turbo]: { input: 10.0, output: 30.0 },
      [OpenRouterModel.GPT41]: { input: 10.0, output: 30.0 },
      [OpenRouterModel.GPT41Preview]: { input: 10.0, output: 30.0 },
      [OpenRouterModel.GPT4o]: { input: 5.0, output: 15.0 },
      [OpenRouterModel.GPT4oMini]: { input: 1.5, output: 5.0 },
      [OpenRouterModel.GPT35Turbo]: { input: 0.5, output: 1.5 },
      [OpenRouterModel.GPT35Turbo16k]: { input: 0.5, output: 1.5 },

      // Anthropic models
      [OpenRouterModel.Claude3Opus]: { input: 15.0, output: 75.0 },
      [OpenRouterModel.Claude3Sonnet]: { input: 3.0, output: 15.0 },
      [OpenRouterModel.Claude3Haiku]: { input: 0.25, output: 1.25 },
      [OpenRouterModel.Claude37Sonnet]: { input: 3.0, output: 15.0 },

      // Google models
      [OpenRouterModel.Gemini]: { input: 0.0, output: 0.0 }, // Free tier
      [OpenRouterModel.GeminiFlash]: { input: 0.0, output: 0.35 },
      [OpenRouterModel.Gemini15Flash]: { input: 0.35, output: 1.05 },
      [OpenRouterModel.Gemini15Pro]: { input: 3.5, output: 10.5 },

      // Mistral models
      [OpenRouterModel.Mistral7B]: { input: 0.14, output: 0.42 },
      [OpenRouterModel.MistralSmall]: { input: 1.99, output: 5.99 },
      [OpenRouterModel.MistralMedium]: { input: 2.7, output: 8.1 },
      [OpenRouterModel.MistralLarge]: { input: 8.0, output: 24.0 },

      // Qwen models
      [OpenRouterModel.Qwen14B]: { input: 0.5, output: 1.5 },
      [OpenRouterModel.Qwen72B]: { input: 4.0, output: 5.0 },
      [OpenRouterModel.Qwen235B]: { input: 5.0, output: 10.0 },

      // Meta models
      [OpenRouterModel.Llama3]: { input: 0.14, output: 0.42 },
      [OpenRouterModel.Llama70B]: { input: 0.7, output: 0.85 },
      [OpenRouterModel.Llama405B]: { input: 1.5, output: 1.8 },
    };

    // Default to GPT-3.5 Turbo pricing if model not found
    const modelRates = rates[model] || rates[OpenRouterModel.GPT35Turbo];

    // Convert to per-token cost (rates are per million tokens)
    const inputCost = (inputTokens * modelRates.input) / 1000000;
    const outputCost = (outputTokens * modelRates.output) / 1000000;

    return inputCost + outputCost;
  }

  /**
   * Formats request payload according to OpenRouter API requirements
   *
   * @param messages - Array of messages
   * @param model - Model to use
   * @param params - Model parameters
   * @param responseFormat - Optional response format specification
   * @returns Formatted request payload
   */
  private formatRequest(
    messages: Message[],
    model: string,
    params: ModelParameters,
    responseFormat?: ResponseFormat
  ): RequestPayload {
    // Validate inputs
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new InvalidInputError("Messages must be a non-empty array");
    }

    // Construct the payload
    const payload: RequestPayload = {
      model,
      messages,
      temperature: params.temperature,
      top_p: params.top_p,
      max_tokens: params.max_tokens,
    };

    // Add optional parameters if provided
    if (params.presence_penalty !== undefined) {
      payload.presence_penalty = params.presence_penalty;
    }

    if (params.frequency_penalty !== undefined) {
      payload.frequency_penalty = params.frequency_penalty;
    }

    // Add response format if provided
    if (responseFormat) {
      payload.response_format = responseFormat;
    }

    return payload;
  }

  /**
   * Parses and validates response from OpenRouter API
   *
   * @param response - API response
   * @returns Parsed chat completion response
   */
  private parseResponse(response: unknown): ChatCompletionResponse {
    interface ApiResponse {
      id: string;
      choices: {
        index: number;
        message: Message;
        finish_reason: string;
      }[];
    }

    if (
      !response ||
      typeof response !== "object" ||
      !("id" in response) ||
      !("choices" in response) ||
      !Array.isArray((response as ApiResponse).choices)
    ) {
      throw new InvalidInputError("Invalid response format from OpenRouter API");
    }

    return response as ChatCompletionResponse;
  }

  /**
   * Validates API key format
   */
  private validateApiKey(): void {
    if (!this.apiKey || typeof this.apiKey !== "string" || this.apiKey.trim() === "") {
      throw new AuthenticationError("Invalid API key: API key is required");
    }

    // Additional validation could be added here
  }

  /**
   * Sends a request to the OpenRouter API
   *
   * @param url - Endpoint URL
   * @param data - Request payload
   * @returns API response
   */
  private async sendRequest(url: string, data: object): Promise<unknown> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "HTTP-Referer": "https://your-app-domain.com", // Should be configured by the app
      "X-Title": "YourAppName", // Should be configured by the app
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }

      throw new NetworkError(`Network error: ${(error as Error).message}`);
    }
  }

  /**
   * Handles HTTP error responses
   *
   * @param response - HTTP response
   */
  private async handleHttpError(response: Response): Promise<never> {
    let errorData: { error?: { message?: string; type?: string } } = {};

    try {
      errorData = await response.json();
    } catch {
      // If we can't parse the response as JSON, use the status text
    }

    const message = errorData.error?.message || response.statusText;
    const type = errorData.error?.type;

    switch (response.status) {
      case 401:
        throw new AuthenticationError(`Authentication error: ${message}`);
      case 429:
        throw new RateLimitError(`Rate limit exceeded: ${message}`);
      case 403:
        if (type === "insufficient_quota") {
          throw new QuotaExceededError(`Quota exceeded: ${message}`);
        }
        if (type === "content_filtered") {
          throw new ContentFilteredError(`Content filtered: ${message}`);
        }
        throw new OpenRouterError(message, "permission_denied", 403);
      case 408:
        throw new TimeoutError(`Request timeout: ${message}`);
      case 503:
        throw new ServiceUnavailableError(`Service unavailable: ${message}`);
      default:
        throw new OpenRouterError(
          `OpenRouter API error (${response.status}): ${message}`,
          "api_error",
          response.status
        );
    }
  }

  /**
   * Handles and transforms errors to appropriate types
   *
   * @param error - Error to handle
   * @returns Never returns, always throws an error
   */
  private handleError(error: unknown): never {
    if (error instanceof OpenRouterError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new NetworkError(`Network error: ${error.message}`);
    }

    if (error instanceof SyntaxError) {
      throw new InvalidInputError(`Invalid JSON response: ${error.message}`);
    }

    throw new OpenRouterError(
      `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
      "unknown_error"
    );
  }

  /**
   * Implements retry logic with exponential backoff
   *
   * @param operation - Operation to retry
   * @param maxRetries - Maximum number of retries
   * @returns Result of the operation
   */
  private async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (
          error instanceof AuthenticationError ||
          error instanceof InvalidInputError ||
          error instanceof ContentFilteredError ||
          error instanceof QuotaExceededError
        ) {
          throw error;
        }

        // On last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }

        // Otherwise wait and retry
        const backoffTime = exponentialBackoff(attempt);
        await delay(backoffTime);
      }
    }

    // This should never be reached due to the throw in the loop
    throw lastError;
  }
}
