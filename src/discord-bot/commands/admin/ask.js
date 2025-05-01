import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

// Dla ESLint
/* global process, console, setTimeout, fetch */

// Load environment variables
dotenv.config();

// Check if OpenRouter API key is available
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-3.5-turbo";

// Prosta implementacja klienta OpenRouter bezpośrednio w JavaScript
const openRouterClient = {
  async chatCompletion(messages, model = OPENROUTER_MODEL) {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      console.log("Using mock OpenRouter service (API key not provided)");
      return this.mockResponse(messages);
    }

    console.log(`Sending real request to OpenRouter API using model: ${model}`);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://discord-ai-support-bot.example.com", // Wymagane przez OpenRouter
          "X-Title": "Discord AI Support Bot", // Nazwa aplikacji dla OpenRouter
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling OpenRouter API:", error);
      // W przypadku błędu zwróć mock
      return this.mockResponse(messages);
    }
  },

  mockResponse(messages) {
    console.log("Mock OpenRouter service called with messages:", messages);

    // Simulate a delay to make it feel like an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-completion-id",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: `This is a mock response from the OpenRouter service. In a real implementation, this would be a response from an AI model.\n\nYour question was: "${messages[messages.length - 1].content}"\n\nWhen you add a valid OpenRouter API key to your .env file, you'll get real AI responses!`,
              },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 50,
            completion_tokens: 100,
            total_tokens: 150,
          },
        });
      }, 1000);
    });
  },
};

console.log(
  "OpenRouter client initialized, using real API:",
  OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "your_openrouter_api_key_here"
);

export default {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask AI a question")
    .addStringOption((option) =>
      option.setName("question").setDescription("The question you want to ask the AI").setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Natychmiast odrocz odpowiedź, aby uniknąć błędów czasowych
      await interaction.deferReply();

      const question = interaction.options.getString("question");

      // Create a basic system message for the AI
      const systemMessage = {
        role: "system",
        content:
          "You are AI Support Bot, a helpful assistant. Provide concise, accurate responses to user questions. When you don't know something, be honest about it.",
      };

      // Create user message
      const userMessage = {
        role: "user",
        content: question,
      };

      console.log("Sending question to OpenRouter:", question);

      // Get AI response
      const response = await openRouterClient.chatCompletion([systemMessage, userMessage]);

      console.log("Received response from OpenRouter", response.choices ? "with choices" : "without choices");

      // Extract AI's reply
      const aiReply = response.choices[0].message.content;

      // Sprawdź czy interakcja jest nadal ważna przed odpowiedzią
      if (interaction.replied || interaction.deferred) {
        // Send response to user (limit to 2000 chars if it's too long)
        if (aiReply.length <= 2000) {
          await interaction.editReply({
            content: aiReply,
          });
        } else {
          // For longer responses, split it
          await interaction.editReply({
            content: aiReply.substring(0, 1997) + "...",
          });

          // Send the rest as follow-up messages
          let remainingText = aiReply.substring(1997);
          while (remainingText.length > 0) {
            const chunk = remainingText.substring(0, 2000);
            await interaction.followUp({
              content: chunk,
            });
            remainingText = remainingText.substring(2000);
          }
        }
      } else {
        console.warn("Interaction is no longer valid. Cannot respond.");
      }
    } catch (error) {
      console.error("Error in /ask command:", error);

      try {
        // Sprawdź czy interakcja jest nadal ważna przed odpowiedzią na błąd
        if (interaction.replied) {
          await interaction.followUp({
            content: `⚠️ There was an error processing your request: ${error.message || "Unknown error"}`,
            ephemeral: true,
          });
        } else if (interaction.deferred) {
          await interaction.editReply({
            content: `⚠️ There was an error processing your request: ${error.message || "Unknown error"}`,
          });
        }
      } catch (followupError) {
        console.error("Error sending error response:", followupError);
      }
    }
  },
};
