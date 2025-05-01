import apiService from "../services/api.js";

/**
 * Event handler for when the bot joins a new guild (server)
 * This automatically registers the server in the database
 */
export default {
  name: "guildCreate",
  once: false, // This event can occur multiple times
  async execute(guild) {
    try {
      console.log(`Bot joined a new server: ${guild.name} (${guild.id})`);

      // Register the server in the database
      const serverData = await apiService.ensureServerExists(guild);

      console.log(
        `Server ${guild.name} (${guild.id}) registered successfully in the database. Active: ${serverData.active}`
      );

      // Log some basic information about the server
      console.log(`Server details:
        - Members: ${guild.memberCount}
        - Owner: ${guild.ownerId}
        - Created: ${guild.createdAt}
        - Features: ${guild.features.join(", ") || "None"}
      `);

      // Optional: Send a welcome message to the system channel or first available text channel
      const systemChannel = guild.systemChannel;
      if (systemChannel && systemChannel.permissionsFor(guild.members.me).has("SendMessages")) {
        await systemChannel.send({
          content: `Thanks for adding AI Support Bot! I'm ready to help answer questions using AI.
          
To get started, use the \`/ask\` command to ask me anything.`,
        });
      } else {
        // Try to find a channel to send the welcome message
        const textChannels = guild.channels.cache.filter(
          (c) => c.type === 0 && c.permissionsFor(guild.members.me).has("SendMessages")
        );
        const generalChannel = textChannels.find((c) => c.name === "general") || textChannels.first();

        if (generalChannel) {
          await generalChannel.send({
            content: `Thanks for adding AI Support Bot! I'm ready to help answer questions using AI.
            
To get started, use the \`/ask\` command to ask me anything.`,
          });
        }
      }
    } catch (error) {
      console.error(`Error handling guildCreate event for server ${guild.id}:`, error);
    }
  },
};
