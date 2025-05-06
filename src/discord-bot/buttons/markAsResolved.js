/* eslint-disable no-console */
/* global console */
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import apiService from "../services/api.js";

export default {
  customId: "mark_as_resolved",
  async execute(interaction) {
    try {
      // Extract the conversation ID from the custom ID
      // Format: mark_as_resolved:conversationId:ticketId
      const [, conversationId, ticketId] = interaction.customId.split(":");

      if (!conversationId || !ticketId) {
        await interaction.reply({
          content: "Error: Missing conversation or ticket information.",
          ephemeral: true,
        });
        return;
      }

      // Check if user has the support role or is an administrator
      const serverId = interaction.guildId;
      const member = interaction.member;

      // Get server config to find support role
      const serverConfig = await apiService.getServerConfig(serverId);
      const supportRoleId = serverConfig?.config?.supportRole || serverConfig?.config?.support_role_id;

      // Check if user has permission
      const isAdmin = member.permissions.has("Administrator");
      const hasRole = supportRoleId && member.roles.cache.has(supportRoleId);

      if (!isAdmin && !hasRole) {
        await interaction.reply({
          content:
            "Error: You don't have permission to resolve this ticket. Only support staff or administrators can do this.",
          ephemeral: true,
        });
        return;
      }

      // Create and show modal for resolution notes
      const modal = new ModalBuilder()
        .setCustomId(`resolve_ticket_modal:${ticketId}`)
        .setTitle("Resolve Support Ticket");

      // Create text input for resolution notes
      const resolutionInput = new TextInputBuilder()
        .setCustomId("resolution_notes")
        .setLabel("What resolved the issue for the user?")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Provide details about how the issue was resolved...")
        .setRequired(true)
        .setMaxLength(1000);

      // Add input to modal
      const firstActionRow = new ActionRowBuilder().addComponents(resolutionInput);
      modal.addComponents(firstActionRow);

      // Show the modal
      await interaction.showModal(modal);
    } catch (error) {
      console.error("[markAsResolved] Error handling button click:", error);

      try {
        await interaction.reply({
          content: "An error occurred while processing your request. Please try again later.",
          ephemeral: true,
        });
      } catch (replyError) {
        console.error("[markAsResolved] Error sending error message:", replyError);
      }
    }
  },
};
