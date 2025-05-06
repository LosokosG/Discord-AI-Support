import apiService from "../services/api.js";

/**
 * Event handler for when the bot is removed from a guild (server)
 * This marks the server as inactive in the database
 *
 * NOTE: The actual processing happens in bot.js using the guild cache
 * since the guild parameter can be undefined when the bot is kicked.
 */
export default {
  name: "guildDelete",
  once: false, // This event can occur multiple times
  async execute() {
    // Processing happens in bot.js with the guildDelete event listener
    // using the global.cachedGuilds to identify which server was removed
  },
};
