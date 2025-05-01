import { Events } from "discord.js";
import apiService from "../services/api.js";

// Dla ESLint
/* global console */

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Bot is serving in ${client.guilds.cache.size} guilds`);

    // Set activity status
    client.user.setActivity("AI Support Bot", { type: "PLAYING" });

    // Register all current guilds in the database
    console.log("Ensuring all current servers are registered in the database...");
    try {
      const guilds = client.guilds.cache.map((guild) => guild);

      for (const guild of guilds) {
        try {
          await apiService.ensureServerExists(guild);
          console.log(`Ensured server ${guild.name} (${guild.id}) exists in database`);
        } catch (error) {
          console.error(`Error ensuring server ${guild.id} exists:`, error);
        }
      }

      console.log("All servers registration check complete");
    } catch (error) {
      console.error("Error registering servers:", error);
    }
  },
};
