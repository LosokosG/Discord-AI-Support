import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/**
 * Language options for the button text
 */
const buttonText = {
  en: "Get Human Assistance",
  pl: "Uzyskaj Pomoc Człowieka",
  es: "Obtener Ayuda Humana",
  de: "Menschliche Hilfe erhalten",
  fr: "Obtenir de l'Aide Humaine",
  it: "Ricevi Assistenza Umana",
  pt: "Obter Assistência Humana",
};

/**
 * Creates a "Get Human Assistance" button with proper translation
 * @param {string} language - The language code (defaults to 'en')
 * @returns {ActionRowBuilder} - Discord.js ActionRow containing the button
 */
export function createHumanAssistanceButton(language = "en") {
  // Use the requested language or fallback to English
  const text = buttonText[language] || buttonText.en;

  const button = new ButtonBuilder().setCustomId("get_human_assistance").setLabel(text).setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(button);

  return row;
}

/**
 * Adds a "Get Human Assistance" button to a message options object
 * @param {Object} messageOptions - Discord.js message options object
 * @param {string} language - The language code
 * @returns {Object} - Updated message options with the button added
 */
export function addHumanAssistanceButton(messageOptions, language = "en") {
  const row = createHumanAssistanceButton(language);

  // Create a new object to avoid modifying the original
  const updatedOptions = { ...messageOptions };

  // Add components if they don't exist
  if (!updatedOptions.components) {
    updatedOptions.components = [row];
  } else {
    updatedOptions.components = [...updatedOptions.components, row];
  }

  return updatedOptions;
}
