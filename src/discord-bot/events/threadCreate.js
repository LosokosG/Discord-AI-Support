import { Events, EmbedBuilder } from "discord.js";
import apiService from "../services/api.js";

// For ESLint
/* global console */

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(client, thread) {
    // Ignore threads created by the bot itself
    if (thread.ownerId === client.user.id) return;

    // Only process threads in servers (guilds)
    if (!thread.guild) return;

    const serverId = thread.guild.id;
    const parentChannelId = thread.parentId;

    try {
      // Get server configuration
      const serverConfig = await apiService.getServerConfig(serverId);

      // If server is not active or configuration is missing, ignore the thread
      if (!serverConfig || !serverConfig.active || !serverConfig.config) return;

      // Check if the parent channel or its category is in the configured channels
      const isParentEnabled = checkIfParentChannelIsEnabled(thread, serverConfig.config);

      // If parent channel isn't configured, ignore the thread
      if (!isParentEnabled) return;

      // Send welcome message in thread
      await sendWelcomeMessage(thread, serverConfig);

      console.log(`[threadCreate] Sent welcome message in new thread "${thread.name}" (${thread.id})`);
    } catch (error) {
      console.error(`[threadCreate] Error processing new thread in server ${serverId}:`, error);
    }
  },
};

/**
 * Check if the parent channel of a thread is enabled for auto-responses
 * @param {ThreadChannel} thread - Discord thread object
 * @param {Object} config - Server configuration
 * @returns {boolean} - Whether the parent channel is enabled
 */
function checkIfParentChannelIsEnabled(thread, config) {
  // If no channels are configured, return false
  if (!config.channels || !Array.isArray(config.channels) || config.channels.length === 0) {
    return false;
  }

  // Get parent channel
  const parentChannel = thread.parent;
  if (!parentChannel) return false;

  // Check if the parent channel ID is directly in the configured channels
  if (config.channels.includes(parentChannel.id)) {
    return true;
  }

  // Check if the parent channel belongs to a configured category
  if (parentChannel.parent && config.channels.includes(parentChannel.parent.id)) {
    return true;
  }

  return false;
}

/**
 * Send a welcome message in a new thread
 * @param {ThreadChannel} thread - Discord thread object
 * @param {Object} serverConfig - Server configuration
 */
async function sendWelcomeMessage(thread, serverConfig) {
  // Create embed for welcome message
  const embed = new EmbedBuilder()
    .setColor(0x5865f2) // Discord blue color
    .setTitle("👋 Witaj w nowym wątku!")
    .setDescription(
      "Ten wątek jest obsługiwany przez AI Support Bot. Możesz zadawać pytania bezpośrednio tutaj, a ja postaram się na nie odpowiedzieć."
    )
    .addFields(
      {
        name: "Jak to działa?",
        value: "Po prostu napisz swoje pytanie w tym wątku, a ja automatycznie na nie odpowiem.",
      },
      { name: "Pomoc", value: "W każdej chwili możesz użyć komendy `/ask` aby zadać pytanie bezpośrednio." }
    )
    .setFooter({ text: "AI Support Bot" })
    .setTimestamp();

  // Customize message if server has custom system prompt
  if (serverConfig.config?.systemPrompt) {
    // Extract first sentence from system prompt to personalize message
    const firstSentence = serverConfig.config.systemPrompt.split(/[.!?][\s\n]/)[0];
    if (firstSentence && firstSentence.length < 100) {
      embed.setDescription(
        `${firstSentence}. Ten wątek jest obsługiwany przez AI Support Bot i możesz zadawać pytania bezpośrednio tutaj.`
      );
    }
  }

  // Send welcome message
  await thread.send({ embeds: [embed] });
}
