import { Events } from "discord.js";

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
  },
};
