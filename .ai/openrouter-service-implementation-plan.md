# OpenRouter Service Implementation Plan

## 1. Service Description

The OpenRouter service will act as a middleware layer between our application and the OpenRouter API, providing access to various LLM models. This service will:

- Handle authentication with the OpenRouter API
- Format requests according to specific model requirements
- Process responses from models
- Manage error handling and retries
- Track usage and costs

## 2. Constructor

```typescript
class OpenRouterService {
  constructor(
    private readonly apiKey: string,
    private readonly defaultModel: string = "openai/gpt-3.5-turbo",
    private readonly defaultParams: ModelParameters = DEFAULT_PARAMS,
    private readonly baseUrl: string = "https://openrouter.ai/api/v1"
  ) {
    this.validateApiKey();
  }
}
```

## 3. Public Methods and Fields

### 3.1 Chat Completion

```typescript
async chatCompletion(
  messages: Message[],
  options?: {
    model?: string;
    params?: Partial<ModelParameters>;
    responseFormat?: ResponseFormat;
  }
): Promise<ChatCompletionResponse>
```

Sends a chat completion request to OpenRouter API with the provided messages and options.

### 3.2 Stream Chat Completion

```typescript
async streamChatCompletion(
  messages: Message[],
  callback: (chunk: ChatCompletionChunk) => void,
  options?: {
    model?: string;
    params?: Partial<ModelParameters>;
    responseFormat?: ResponseFormat;
  }
): Promise<void>
```

Sends a streaming chat completion request with provided callback for processing chunks.

### 3.3 Get Available Models

```typescript
async getAvailableModels(): Promise<Model[]>
```

Retrieves a list of available models from OpenRouter API.

### 3.4 Cost Estimation

```typescript
estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string = this.defaultModel
): number
```

Estimates the cost for a given number of tokens and model.

## 4. Private Methods and Fields

### 4.1 Request Formatting

```typescript
private formatRequest(
  messages: Message[],
  model: string,
  params: ModelParameters,
  responseFormat?: ResponseFormat
): RequestPayload
```

Formats the request payload according to OpenRouter API requirements.

### 4.2 Response Parsing

```typescript
private parseResponse(response: any): ChatCompletionResponse
```

Parses and validates the response from OpenRouter API.

### 4.3 Authentication

```typescript
private validateApiKey(): void
```

Validates that the API key is properly formatted and not empty.

### 4.4 Error Handling

```typescript
private handleError(error: any): never
```

Processes API errors and throws standardized application errors.

### 4.5 Retry Logic

```typescript
private async withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T>
```

Implements retry logic with exponential backoff for resilient API communication.

## 5. Error Handling

The service will handle the following error scenarios:

1. **Authentication Errors**: Thrown when API key is invalid or expired
2. **Rate Limiting**: Implements backoff strategy and retries
3. **Quota Exceeded**: Monitors token usage and throws errors when limits are reached
4. **Service Unavailability**: Detects when OpenRouter or underlying models are down
5. **Timeout Errors**: Handles requests that take too long to complete
6. **Malformed Responses**: Validates and safely parses responses
7. **Model-specific Errors**: Handles cases where models reject specific inputs
8. **Content Filtering**: Manages content flagged as inappropriate
9. **Network Errors**: Handles connection issues between application and API
10. **Input Validation**: Validates messages before sending to prevent errors

## 6. Security Considerations

1. **API Key Protection**: Store the API key in environment variables
2. **Request/Response Sanitization**: Sanitize inputs and outputs to prevent injection attacks
3. **Data Privacy**: Implement logging that excludes sensitive user data
4. **Rate Limiting**: Implement client-side rate limiting to prevent abuse
5. **Audit Logging**: Track API usage for security monitoring

## 7. Step-by-Step Implementation Plan

### Step 1: Set Up Project Structure

Create the following files:

- `src/lib/openrouter/types.ts` - TypeScript interfaces and types
- `src/lib/openrouter/service.ts` - Main service implementation
- `src/lib/openrouter/errors.ts` - Custom error classes
- `src/lib/openrouter/utils.ts` - Helper functions

### Step 2: Define TypeScript Interfaces

In `types.ts`, define interfaces for:

```typescript
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ModelParameters {
  temperature: number;
  top_p: number;
  max_tokens: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: object;
  };
}

interface Model {
  id: string;
  name: string;
  provider: string;
  max_tokens: number;
  tokenizer: string;
}

// Add other necessary interfaces
```

### Step 3: Implement Core Service

In `service.ts`, implement the OpenRouterService class with all required methods.

### Step 4: Implement Error Handling

In `errors.ts`, create custom error classes:

```typescript
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

export class AuthenticationError extends OpenRouterError {
  constructor(message: string) {
    super(message, "authentication_error", 401);
  }
}

// Define other specific error classes
```

### Step 5: Implement Helper Functions

In `utils.ts`, implement utility functions:

```typescript
export function calculateTokens(text: string): number {
  // Approximate token count (implement a more accurate method if possible)
  return Math.ceil(text.length / 4);
}

export function validateResponseFormat(format: ResponseFormat): void {
  // Validation logic
}

// Other utility functions
```

### Step 6: OpenRouter API Integration

Implement the specific methods for interacting with OpenRouter API:

#### 6.1 System Message Configuration

```typescript
// Example usage in service
function createSystemMessage(content: string): Message {
  return {
    role: "system",
    content,
  };
}
```

#### 6.2 User Message Formatting

```typescript
// Example usage in service
function createUserMessage(content: string): Message {
  return {
    role: "user",
    content,
  };
}
```

#### 6.3 Response Format Implementation

```typescript
// Example in service
const jsonResponseFormat: ResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "search_results",
    strict: true,
    schema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              url: { type: "string" },
            },
            required: ["title", "url"],
          },
        },
      },
      required: ["results"],
    },
  },
};
```

#### 6.4 Model Selection

```typescript
// Define available models
export enum OpenRouterModel {
  GPT4 = "openai/gpt-4",
  GPT35Turbo = "openai/gpt-3.5-turbo",
  Claude = "anthropic/claude-3-opus",
  Gemini = "google/gemini-pro",
}
```

#### 6.5 Model Parameters

```typescript
// Default parameters
export const DEFAULT_PARAMS: ModelParameters = {
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 1000,
  presence_penalty: 0,
  frequency_penalty: 0,
};
```

### Step 7: Test the Implementation

Create unit tests for each component of the service:

- Authentication flow
- Request formatting
- Response parsing
- Error handling
- Cost estimation

### Step 8: Documentation

Create comprehensive documentation for the service including:

- Setup instructions
- Usage examples
- Configuration options
- Troubleshooting guides
