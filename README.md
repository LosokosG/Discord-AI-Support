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

*Note: This README is a living document and will be updated as the project evolves.* 