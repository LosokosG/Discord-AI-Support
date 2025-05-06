import { Events } from "discord.js";
import apiService from "../services/api.js";

// Dla ESLint
/* global console */

export default {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);

        const errorMessage = {
          content: "There was an error while executing this command!",
          ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }

    // Handle buttons
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);

      if (!button) {
        console.error(`No button handling for ${interaction.customId} was found.`);
        return;
      }

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(`Error handling button ${interaction.customId}`);
        console.error(error);
        await interaction.reply({
          content: "There was an error while handling this button!",
          ephemeral: true,
        });
      }
    }

    // Handle modal submissions
    else if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith("resolve_ticket_modal:")) {
        // Extract the ticket ID from the custom ID
        // Format: resolve_ticket_modal:ticketId
        const ticketId = interaction.customId.split(":")[1];

        try {
          // Get resolution notes from the modal
          const resolutionNotes = interaction.fields.getTextInputValue("resolution_notes");

          console.log(
            `[interactionCreate] Resolving ticket ${ticketId} with notes: ${resolutionNotes.substring(0, 50)}...`
          );

          // Update the forwarded ticket
          await apiService.resolveForwardedTicket(ticketId, {
            resolutionNotes,
            assignedTo: interaction.user.id, // Set the user who resolved it
          });

          // Confirm to the user
          await interaction.reply({
            content: `Ticket has been marked as resolved. Thank you for helping the user!`,
            ephemeral: true,
          });

          // Also update the original message to indicate it's resolved
          try {
            await interaction.message.edit({
              content: interaction.message.content + `\n\n**✅ RESOLVED by ${interaction.user.tag}**`,
              components: [], // Remove the button
            });
          } catch (editError) {
            console.error("Error updating the original message:", editError);
          }

          console.log(`Ticket ${ticketId} marked as resolved by ${interaction.user.tag}`);
        } catch (error) {
          console.error("Error resolving ticket:", error);
          await interaction.reply({
            content: `Error resolving the ticket: ${error.message}`,
            ephemeral: true,
          });
        }
      }
    }
  },
};
