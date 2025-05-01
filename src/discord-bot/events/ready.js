import { Events } from "discord.js";

// Dla ESLint
/* global console */

export default {
  name: Events.ClientReady,
  once: true,

  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Bot is serving in ${client.guilds.cache.size} guilds`);

    // Set activity status
    client.user.setActivity("AI Support Bot", { type: "PLAYING" });
  },
};
