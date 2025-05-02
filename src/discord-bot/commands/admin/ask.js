/* eslint-disable no-console */
import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

// Dla ESLint
/* global process, console, setTimeout, fetch */

// Load environment variables
dotenv.config();

// Import our services
import apiService from "../../services/api.js";
import knowledgeService from "../../services/knowledge.js";
import { addHumanAssistanceButton } from "../../utils/buttons.js";

// Check if OpenRouter API key is available
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-4.1-mini";

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
      }, 100); // Szybsza odpowiedź mokowa
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
    )
    .addBooleanOption((option) =>
      option.setName("force_refresh").setDescription("Force refresh of knowledge and config data").setRequired(false)
    ),

  // Expose the OpenRouter client so it can be used by other modules
  openRouterClient,

  async execute(interaction) {
    // Natychmiast odpowiedz z placeholder, żeby interakcja nie wygasła
    await interaction
      .reply({
        content: "🔍 Processing your question...",
        fetchReply: true,
      })
      .catch((err) => {
        console.error("Error with initial reply:", err);
        return;
      });

    try {
      const question = interaction.options.getString("question");
      const serverId = interaction.guildId;
      const forceRefresh = interaction.options.getBoolean("force_refresh") || false;

      if (forceRefresh) {
        console.log(`[/ask] Force refresh requested for server ${serverId}`);
        // Clear caches for this server
        knowledgeService.clearCache(serverId);
        apiService.clearCache(`server_config_${serverId}`);
      }

      console.log(`[/ask] Processing question: "${question}" for server ${serverId}`);

      // Defensywne sprawdzenie importów usług
      if (!knowledgeService || !apiService) {
        console.error("Service imports failed:", {
          knowledgeService: !!knowledgeService,
          apiService: !!apiService,
        });

        await interaction.editReply("Error: Service imports failed. Please contact the administrator.").catch((err) => {
          console.error("Error editing reply after service import failure:", err);
        });
        return;
      }

      // Ensure server exists in database
      try {
        await apiService.ensureServerExists(interaction.guild);
        console.log(`[/ask] Server ${serverId} exists or was added to the database`);
      } catch (serverError) {
        console.warn(`[/ask] Could not ensure server ${serverId} exists:`, serverError);
        // Continue anyway, as the AI response doesn't strictly depend on the database
      }

      // Asynchronicznie pobierz kontekst bazy wiedzy
      console.log(`[/ask] Finding all knowledge documents for server ${serverId}`);
      let knowledgeContext = "";
      let relevantDocsInfo = [];

      try {
        // Najpierw pobieramy listę dokumentów do loggowania
        const relevantDocs = await knowledgeService.findRelevantDocuments(serverId, question, forceRefresh);
        if (relevantDocs && relevantDocs.length > 0) {
          relevantDocsInfo = relevantDocs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            score: doc.score || "unknown",
          }));
          console.log(
            `[/ask] Using all ${relevantDocs.length} knowledge documents from server:`,
            JSON.stringify(relevantDocsInfo)
          );
        } else {
          console.log(`[/ask] No knowledge documents found for this server`);
        }

        // Teraz pobierz pełny kontekst z zawartością dokumentów
        knowledgeContext = await knowledgeService.prepareContextForQuery(serverId, question, forceRefresh);
      } catch (knowledgeError) {
        console.error("[/ask] Error getting knowledge context:", knowledgeError);
        // Continue without knowledge context
      }

      // Create a system message with knowledge context if available
      let systemContent;
      let serverConfig;

      try {
        // Get server config to access custom system prompt
        serverConfig = await apiService.getServerConfig(serverId, forceRefresh);

        // Use the server's custom system prompt if available
        if (serverConfig?.config?.systemPrompt) {
          systemContent = serverConfig.config.systemPrompt;
          console.log(`[/ask] Using custom system prompt from server config`);
        } else {
          systemContent =
            "You are AI Support Bot, a helpful assistant. Provide concise, accurate responses to user questions. When you don't know something, be honest about it.";
          console.log(`[/ask] No custom prompt found, using default system prompt`);
        }
      } catch (configError) {
        // Fallback to default if we can't get the server config
        systemContent =
          "You are AI Support Bot, a helpful assistant. Provide concise, accurate responses to user questions. When you don't know something, be honest about it.";
        console.warn(`[/ask] Error getting server config: ${configError.message}, using default system prompt`);
      }

      if (knowledgeContext) {
        console.log(`[/ask] Added knowledge context (${knowledgeContext.length} characters) to the prompt`);
        systemContent +=
          "\n\nHere is all relevant information from our knowledge base for this server that may help you answer this question:\n\n" +
          knowledgeContext;
      } else {
        console.log("[/ask] No knowledge context available, using basic system prompt");
      }

      const systemMessage = {
        role: "system",
        content: systemContent,
      };

      // Create user message
      const userMessage = {
        role: "user",
        content: question,
      };

      console.log("[/ask] Sending request to AI model");
      const startTime = Date.now();

      // Get AI response
      const response = await openRouterClient.chatCompletion([systemMessage, userMessage]);

      const endTime = Date.now();
      console.log(`[/ask] AI response received in ${endTime - startTime}ms`);

      if (!response || !response.choices || response.choices.length === 0) {
        console.error("[/ask] Invalid response from AI model:", response);

        await interaction
          .editReply("Sorry, I couldn't generate a response at this time. Please try again later.")
          .catch((err) => {
            console.error("Error editing reply after invalid AI response:", err);
          });
        return;
      }

      // Extract AI's reply
      const aiReply = response.choices[0].message.content;
      console.log(`[/ask] Generated response (${aiReply.length} characters)`);

      // Get server language for button text
      const serverLanguage = serverConfig?.config?.language || serverConfig?.config?.language_code || "en";

      // Send response to user (limit to 2000 chars if it's too long)
      try {
        if (aiReply.length <= 2000) {
          // Add human assistance button to the reply
          const messageOptions = addHumanAssistanceButton({ content: aiReply }, serverLanguage);

          await interaction.editReply(messageOptions);
        } else {
          // For longer responses, split it
          // Send first part with button
          const firstPart = aiReply.substring(0, 1997) + "...";
          const messageOptions = addHumanAssistanceButton({ content: firstPart }, serverLanguage);

          await interaction.editReply(messageOptions);

          // Send the rest as follow-up messages without buttons
          let remainingText = aiReply.substring(1997);
          while (remainingText.length > 0) {
            const chunk = remainingText.substring(0, 2000);
            await interaction.followUp({
              content: chunk,
            });
            remainingText = remainingText.substring(2000);
          }
        }
        console.log("[/ask] Response sent to user successfully");
      } catch (replyError) {
        console.error("[/ask] Error sending reply:", replyError);
      }

      // Save the conversation to the database
      try {
        // First, check if there's an active conversation for this user in this channel
        const activeConversation = await apiService.getActiveConversation(
          serverId,
          interaction.channelId,
          interaction.user.id
        );

        if (activeConversation) {
          // Update existing conversation
          await apiService.updateConversation(activeConversation.id, serverId, [
            { role: "user", content: question },
            { role: "assistant", content: aiReply },
          ]);
          console.log(`[/ask] Updated existing conversation ${activeConversation.id} with new messages`);
        } else {
          // Create new conversation
          await apiService.saveConversation(serverId, {
            userId: interaction.user.id,
            username: interaction.user.tag,
            serverName: interaction.guild.name,
            question,
            answer: aiReply,
            hasKnowledgeContext: !!knowledgeContext,
            relevantDocuments: relevantDocsInfo.length > 0 ? relevantDocsInfo : undefined,
            status: "active", // Set as active so it can be continued
            channelId: interaction.channelId,
          });
          console.log("[/ask] New conversation saved to database");
        }
      } catch (saveError) {
        console.error("[/ask] Error saving conversation:", saveError);
      }
    } catch (error) {
      console.error("[/ask] General error:", error);

      try {
        await interaction.editReply({
          content: `⚠️ There was an error processing your request: ${error.message || "Unknown error"}`,
        });
      } catch (followupError) {
        console.error("[/ask] Error sending error response:", followupError);
      }
    }
  },
};
