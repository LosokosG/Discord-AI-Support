import { ShardingManager } from "discord.js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Dla ESLint
/* global process, console */

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("Discord token is missing! Please set the DISCORD_TOKEN environment variable.");
  process.exit(1);
}

// Przygotuj ścieżkę do pliku bota - na Windows użyj właściwego formatu ścieżki
const botPath = path.join(__dirname, "bot.js");

// Utwórz ShardingManager z poprawną ścieżką (jako string)
const manager = new ShardingManager(botPath, {
  token: TOKEN,
  totalShards: "auto",
});

// Sharding events
manager.on("shardCreate", (shard) => {
  console.log(`Launched shard ${shard.id}`);
});

// Spawn shards
manager.spawn().catch((error) => {
  console.error("Failed to spawn shards:", error);
  process.exit(1);
});
