import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Dla ESLint
/* global process, console, URL */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Discord client with necessary intents
// Uwaga: Niektóre intencje wymagają włączenia na https://discord.com/developers/applications
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Podstawowe informacje o serwerach
    GatewayIntentBits.GuildMessages, // Wiadomości na serwerach
    GatewayIntentBits.MessageContent, // Zawartość wiadomości (wymagane do czytania treści wiadomości)
  ],
});

// Collections for commands
client.commands = new Collection();
client.buttons = new Collection();

// Load events
const eventsPath = path.join(__dirname, "events");
try {
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    // Convert to URL format for Windows ESM compatibility
    const fileURL = new URL(`file://${filePath.replace(/\\/g, "/")}`);

    const event = await import(fileURL);

    if (event.default.once) {
      client.once(event.default.name, (...args) => event.default.execute(client, ...args));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(client, ...args));
    }
  }
} catch (error) {
  console.error("Error loading events:", error);
}

// Load commands
try {
  const commandsPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        // Convert to URL format for Windows ESM compatibility
        const fileURL = new URL(`file://${filePath.replace(/\\/g, "/")}`);

        try {
          const command = await import(fileURL);
          if ("data" in command.default && "execute" in command.default) {
            client.commands.set(command.default.data.name, command.default);
          }
        } catch (commandError) {
          console.error(`Error loading command ${filePath}:`, commandError);
        }
      }
    }
  }
} catch (error) {
  console.error("Error loading commands:", error);
}

// Load buttons
try {
  const buttonsPath = path.join(__dirname, "buttons");

  // Create buttons directory if it doesn't exist
  if (!fs.existsSync(buttonsPath)) {
    fs.mkdirSync(buttonsPath);
    console.log("Created buttons directory");
  }

  const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith(".js"));

  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    // Convert to URL format for Windows ESM compatibility
    const fileURL = new URL(`file://${filePath.replace(/\\/g, "/")}`);

    try {
      const button = await import(fileURL);
      if ("customId" in button.default && "execute" in button.default) {
        client.buttons.set(button.default.customId, button.default);
        console.log(`Loaded button: ${button.default.customId}`);
      }
    } catch (buttonError) {
      console.error(`Error loading button ${filePath}:`, buttonError);
    }
  }
} catch (error) {
  console.error("Error loading buttons:", error);
}

// Login to Discord with token
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("Discord token is missing! Please set the DISCORD_TOKEN environment variable.");
  process.exit(1);
}

client.login(TOKEN);

export default client;
