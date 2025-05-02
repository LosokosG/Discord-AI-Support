/* eslint-disable no-console */
import { Events } from "discord.js";
import apiService from "../services/api.js";

// Dla ESLint
/* global console, setInterval */

// Konfiguracja długości przechowywania kontekstu i interwału czyszczenia
const CONTEXT_RETENTION_HOURS = 24; // Czas po którym kontekst jest uznawany za stary
const CLEANUP_INTERVAL_HOURS = 6; // Jak często uruchamiać czyszczenie

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

    // Setup periodic cleanup of old conversations
    setupConversationCleanup();
  },
};

/**
 * Set up periodic cleanup of old conversations
 */
function setupConversationCleanup() {
  // Run cleanup immediately when bot starts
  runConversationCleanup();

  // Set up interval to run cleanup periodically
  const intervalMs = CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
  setInterval(runConversationCleanup, intervalMs);

  console.log(`Conversation cleanup scheduled every ${CLEANUP_INTERVAL_HOURS} hours`);
}

/**
 * Run the conversation cleanup process
 */
async function runConversationCleanup() {
  try {
    console.log(`Running conversation cleanup (conversations older than ${CONTEXT_RETENTION_HOURS} hours)...`);

    const cleanedCount = await apiService.cleanupOldConversations(CONTEXT_RETENTION_HOURS);

    console.log(`Completed ${cleanedCount} conversations due to inactivity`);
  } catch (error) {
    console.error("Error during conversation cleanup:", error);
  }
}
