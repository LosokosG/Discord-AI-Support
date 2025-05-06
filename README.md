# Discord AI Support Bot

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](package.json)
[![Node Version](https://img.shields.io/badge/node-22.14.0-green.svg)](.nvmrc)
[![Astro](https://img.shields.io/badge/Astro-5.5.5-orange.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](package.json)

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

Discord AI Support Bot automates first-line technical support on Discord servers, enabling server owners to reduce operational costs and time spent on repetitive questions. The bot uses AI to provide instant responses to user queries 24/7, with the ability to forward complex issues to human support staff when necessary.

### Key Features:

- AI-powered automatic responses based on an imported knowledge base
- Context-aware conversations within threads
- Human forwarding system with "Forward to a human" button
- Conversation transcripts stored in database
- Discord OAuth authenticated admin dashboard
- Sharding architecture for scalability (2500+ servers)

## Tech Stack

### Frontend

- **Framework**: React 19, Astro 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Shadcn/ui
- **Components**: Radix UI, Lucide React icons
- **State Management**: Zustand
- **Routing**: React Router DOM

### Backend

- **Supabase** for:
  - PostgreSQL database
  - Authentication
  - Backend-as-a-Service SDK

### Discord Bot

- **DiscordJS** for bot implementation
- **Sharding** architecture for scalability

### AI Integration

- **Openrouter.ai** for access to various AI models:
  - OpenAI
  - Anthropic
  - Google models
  - Others

### Testing

- **Unit Testing**:
  - Vitest/Jest for testing JavaScript/TypeScript code
  - React Testing Library (RTL) for testing React components
- **End-to-End Testing**:
  - Playwright for testing the admin panel UI
  - Custom Node.js scripts with DiscordJS for bot interaction testing
  - Supertest for API testing

### CI/CD & Hosting

- **GitHub Actions** for CI/CD pipelines
- **DigitalOcean** for hosting via Docker

## Getting Started Locally

### Prerequisites

- Node.js version 22.14.0 (as specified in .nvmrc)
- Discord developer account and bot token
- Supabase account or self-hosted Supabase instance
- Openrouter.ai API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/LosokosG/Discord-AI-Support.git
   cd discord-ai-support-bot
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   # Discord
   DISCORD_BOT_TOKEN=your_bot_token
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret

   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the Astro development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the built project locally
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier

## Project Scope

The MVP (Minimum Viable Product) focuses primarily on the Discord bot functionality and its ability to effectively automate support. The admin dashboard is implemented in a basic form with plans for expansion in future versions.

### Included in MVP:

- Functional and scalable Discord bot with full AI implementation
- Architecture enabling easy configuration and management
- Automatic responses based on knowledge base
- Human forwarding system
- Conversation transcript storage
- Basic administrative dashboard

### Excluded from MVP:

- Advanced dashboard features (visualizations, extensive statistics)
- Integrations with platforms other than Discord
- Advanced knowledge base categorization/tagging
- Advanced usage analytics
- Support team queuing system
- Different access levels in dashboard
- Monetization implementation
- Advanced shard management interface

## Project Status

Current version: 0.0.1 (Early Development)

The project is currently in early development stage focusing on implementing the core Discord bot functionality as outlined in the MVP scope.

### Roadmap:

1. Implement basic Discord bot functions
2. Develop bot sharding mechanism
3. Integrate AI model and knowledge base handling
4. Implement human forwarding system
5. Develop configuration API
6. Create Discord OAuth authentication and basic dashboard
7. Implement bot configuration retrieval mechanisms

### Future Plans:

- Expanded administrative dashboard
- Advanced knowledge base management interface
- Advanced shard monitoring and management system
- Subscription-based monetization
- Advanced knowledge base categorization
- Integrations with other platforms
- Support team queuing system
- Advanced analytics and reporting

## License

This project is currently not licensed under any specific license. All rights reserved.

---

_Note: This README is a living document and will be updated as the project evolves._

# OpenRouter Service for Discord Bot

This service provides a clean TypeScript interface for communicating with the OpenRouter API, allowing your Discord bot to interact with various large language models (LLMs).

## Features

- Access to 30+ AI models through a single interface, including:
  - OpenAI: GPT-4, GPT-4o, GPT-4.1, GPT-3.5 Turbo
  - Anthropic: Claude 3 Opus, Claude 3.7 Sonnet, Claude 3 Haiku
  - Google: Gemini (free), Gemini 1.5 Pro, Gemini 1.5 Flash
  - Meta: Llama 3 (8B, 70B, 405B variants)
  - Mistral: 7B, Small, Medium, Large models
  - Qwen: 14B, 72B, 235B models
- Type-safe API with TypeScript interfaces
- Comprehensive error handling with specific error types
- Automatic retry logic with exponential backoff
- Accurate cost estimation based on current API pricing
- Compatible with Discord.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- TypeScript (v4.5 or higher)
- Discord.js (v14 or higher)
- An OpenRouter API key (from https://openrouter.ai/)

### Installation

The OpenRouter service is included with your project. It's located in `src/lib/openrouter`.

### Basic Usage

```typescript
import { OpenRouterService, OpenRouterModel } from "../lib/openrouter";

// Create an instance of the service
const openRouter = new OpenRouterService(process.env.OPENROUTER_API_KEY || "", OpenRouterModel.GPT35Turbo);

// Example function to call the AI
async function askAI(question: string) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: question,
      },
    ];

    const completion = await openRouter.chatCompletion(messages);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    throw error;
  }
}
```

### Advanced Usage

You can specify different models and parameters:

```typescript
const response = await openRouter.chatCompletion(messages, {
  model: OpenRouterModel.GPT4o, // Use GPT-4o for better capabilities
  params: {
    temperature: 0.8,
    max_tokens: 500,
    top_p: 0.95,
  },
});
```

You can also use structured output with JSON schema:

```typescript
const response = await openRouter.chatCompletion(messages, {
  responseFormat: {
    type: "json_schema",
    json_schema: {
      name: "user_info",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name"],
      },
    },
  },
});
```

### Cost Management

The service includes an accurate cost estimation method:

```typescript
// Get token usage from completion
const { prompt_tokens, completion_tokens } = completion.usage;

// Estimate cost in USD
const cost = openRouter.estimateCost(prompt_tokens, completion_tokens, OpenRouterModel.Claude37Sonnet);

console.log(`Estimated cost: $${cost.toFixed(6)}`);
```

## Model Selection Guide

### Budget-friendly options:

- **Gemini**: Free tier, good for basic tasks
- **Mistral 7B**: $0.14/M input, $0.42/M output tokens
- **Llama 3 (8B)**: $0.14/M input, $0.42/M output tokens
- **GPT-3.5 Turbo**: $0.50/M input, $1.50/M output tokens

### Balanced performance/cost:

- **Claude 3 Haiku**: $0.25/M input, $1.25/M output tokens
- **GPT-4o Mini**: $1.50/M input, $5.00/M output tokens
- **Mistral Medium**: $2.70/M input, $8.10/M output tokens

### High performance:

- **Claude 3.7 Sonnet**: $3.00/M input, $15.00/M output tokens
- **GPT-4o**: $5.00/M input, $15.00/M output tokens
- **GPT-4.1**: $10.00/M input, $30.00/M output tokens
- **Claude 3 Opus**: $15.00/M input, $75.00/M output tokens

## Discord Bot Integration

Check out the example in `src/discord-bot/examples/openrouter-example.ts` for a complete example of how to integrate the OpenRouter service with a Discord bot slash command.

## API Reference

### `OpenRouterService`

The main class for interacting with the OpenRouter API.

#### Constructor

```typescript
constructor(
  apiKey: string,
  defaultModel: string = OpenRouterModel.GPT35Turbo,
  defaultParams: ModelParameters = DEFAULT_PARAMS,
  baseUrl: string = "https://openrouter.ai/api/v1"
)
```

#### Methods

- `chatCompletion(messages, options?)`: Sends a completion request
- `getAvailableModels()`: Retrieves available models
- `estimateCost(inputTokens, outputTokens, model?)`: Estimates cost for token usage

### Error Handling

The service includes a comprehensive set of error classes:

- `OpenRouterError`: Base error class
- `AuthenticationError`: API key issues
- `RateLimitError`: Rate limit exceeded
- `QuotaExceededError`: Usage quota exceeded
- `ServiceUnavailableError`: OpenRouter API unavailable
- `TimeoutError`: Request timeout
- `InvalidInputError`: Invalid input parameters
- `ContentFilteredError`: Content flagged by moderation filters
- `NetworkError`: Network connectivity issues

Example error handling:

```typescript
try {
  const response = await openRouter.chatCompletion(messages);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("API key is invalid or expired");
  } else if (error instanceof RateLimitError) {
    console.error("Rate limit exceeded, try again later");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Environment Variables

Set up the following environment variables:

```
OPENROUTER_API_KEY=your_api_key_here
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the API
- DiscordJS community for the excellent Discord bot framework

# AI Support Bot

This Discord bot uses AI to provide automated support for your Discord server.

## Features

### Slash Commands

- `/ask <question>` - Ask the AI a question
- `/config auto_respond <channel> <enabled>` - Configure channels for automatic responses
- `/config list` - List channels configured for automatic responses

### Auto-Response Feature

The bot can automatically respond to any message in designated channels or categories without requiring the `/ask` command. This creates a natural chat experience in specific support channels.

#### How to Set Up Auto-Responses

1. Configure channels or categories where the bot should automatically respond:

   ```
   /config auto_respond channel:#your-channel enabled:true
   ```

2. To add a whole category (all channels under it):

   ```
   /config auto_respond channel:Your Category Name enabled:true
   ```

3. To view configured channels:

   ```
   /config list
   ```

4. To disable auto-responses in a channel:
   ```
   /config auto_respond channel:#your-channel enabled:false
   ```

#### Threads Support

The bot automatically responds in all threads created in configured channels or categories. This allows for organized conversations while maintaining AI assistance.

#### Welcome Messages

The bot sends a welcome message with instructions in:

- New threads created in configured channels
- New channels created in configured categories

This ensures users know they can interact with the bot directly in that channel or thread.

#### Notes

- The bot will only respond in explicitly configured channels/categories and their threads
- Auto-responses use the same knowledge base and AI model as the `/ask` command
- Server admins can customize the system prompt via the dashboard
- Auto-responses are recorded in the conversation history same as `/ask` commands

### Conversation Context Memory

The bot maintains conversation context with users to provide more natural interactions:

- Each user can have multiple concurrent conversations across different channels and servers
- The bot remembers the conversation history for 24 hours
- Users are informed about context retention when starting a new conversation
- Conversations are automatically cleaned up after 24 hours of inactivity
- The context is stored securely in the database

This feature allows the bot to reference previous messages, understand follow-up questions, and provide continuity in conversations without requiring users to repeat information.

## Installation & Setup

[Your existing installation instructions here]
