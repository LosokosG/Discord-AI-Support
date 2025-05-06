/* eslint-disable no-console */
import { Events } from "discord.js";
import apiService from "../services/api.js";
import knowledgeService from "../services/knowledge.js";
import askCommand from "../commands/admin/ask.js";
import { addHumanAssistanceButton } from "../utils/buttons.js";

// For ESLint
/* global console */

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(client, message) {
    // Ignore messages from bots (including itself)
    if (message.author.bot) return;

    // Only process messages in servers (guilds), not DMs
    if (!message.guild) return;

    const serverId = message.guild.id;
    const channelId = message.channel.id;

    try {
      // Get server configuration
      const serverConfig = await apiService.getServerConfig(serverId);

      // If server is not active or configuration is missing, ignore the message
      if (!serverConfig || !serverConfig.active || !serverConfig.config) return;

      // Check if the current channel is configured for auto-responses
      const isChannelEnabled = checkIfChannelIsEnabled(message.channel, serverConfig.config);

      // If channel isn't configured for auto-responses, ignore the message
      if (!isChannelEnabled) return;

      // Process the message just like the /ask command
      await processMessage(message, serverConfig);
    } catch (error) {
      console.error(`[messageCreate] Error processing message in server ${serverId}, channel ${channelId}:`, error);
    }
  },
};

/**
 * Check if the channel is enabled for auto-responses based on server config
 * @param {GuildChannel} channel - Discord channel object
 * @param {Object} config - Server configuration
 * @returns {boolean} - Whether the channel is enabled
 */
function checkIfChannelIsEnabled(channel, config) {
  // If no channels or categories are configured, return false
  if (!config.channels || !Array.isArray(config.channels) || config.channels.length === 0) {
    return false;
  }

  // Check if the channel ID is directly in the configured channels
  if (config.channels.includes(channel.id)) {
    return true;
  }

  // Check if the channel belongs to a configured category
  if (channel.parent && config.channels.includes(channel.parent.id)) {
    return true;
  }

  // If this is a thread, check if its parent channel is configured
  if (channel.isThread && channel.parent) {
    // Direct match with parent channel
    if (config.channels.includes(channel.parent.id)) {
      return true;
    }

    // Check if parent channel belongs to a configured category
    if (channel.parent.parent && config.channels.includes(channel.parent.parent.id)) {
      return true;
    }
  }

  return false;
}

/**
 * Process a message similar to the /ask command
 * @param {Message} message - Discord message object
 * @param {Object} serverConfig - Server configuration
 */
