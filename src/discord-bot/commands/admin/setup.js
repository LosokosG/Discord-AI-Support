import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Initial setup of the AI Support Bot on your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel where the bot will monitor messages")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((option) =>
      option.setName("support_role").setDescription("Role that will be pinged when support is needed").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("Default language for responses")
        .setRequired(true)
        .addChoices(
          { name: "English", value: "en" },
          { name: "Polish", value: "pl" },
          { name: "German", value: "de" },
          { name: "Spanish", value: "es" },
          { name: "French", value: "fr" }
        )
    ),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("channel");
    const supportRole = interaction.options.getRole("support_role");
    const language = interaction.options.getString("language");

    // In a real implementation, this would save the configuration to the database
    // For now, we'll just simulate a successful setup

    await interaction.editReply({
      content:
        `Setup completed successfully!\n\n` +
        `Monitoring channel: ${channel}\n` +
        `Support role: ${supportRole}\n` +
        `Language: ${language}\n\n` +
        `Note: This is a basic implementation. In a real environment, this data would be saved to the database.`,
      ephemeral: true,
    });
  },
};
