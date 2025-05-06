import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import apiService from "../../services/api.js";

// Dla ESLint
/* global console */

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the AI Support Bot for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto_respond")
        .setDescription("Configure channels where the bot will automatically respond to messages")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Add or remove a channel/category from auto-response")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable auto-responses in this channel/category")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List channels where the bot automatically responds to messages")
    ),

  async execute(interaction) {
    try {
      const serverId = interaction.guildId;
      const subcommand = interaction.options.getSubcommand();

      // Check if server exists in database
      await apiService.ensureServerExists(interaction.guild);

      // Get current server config
      const serverConfig = await apiService.getServerConfig(serverId);

      if (!serverConfig) {
        await interaction.reply({
          content: "⚠️ Could not retrieve server configuration.",
          ephemeral: true,
        });
        return;
      }

      // Initialize channels array if it doesn't exist
      if (!serverConfig.config.channels) {
        serverConfig.config.channels = [];
      }

      // Handle subcommands
      if (subcommand === "auto_respond") {
        const channel = interaction.options.getChannel("channel");
        const enabled = interaction.options.getBoolean("enabled");

        // Check if it's a valid channel or category
        if (
          ![
            ChannelType.GuildText,
            ChannelType.GuildAnnouncement,
            ChannelType.GuildForum,
            ChannelType.GuildCategory,
          ].includes(channel.type)
        ) {
          await interaction.reply({
            content: "⚠️ You can only configure text channels, announcement channels, forum channels, or categories.",
            ephemeral: true,
          });
          return;
        }

        // Get current channels array from config
        const channels = serverConfig.config.channels || [];

        if (enabled) {
          // Add channel if not already in the list
          if (!channels.includes(channel.id)) {
            channels.push(channel.id);
          }

          await interaction.reply({
            content: `✅ The bot will now automatically respond to messages in ${channel.type === ChannelType.GuildCategory ? "all text channels under" : ""} <#${channel.id}>.`,
            ephemeral: true,
          });
        } else {
          // Remove channel if in the list
          const index = channels.indexOf(channel.id);
          if (index !== -1) {
            channels.splice(index, 1);
          }

          await interaction.reply({
            content: `✅ The bot will no longer automatically respond to messages in ${channel.type === ChannelType.GuildCategory ? "text channels under" : ""} <#${channel.id}>.`,
            ephemeral: true,
          });
        }

        // Update config in database
        await apiService.updateServerConfig(serverId, {
          channels: channels,
        });
      } else if (subcommand === "list") {
        const channels = serverConfig.config.channels || [];

        if (channels.length === 0) {
          await interaction.reply({
            content: "ℹ️ No channels are currently configured for automatic responses.",
            ephemeral: true,
          });
          return;
        }

        // Build a list of configured channels
        let channelsList = "**Channels with automatic responses enabled:**\n";

        // Get channel objects from cache to display names
        for (const channelId of channels) {
          const channel = interaction.guild.channels.cache.get(channelId);
          if (channel) {
            const type = channel.type === ChannelType.GuildCategory ? "Category" : "Channel";
            channelsList += `- ${type}: <#${channelId}>\n`;
          } else {
            channelsList += `- Unknown (ID: ${channelId})\n`;
          }
        }

        await interaction.reply({
          content: channelsList,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`[/config] Error:`, error);

      await interaction.reply({
        content: `⚠️ An error occurred: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
