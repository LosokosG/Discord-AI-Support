/* eslint-disable no-console */
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// For ESLint
/* global process, fetch, console */

// Import the model from the types file or use the hardcoded string for GPT-4.1 Nano
// We're using GPT-4.1 Nano which is powerful enough but cost-effective for summaries
const SUMMARY_MODEL = process.env.SUMMARY_MODEL || "openai/gpt-4.1-nano";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Attempt to detect the language of the conversation from the user messages
 * @param {Array} transcript - Conversation transcript
 * @returns {string} - Detected language instruction
 */
function detectLanguage(transcript) {
  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    return ""; // Default to no specific language instruction
  }

  // Get user messages only
  const userMessages = transcript.filter((msg) => msg.role === "user");
  if (userMessages.length === 0) return "";

  // Get the first and last user message for analysis
  const firstMessage = userMessages[0].content || "";
  const lastMessage = userMessages[userMessages.length - 1].content || "";
  const sampleText = (firstMessage + " " + lastMessage).toLowerCase();

  // Very basic language detection based on common words and characters
  // This is not comprehensive but should handle common cases

  // Polish detection
  if (
    sampleText.includes("ą") ||
    sampleText.includes("ę") ||
    sampleText.includes("ś") ||
    sampleText.includes("ć") ||
    sampleText.includes("ż") ||
    sampleText.includes("ź") ||
    sampleText.includes("ó") ||
    sampleText.includes("proszę") ||
    sampleText.includes("dziękuję") ||
    sampleText.includes("jestem") ||
    sampleText.includes("pomocy")
  ) {
    console.log("[aiSummary] Detected Polish language");
    return "The conversation is in Polish. Please generate the summary in Polish.";
  }

  // Spanish detection
  if (
    sampleText.includes("ñ") ||
    sampleText.includes("¿") ||
    sampleText.includes("¡") ||
    sampleText.includes("gracias") ||
    sampleText.includes("ayuda") ||
    sampleText.includes("por favor") ||
    sampleText.includes("hola")
  ) {
    console.log("[aiSummary] Detected Spanish language");
    return "The conversation is in Spanish. Please generate the summary in Spanish.";
  }

  // German detection
  if (
    sampleText.includes("ß") ||
    sampleText.includes("danke") ||
    sampleText.includes("bitte") ||
    sampleText.includes("hilfe") ||
    sampleText.includes("guten tag")
  ) {
    console.log("[aiSummary] Detected German language");
    return "The conversation is in German. Please generate the summary in German.";
  }

  // French detection
  if (
    sampleText.includes("ç") ||
    sampleText.includes("bonjour") ||
    sampleText.includes("merci") ||
    sampleText.includes("s'il vous plaît") ||
    sampleText.includes("aide")
  ) {
    console.log("[aiSummary] Detected French language");
    return "The conversation is in French. Please generate the summary in French.";
  }

  // If no specific language detected, default to English
  console.log("[aiSummary] No specific language detected, defaulting to English");
  return "";
}

/**
 * Generate a well-formatted support ticket summary from conversation transcript
 * @param {Array} transcript - Conversation transcript with user and AI messages
 * @returns {Promise<string>} - Formatted AI summary
 */
export async function generateAiSummary(transcript) {
  if (!transcript || transcript.length === 0) {
    return "No conversation data available to summarize.";
  }

  // Detect the language of the conversation
  const languageInstruction = detectLanguage(transcript);

  try {
    const systemPrompt = `
You are a support ticket summarizer responsible for creating clear, concise summaries of user conversations with an AI assistant.
Your task is to analyze the conversation and extract:

1. The main user issue/question
2. Steps already attempted by the user
3. Solutions suggested by the AI
4. Current status (what's working and what's not)
5. Technical context that might be relevant for human support

Format the summary with markdown headings and bullet points to make it easy to scan.
Keep your summary factual, concise, and focused on helping a human support agent understand the situation quickly.
The summary must be in the third person and focus only on facts from the conversation.

${languageInstruction}

IMPORTANT: Keep your summary under 1800 characters as it will be displayed in Discord which has a 2000 character limit.
`;

    const userPrompt = `Here is the conversation transcript to summarize:
${JSON.stringify(transcript, null, 2)}

Please provide a well-organized summary that covers all the main points and will help a human support agent quickly understand the situation.
Remember to keep your response under 1800 characters total.`;

    // Skip if API key is missing
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      console.log("[aiSummary] No OpenRouter API key provided, using mock summary");
      return generateMockSummary(transcript, languageInstruction);
    }

    console.log(`[aiSummary] Using model: ${SUMMARY_MODEL} with the OpenRouter API key`);

    // Call OpenRouter API with GPT-4.1 Nano model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://discord-ai-support-bot.example.com",
        "X-Title": "Discord AI Support Bot",
      },
      body: JSON.stringify({
        model: SUMMARY_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more factual/consistent output
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    const summary = data.choices[0].message.content;
    console.log(`[aiSummary] Successfully generated AI summary (${summary.length} characters)`);

    // Ensure summary stays within a reasonable length
    if (summary.length > 1900) {
      console.log(`[aiSummary] Summary too long (${summary.length}), truncating...`);
      return summary.substring(0, 1900) + "...";
    }

    return summary;
  } catch (error) {
    console.error("[aiSummary] Error generating AI summary:", error);
    return generateMockSummary(transcript, languageInstruction);
  }
}

