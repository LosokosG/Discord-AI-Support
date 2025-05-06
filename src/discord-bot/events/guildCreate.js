import apiService from "../services/api.js";

/**
 * Event handler for when the bot joins a new guild (server)
 * This automatically registers the server in the database
 */
export default {
  name: "guildCreate",
  once: false, // This event can occur multiple times
  async execute(client, guild) {
    try {
      // Validate guild received - be very lenient
      if (!guild) {
        console.error("No guild object provided to guildCreate event handler");
        return;
      }

      // Handle missing ID as best we can
      if (!guild.id) {
        console.error("Guild object doesn't have an ID property");
        return;
      }

      // Convert guild ID to string regardless of type
      const guildId = String(guild.id);
      const guildName = guild.name || `Unknown Server ${guildId}`;

      console.log(`=== BOT JOINED SERVER: ${guildName} (${guildId}) ===`);

      // Check if this server already exists in our database
      const exists = await apiService.serverExists(guildId);

      if (exists) {
        // Server exists - just update active status
        try {
          await apiService.supabase.from("servers").update({ active: true }).eq("id", guildId);

          // Clear cache
          apiService.invalidateServerCache(guildId);
          console.log(`Server ${guildName} (${guildId}) marked as active`);
        } catch (error) {
          console.error(`Error updating active status: ${error.message}`);
        }
      } else {
        // New server - register it
        console.log(`Server ${guildName} (${guildId}) is new - registering in database`);
        await apiService.ensureServerExists(guild);
      }

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
      console.error(`Error in guildCreate handler: ${error.message}`);
    }
  },
};