async function processMessage(message, serverConfig) {
  try {
    const question = message.content;
    const serverId = message.guild.id;
    const channelId = message.channel.id;
    const userId = message.author.id;
    const username = message.author.tag;
    const threadId = message.channel.isThread ? message.channel.id : null;

    // Definiujemy długość utrzymywania kontekstu w godzinach
    const CONTEXT_RETENTION_HOURS = 24;

    // Log message processing
    console.log(`[messageCreate] Processing message: "${question}" for server ${serverId}`);

    // Check if there's an active conversation for this user in this channel
    let activeConversation = await apiService.getActiveConversation(serverId, channelId, userId, threadId);
    let isNewConversation = !activeConversation;
    let conversationMessages = [];

    // Get context from knowledge base
    let knowledgeContext = "";
    let relevantDocsInfo = [];

    try {
      // Find relevant documents
      const relevantDocs = await knowledgeService.findRelevantDocuments(serverId, question);
      if (relevantDocs && relevantDocs.length > 0) {
        relevantDocsInfo = relevantDocs.map((doc) => ({
          id: doc.id,
          title: doc.title,
          score: doc.score || "unknown",
        }));
        console.log(
          `[messageCreate] Using ${relevantDocs.length} knowledge documents from server:`,
          JSON.stringify(relevantDocsInfo)
        );
      } else {
        console.log(`[messageCreate] No knowledge documents found for this server`);
      }

      // Prepare context with document content
      knowledgeContext = await knowledgeService.prepareContextForQuery(serverId, question);
    } catch (knowledgeError) {
      console.error("[messageCreate] Error getting knowledge context:", knowledgeError);
      // Continue without knowledge context
    }

    // Create a system message with knowledge context if available
    let systemContent =
      serverConfig.config.systemPrompt ||
      "You are AI Support Bot, a helpful assistant. Provide concise, accurate responses to user questions. When you don't know something, be honest about it.";

    if (knowledgeContext) {
      console.log(`[messageCreate] Added knowledge context (${knowledgeContext.length} characters) to the prompt`);
      systemContent +=
        "\n\nHere is all relevant information from our knowledge base for this server that may help you answer this question:\n\n" +
        knowledgeContext;
    } else {
      console.log("[messageCreate] No knowledge context available, using basic system prompt");
    }

    // Add conversation context info to system message
    systemContent += `\n\nYou're having a conversation with ${username}. Maintain context with their previous messages.`;

    const systemMessage = {
      role: "system",
      content: systemContent,
    };

    // Prepare the conversation messages for the AI
    if (isNewConversation) {
      // This is a new conversation, start with just the system and user message
      conversationMessages = [systemMessage, { role: "user", content: question }];

      // Create a new conversation in the database
      try {
        // Store just the user message, not the system message
        const initialMessage = { role: "user", content: question };
        activeConversation = await apiService.createConversation(
          serverId,
          channelId,
          userId,
          username,
          initialMessage,
          threadId
        );

        console.log(`[messageCreate] Created new conversation with ID ${activeConversation.id}`);
      } catch (dbError) {
        console.error("[messageCreate] Error creating conversation in database:", dbError);
        // Continue even if database operation failed
      }
    } else {
      // This is a continuation of an existing conversation
      console.log(`[messageCreate] Continuing conversation with ID ${activeConversation.id}`);

      // Get existing transcript and add the new user message
      const existingTranscript = activeConversation.transcript || [];

      // Add the previous conversation messages to the current context
      // We start with system message, then add the conversation history, then the new question
      conversationMessages = [systemMessage, ...existingTranscript, { role: "user", content: question }];

      // Check if we need to limit the conversation size to prevent token overflow
      if (conversationMessages.length > 20) {
        // If there are too many messages, keep the latest 15 (arbitrary limit, adjust as needed)
        const historySize = 15;
        const excessMessages = conversationMessages.length - historySize - 1; // -1 for system message
        conversationMessages = [
          systemMessage,
          ...conversationMessages.slice(excessMessages + 1), // Skip system message when slicing
        ];
        console.log(`[messageCreate] Limited conversation context to last ${historySize} messages`);
      }
    }

    // Indicate the bot is thinking by showing typing indicator
    await message.channel.sendTyping();

    console.log("[messageCreate] Sending request to AI model");
    const startTime = Date.now();

    // Use the OpenRouter client from the ask command
    const openRouterClient = askCommand.openRouterClient;

    const response = await openRouterClient.chatCompletion(conversationMessages);

    const endTime = Date.now();
    console.log(`[messageCreate] AI response received in ${endTime - startTime}ms`);

    if (!response || !response.choices || response.choices.length === 0) {
      console.error("[messageCreate] Invalid response from AI model:", response);
      return;
    }

    // Extract AI's reply
    const aiReply = response.choices[0].message.content;
    console.log(`[messageCreate] Generated response (${aiReply.length} characters)`);

    // Determine if we need to inform the user about context retention
    let responseContent = aiReply;

    // If this is a new conversation, add message about context retention
    if (isNewConversation) {
      // Add a note at the end of the first response
      const contextNote = `\n\n_Pamiętaj, że będę pamiętać kontekst naszej rozmowy przez ${CONTEXT_RETENTION_HOURS} godzin. Po tym czasie rozpoczniemy nową konwersację._`;

      // Only add the note if the combined length won't exceed Discord's limit
      if (responseContent.length + contextNote.length <= 2000) {
        responseContent += contextNote;
      }
    }

    // Get server language for button text
    const serverLanguage = serverConfig.config.language || serverConfig.config.language_code || "en";

    // Send response to the channel
    if (responseContent.length <= 2000) {
      // Add the human assistance button
      const messageOptions = addHumanAssistanceButton({ content: responseContent }, serverLanguage);

      await message.reply(messageOptions);
    } else {
      // For longer responses, split it
      // Send the first part with the button
      const firstPart = responseContent.substring(0, 1997) + "...";
      const messageOptions = addHumanAssistanceButton({ content: firstPart }, serverLanguage);

      await message.reply(messageOptions);

      // Send the rest as follow-up messages without buttons
      let remainingText = responseContent.substring(1997);
      while (remainingText.length > 0) {
        const chunk = remainingText.substring(0, 2000);
        await message.channel.send(chunk);
        remainingText = remainingText.substring(2000);
      }
    }

    console.log("[messageCreate] Response sent successfully");

    // Save the AI response to the conversation in the database
    if (activeConversation) {
      try {
        // Update the conversation with both the user message and AI response
        await apiService.updateConversation(activeConversation.id, serverId, [
          { role: "user", content: question },
          { role: "assistant", content: aiReply },
        ]);
        console.log(`[messageCreate] Updated conversation ${activeConversation.id} with new messages`);
      } catch (updateError) {
        console.error("[messageCreate] Error updating conversation:", updateError);
      }
    } else {
      // Only create a new conversation if we don't have an active one
      // This shouldn't normally happen as we already tried to create one earlier,
      // but it's a fallback just in case
      try {
        await apiService.saveConversation(serverId, {
          userId: message.author.id,
          username: message.author.tag,
          serverName: message.guild.name,
          question,
          answer: aiReply,
          hasKnowledgeContext: !!knowledgeContext,
          relevantDocuments: relevantDocsInfo.length > 0 ? relevantDocsInfo : undefined,
          status: "completed",
          channelId: message.channel.id,
          threadId: message.channel.isThread ? message.channel.id : null,
        });
        console.log("[messageCreate] New conversation saved to database");
      } catch (saveError) {
        console.error("[messageCreate] Error saving new conversation:", saveError);
      }
    }
  } catch (error) {
    console.error("[messageCreate] General error:", error);
  }
}
