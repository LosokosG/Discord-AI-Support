/* eslint-disable no-console */
import { Events } from "discord.js";
import apiService from "../services/api.js";

// For ESLint
/* global console, setInterval */

// Configuration for context retention and cleanup intervals
const CONTEXT_RETENTION_HOURS = 24; // Time after which context is considered old
const CLEANUP_INTERVAL_HOURS = 6; // How often to run cleanup
const SERVER_RECONCILE_INTERVAL_HOURS = 2; // How often to reconcile server status

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Bot is serving in ${client.guilds.cache.size} guilds`);

    // Set activity status
    client.user.setActivity("AI Support Bot", { type: "PLAYING" });

    // Initialize guild cache for tracking bot removal
    if (!global.cachedGuilds) {
      global.cachedGuilds = new Map();
    } else {
      global.cachedGuilds.clear();
    }

    client.guilds.cache.forEach((guild) => {
      global.cachedGuilds.set(guild.id, {
        name: guild.name,
        id: guild.id,
      });
    });
    console.log(`Tracking ${global.cachedGuilds.size} guilds for status changes`);

    // Register all current guilds in the database
    console.log("Ensuring all current servers are registered in the database...");
    try {
      const guilds = client.guilds.cache.map((guild) => guild);

      // Count how many servers were successfully registered
      let registeredCount = 0;
      let errorCount = 0;

      for (const guild of guilds) {
        try {
          if (guild && guild.id) {
            const result = await apiService.ensureServerExists(guild);

            // Check if there was an error
            if (result && result.error) {
              errorCount++;
            } else {
              registeredCount++;
            }
          }
        } catch (error) {
          errorCount++;
        }
      }

      console.log(`Server registration summary: ${registeredCount} registered, ${errorCount} errors`);

      // Run initial server reconciliation to fix any servers that should be inactive
      await reconcileServerStatus(client);

      // Debug check for all servers and their active status
      try {
        console.log("=== CHECKING ALL SERVERS ACTIVE STATUS ===");
        const { data, error } = await apiService.supabase.from("servers").select("id, name, active");

        if (error) {
          console.error(`Error fetching servers: ${error.message}`);
        } else if (data) {
          // Log each server's active status
          data.forEach((server) => {
            console.log(`Server ${server.name} (${server.id}): active=${server.active}`);
          });

          // Fix any inactive servers that should be active
          const currentGuildIds = client.guilds.cache.map((g) => g.id);
          for (const server of data) {
            if (!server.active && currentGuildIds.includes(server.id)) {
              console.log(`Server ${server.name} (${server.id}) should be active but isn't - fixing`);
              await apiService.markServerAsActive(server.id);
            }
          }
        }
      } catch (statusError) {
        console.error(`Error checking server status: ${statusError.message}`);
      }
    } catch (error) {
      console.error("Error registering servers:", error);
    }

    // Setup periodic cleanup of old conversations
    setupConversationCleanup();

    // Setup periodic server status reconciliation
    setupServerReconciliation(client);
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

/**
 * Set up periodic reconciliation of server status
 * @param {Client} client - Discord.js client
 */
function setupServerReconciliation(client) {
  // Set up interval to run reconciliation periodically
  const intervalMs = SERVER_RECONCILE_INTERVAL_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
  setInterval(() => reconcileServerStatus(client), intervalMs);

  console.log(`Server status reconciliation scheduled every ${SERVER_RECONCILE_INTERVAL_HOURS} hours`);
}

/**
 * Reconcile server active status with current bot guilds
 * @param {Client} client - Discord.js client
 */
async function reconcileServerStatus(client) {
  try {
    console.log("Running server status reconciliation...");

    // Get all current guild IDs where the bot is present
    const currentGuildIds = client.guilds.cache.map((guild) => guild.id);

    // Run reconciliation to mark servers as inactive if bot is no longer present
    const result = await apiService.reconcileActiveServers(currentGuildIds);

    console.log(
      `Server reconciliation completed: ${result.deactivated} servers marked inactive, ${result.errors} errors`
    );
  } catch (error) {
    console.error("Error during server status reconciliation:", error);
  }
}
