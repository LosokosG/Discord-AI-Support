/* eslint-disable no-console */
import { Events, EmbedBuilder, ChannelType } from "discord.js";
import apiService from "../services/api.js";

// For ESLint
/* global console */

export default {
  name: Events.ChannelCreate,
  once: false,
  async execute(client, channel) {
    // Only process text channels in servers (guilds)
    if (
      !channel.guild ||
      (channel.type !== ChannelType.GuildText &&
        channel.type !== ChannelType.GuildAnnouncement &&
        channel.type !== ChannelType.GuildForum)
    ) {
      return;
    }

    const serverId = channel.guild.id;

    try {
      // Get server configuration
      const serverConfig = await apiService.getServerConfig(serverId);

      // If server is not active or configuration is missing, ignore the channel
      if (!serverConfig || !serverConfig.active || !serverConfig.config) return;

      // Check if the new channel's category is in the configured channels
      const isCategoryEnabled = checkIfCategoryIsEnabled(channel, serverConfig.config);

      // If category isn't configured, ignore the channel
      if (!isCategoryEnabled) return;

      // Send welcome message in channel
      await sendWelcomeMessage(channel, serverConfig);

      console.log(`[channelCreate] Sent welcome message in new channel "${channel.name}" (${channel.id})`);
    } catch (error) {
      console.error(`[channelCreate] Error processing new channel in server ${serverId}:`, error);
    }
  },
};

/**
 * Check if the category of a channel is enabled for auto-responses
 * @param {TextChannel} channel - Discord channel object
 * @param {Object} config - Server configuration
 * @returns {boolean} - Whether the category is enabled
 */
function checkIfCategoryIsEnabled(channel, config) {
  // If no channels are configured, return false
  if (!config.channels || !Array.isArray(config.channels) || config.channels.length === 0) {
    return false;
  }

  // Check if the channel's category is in the configured channels
  if (channel.parent && config.channels.includes(channel.parent.id)) {
    return true;
  }

  return false;
}

/**
 * Send a welcome message in a new channel
 * @param {TextChannel} channel - Discord channel object
 * @param {Object} serverConfig - Server configuration
 */
async function sendWelcomeMessage(channel, serverConfig) {
  // Create embed for welcome message
  const embed = new EmbedBuilder()
    .setColor(0x5865f2) // Discord blue color
    .setTitle("👋 Witaj na nowym kanale!")
    .setDescription(
      "Ten kanał jest obsługiwany przez AI Support Bot. Możesz zadawać pytania bezpośrednio tutaj, a ja postaram się na nie odpowiedzieć."
    )
    .addFields(
      {
        name: "Jak to działa?",
        value: "Po prostu napisz swoje pytanie na tym kanale, a ja automatycznie na nie odpowiem.",
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
        `${firstSentence}. Ten kanał jest obsługiwany przez AI Support Bot i możesz zadawać pytania bezpośrednio tutaj.`
      );
    }
  }

  // Try to send welcome message
  try {
    // Check if bot has permissions to send messages in the channel
    if (channel.permissionsFor(channel.guild.members.me).has("SendMessages")) {
      await channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error(`[channelCreate] Error sending welcome message in channel ${channel.id}:`, error);
  }
}