/**
 * Generate a mock summary when the API call fails
 * @param {Array} transcript - Conversation transcript
 * @param {string} languageInstruction - Detected language instruction
 * @returns {string} - Basic mock summary
 */
function generateMockSummary(transcript, languageInstruction = "") {
  try {
    // Extract the first user message as the main issue
    const userMessages = transcript.filter((msg) => msg.role === "user");
    const aiMessages = transcript.filter((msg) => msg.role === "assistant");

    const mainIssue = userMessages.length > 0 ? userMessages[0].content : "Unknown issue";

    // Is this a Polish conversation?
    const isPolish = languageInstruction.includes("Polish");

    if (isPolish) {
      return `# Podsumowanie zgłoszenia

## Główny problem
${mainIssue.substring(0, 200)}${mainIssue.length > 200 ? "..." : ""}

## Statystyki konwersacji
- ${userMessages.length} wiadomości od użytkownika
- ${aiMessages.length} odpowiedzi AI
- Pomoc człowieka została wywołana, ponieważ automatyczna pomoc była niewystarczająca

*Uwaga: To jest automatycznie wygenerowane podsumowanie. Agent wsparcia wkrótce przejrzy twoje zgłoszenie.*`;
    }

    // Is this a Spanish conversation?
    const isSpanish = languageInstruction.includes("Spanish");

    if (isSpanish) {
      return `# Resumen del ticket de soporte

## Problema principal
${mainIssue.substring(0, 200)}${mainIssue.length > 200 ? "..." : ""}

## Estadísticas de la conversación
- ${userMessages.length} mensajes del usuario
- ${aiMessages.length} respuestas de la IA
- Se solicitó asistencia humana después de que la asistencia de IA fue considerada insuficiente

*Nota: Este es un resumen generado automáticamente. Un agente de soporte humano revisará su problema en breve.*`;
    }

    // Is this a German conversation?
    const isGerman = languageInstruction.includes("German");

    if (isGerman) {
      return `# Ticket-Zusammenfassung

## Hauptproblem
${mainIssue.substring(0, 200)}${mainIssue.length > 200 ? "..." : ""}

## Konversationsstatistik
- ${userMessages.length} Benutzernachrichten
- ${aiMessages.length} KI-Antworten
- Menschliche Unterstützung wurde angefordert, nachdem die KI-Unterstützung als unzureichend erachtet wurde

*Hinweis: Dies ist eine automatisch generierte Zusammenfassung. Ein menschlicher Support-Mitarbeiter wird Ihr Problem in Kürze prüfen.*`;
    }

    // Is this a French conversation?
    const isFrench = languageInstruction.includes("French");

    if (isFrench) {
      return `# Résumé du ticket de support

## Problème principal
${mainIssue.substring(0, 200)}${mainIssue.length > 200 ? "..." : ""}

## Statistiques de conversation
- ${userMessages.length} messages de l'utilisateur
- ${aiMessages.length} réponses de l'IA
- L'assistance humaine a été demandée après que l'assistance de l'IA a été jugée insuffisante

*Remarque : Ceci est un résumé généré automatiquement. Un agent de support humain examinera votre problème sous peu.*`;
    }

    // Default to English
    return `# Support Ticket Summary

## Main Issue
${mainIssue.substring(0, 200)}${mainIssue.length > 200 ? "..." : ""}

## Conversation Stats
- ${userMessages.length} user messages
- ${aiMessages.length} AI responses
- Support was requested by the user after AI assistance was deemed insufficient

*Note: This is an automatically generated summary. A human support agent will review your issue shortly.*`;
  } catch (error) {
    console.error("[aiSummary] Error generating mock summary:", error);
    return "Failed to generate conversation summary. A human support agent will review your issue shortly.";
  }
}
