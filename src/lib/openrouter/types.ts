/**
 * Types for OpenRouter service
 */

/**
 * Message structure for chat completions
 */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Model parameters for completions
 */
export interface ModelParameters {
  temperature: number;
  top_p: number;
  max_tokens: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

/**
 * Response format specification
 */
export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: object;
  };
}

/**
 * Model information
 */
export interface Model {
  id: string;
  name: string;
  provider: string;
  max_tokens: number;
  tokenizer: string;
}

/**
 * Request payload for OpenRouter API
 */
export interface RequestPayload {
  model: string;
  messages: Message[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  response_format?: ResponseFormat;
  stream?: boolean;
}

/**
 * Chat completion response
 */
export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Chat completion chunk for streaming
 */
export interface ChatCompletionChunk {
  id: string;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

/**
 * Available OpenRouter models
 *
 * Updated list of models available through OpenRouter.ai
 * Source: https://openrouter.ai/models
 */
export enum OpenRouterModel {
  // OpenAI models
  GPT4 = "openai/gpt-4",
  GPT4Turbo = "openai/gpt-4-turbo",
  GPT41 = "openai/gpt-4.1",
  GPT41Preview = "openai/gpt-4.1-preview",
  GPT4o = "openai/gpt-4o",
  GPT4oMini = "openai/gpt-4o-mini",
  GPT35Turbo = "openai/gpt-3.5-turbo",
  GPT35Turbo16k = "openai/gpt-3.5-turbo-16k",

  // Anthropic models
  Claude3Opus = "anthropic/claude-3-opus",
  Claude3Sonnet = "anthropic/claude-3-sonnet",
  Claude3Haiku = "anthropic/claude-3-haiku",
  Claude37Sonnet = "anthropic/claude-3.7-sonnet",

  // Google models
  Gemini = "google/gemini-pro",
  GeminiFlash = "google/gemini-flash",
  Gemini15Flash = "google/gemini-1.5-flash",
  Gemini15Pro = "google/gemini-1.5-pro",

  // Cheaper alternatives
  Mistral7B = "mistralai/mistral-7b-instruct",
  MistralSmall = "mistralai/mistral-small",
  MistralMedium = "mistralai/mistral-medium",
  MistralLarge = "mistralai/mistral-large-latest",

  // Qwen models from Alibaba
  Qwen14B = "qwen/qwen-14b-chat",
  Qwen72B = "qwen/qwen-72b",
  Qwen235B = "qwen/qwen3-235b-a22b",

  // Meta models
  Llama3 = "meta-llama/llama-3-8b-instruct",
  Llama70B = "meta-llama/llama-3-70b-instruct",
  Llama405B = "meta-llama/llama-3-405b-instruct",
}

/**
 * Default model parameters
 */
export const DEFAULT_PARAMS: ModelParameters = {
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 1000,
  presence_penalty: 0,
  frequency_penalty: 0,
};
