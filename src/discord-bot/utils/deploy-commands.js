import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Dla ESLint
/* global process, console, URL */

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const foldersPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Load command files
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  if (fs.statSync(commandsPath).isDirectory()) {
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // Convert to URL format for Windows ESM compatibility
      const fileURL = new URL(`file://${filePath.replace(/\\/g, "/")}`);

      try {
        const command = await import(fileURL);

        if ("data" in command.default && "execute" in command.default) {
          commands.push(command.default.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`Error loading command ${filePath}:`, error);
      }
    }
  }
}

// Validate environment variables
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token) {
  console.error("Missing DISCORD_TOKEN environment variable");
  process.exit(1);
}

if (!clientId) {
  console.error("Missing DISCORD_CLIENT_ID environment variable");
  process.exit(1);
}

// Create and configure REST instance
const rest = new REST().setToken(token);

// Deploy commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Register commands globally
    const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
