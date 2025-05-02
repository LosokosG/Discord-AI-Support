/* eslint-disable no-undef */
/* eslint-disable no-console */
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import apiService from "../services/api.js";
import { generateAiSummary } from "../utils/aiSummaryGenerator.js";

/**
 * Simple language detection from conversation
 * @param {Array} transcript - The conversation transcript
 * @returns {string} - Detected language code
 */
function detectLanguage(transcript) {
  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    return "en"; // Default to English
  }

  // Get user messages only
  const userMessages = transcript.filter((msg) => msg.role === "user");
  if (userMessages.length === 0) return "en";

  // Get the first and last user message for analysis
  const firstMessage = userMessages[0].content || "";
  const lastMessage = userMessages[userMessages.length - 1].content || "";
  const sampleText = (firstMessage + " " + lastMessage).toLowerCase();

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
    console.log("[getHumanAssistance] Detected Polish language");
    return "pl";
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
    console.log("[getHumanAssistance] Detected Spanish language");
    return "es";
  }

  // German detection
  if (
    sampleText.includes("ß") ||
    sampleText.includes("danke") ||
    sampleText.includes("bitte") ||
    sampleText.includes("hilfe") ||
    sampleText.includes("guten tag")
  ) {
    console.log("[getHumanAssistance] Detected German language");
    return "de";
  }

  // French detection
  if (
    sampleText.includes("ç") ||
    sampleText.includes("bonjour") ||
    sampleText.includes("merci") ||
    sampleText.includes("s'il vous plaît") ||
    sampleText.includes("aide")
  ) {
    console.log("[getHumanAssistance] Detected French language");
    return "fr";
  }

  // If no specific language detected, default to English
  return "en";
}

/**
 * Generate a summary of the conversation for support staff
 * @param {Array} transcript - The conversation transcript
 * @returns {string} - Formatted summary
 */
async function generateSummary(transcript) {
  if (!transcript || transcript.length === 0) {
    return "No conversation history available.";
  }

  try {
    // Detect language
    const language = detectLanguage(transcript);
    console.log(`[getHumanAssistance] Generating local summary in language: ${language}`);

    // Extract user questions and AI responses
    const userQuestions = transcript.filter((msg) => msg.role === "user").map((msg) => msg.content);
    const aiResponses = transcript.filter((msg) => msg.role === "assistant").map((msg) => msg.content);

    // Get main issue with limit
    const mainIssue = userQuestions[0] || "No initial question found.";
    const shortMainIssue = mainIssue.length > 250 ? mainIssue.substring(0, 250) + "..." : mainIssue;

    // Get follow-up questions
    const followUpQuestions = userQuestions.slice(1, 4);

    // Get AI suggestions
    const suggestions = aiResponses.slice(0, 3);

    // Generate summary based on language
    let summary = "";

    // Generate in Polish
    if (language === "pl") {
      summary = `# Podsumowanie konwersacji\n\n`;
      summary += `## Problem użytkownika\n${shortMainIssue}\n\n`;

      summary += `## Kluczowe punkty rozmowy\n`;

      if (followUpQuestions.length > 0) {
        summary += `### Dodatkowe pytania:\n`;
        followUpQuestions.forEach((question, index) => {
          const shortQuestion = question.length > 150 ? question.substring(0, 150) + "..." : question;
          summary += `${index + 1}. ${shortQuestion}\n`;
        });
        summary += `\n`;
      }

      summary += `### Sugestie AI:\n`;
      if (suggestions.length > 0) {
        suggestions.forEach((response, index) => {
          const brief = response.length > 150 ? response.substring(0, 150) + "..." : response;
          summary += `${index + 1}. ${brief}\n`;
        });
      } else {
        summary += `Brak sugestii AI.\n`;
      }

      summary += `\n`;
      summary += `## Wskazówki dla wsparcia\n`;
      summary += `- Zapoznaj się z powyższą konwersacją, aby zrozumieć problem użytkownika\n`;
      summary += `- Unikaj powtarzania rozwiązań już zasugerowanych przez AI\n`;
      summary += `- Rozważ alternatywne podejścia, których AI mogło nie uwzględnić\n`;
    }
    // Generate in Spanish
    else if (language === "es") {
      summary = `# Resumen de la conversación\n\n`;
      summary += `## Problema del usuario\n${shortMainIssue}\n\n`;

      summary += `## Puntos clave discutidos\n`;

      if (followUpQuestions.length > 0) {
        summary += `### Preguntas adicionales:\n`;
        followUpQuestions.forEach((question, index) => {
          const shortQuestion = question.length > 150 ? question.substring(0, 150) + "..." : question;
          summary += `${index + 1}. ${shortQuestion}\n`;
        });
        summary += `\n`;
      }

      summary += `### Sugerencias de la IA:\n`;
      if (suggestions.length > 0) {
        suggestions.forEach((response, index) => {
          const brief = response.length > 150 ? response.substring(0, 150) + "..." : response;
          summary += `${index + 1}. ${brief}\n`;
        });
      } else {
        summary += `No se encontraron sugerencias de IA.\n`;
      }

      summary += `\n`;
      summary += `## Guía de soporte\n`;
      summary += `- Revise la conversación anterior para entender el problema del usuario\n`;
      summary += `- Evite repetir soluciones ya sugeridas por la IA\n`;
      summary += `- Considere enfoques alternativos que la IA podría no haber cubierto\n`;
    }
    // Generate in German
    else if (language === "de") {
      summary = `# Gesprächszusammenfassung\n\n`;
      summary += `## Benutzeranliegen\n${shortMainIssue}\n\n`;

      summary += `## Besprochene Hauptpunkte\n`;

      if (followUpQuestions.length > 0) {
        summary += `### Folgefragen:\n`;
        followUpQuestions.forEach((question, index) => {
          const shortQuestion = question.length > 150 ? question.substring(0, 150) + "..." : question;
          summary += `${index + 1}. ${shortQuestion}\n`;
        });
        summary += `\n`;
      }

      summary += `### KI-Vorschläge:\n`;
      if (suggestions.length > 0) {
        suggestions.forEach((response, index) => {
          const brief = response.length > 150 ? response.substring(0, 150) + "..." : response;
          summary += `${index + 1}. ${brief}\n`;
        });
      } else {
        summary += `Keine KI-Vorschläge gefunden.\n`;
      }

      summary += `\n`;
      summary += `## Support-Leitfaden\n`;
      summary += `- Überprüfen Sie das obige Gespräch, um das Problem des Benutzers zu verstehen\n`;
      summary += `- Vermeiden Sie die Wiederholung von Lösungen, die bereits von der KI vorgeschlagen wurden\n`;
      summary += `- Erwägen Sie alternative Ansätze, die die KI möglicherweise nicht berücksichtigt hat\n`;
    }
    // Generate in French
    else if (language === "fr") {
      summary = `# Résumé de la conversation\n\n`;
      summary += `## Problème de l'utilisateur\n${shortMainIssue}\n\n`;

      summary += `## Points clés discutés\n`;

      if (followUpQuestions.length > 0) {
        summary += `### Questions de suivi:\n`;
        followUpQuestions.forEach((question, index) => {
          const shortQuestion = question.length > 150 ? question.substring(0, 150) + "..." : question;
          summary += `${index + 1}. ${shortQuestion}\n`;
        });
        summary += `\n`;
      }

      summary += `### Suggestions de l'IA:\n`;
      if (suggestions.length > 0) {
        suggestions.forEach((response, index) => {
          const brief = response.length > 150 ? response.substring(0, 150) + "..." : response;
          summary += `${index + 1}. ${brief}\n`;
        });
      } else {
        summary += `Aucune suggestion d'IA trouvée.\n`;
      }

      summary += `\n`;
      summary += `## Guide de support\n`;
      summary += `- Examinez la conversation ci-dessus pour comprendre le problème de l'utilisateur\n`;
      summary += `- Évitez de répéter les solutions déjà suggérées par l'IA\n`;
      summary += `- Envisagez des approches alternatives que l'IA n'a peut-être pas couvertes\n`;
    }
    // Default to English
    else {
      summary = `# Conversation Summary\n\n`;
      summary += `## User's Issue\n${shortMainIssue}\n\n`;

      summary += `## Key Points Discussed\n`;

      if (followUpQuestions.length > 0) {
        summary += `### Follow-up Questions:\n`;
        followUpQuestions.forEach((question, index) => {
          const shortQuestion = question.length > 150 ? question.substring(0, 150) + "..." : question;
          summary += `${index + 1}. ${shortQuestion}\n`;
        });
        summary += `\n`;
      }

      summary += `### AI Suggestions:\n`;
      if (suggestions.length > 0) {
        suggestions.forEach((response, index) => {
          const brief = response.length > 150 ? response.substring(0, 150) + "..." : response;
          summary += `${index + 1}. ${brief}\n`;
        });
      } else {
        summary += `No AI suggestions found.\n`;
      }

      summary += `\n`;
      summary += `## Support Guidance\n`;
      summary += `- Review the conversation above to understand the user's problem\n`;
      summary += `- Avoid repeating solutions already suggested by the AI\n`;
      summary += `- Consider alternative approaches that the AI might not have covered\n`;
    }

    // Ensure the total length doesn't exceed 1900 characters (leave room for formatting)
    if (summary.length > 1900) {
      console.log(`[getHumanAssistance] Local summary too long (${summary.length}), truncating...`);

      // Add truncation message in the right language
      let truncationMessage = "";
      if (language === "pl") {
        truncationMessage = "*(Podsumowanie zostało skrócone ze względu na długość)*";
      } else if (language === "es") {
        truncationMessage = "*(Resumen truncado debido a la longitud)*";
      } else if (language === "de") {
        truncationMessage = "*(Zusammenfassung aufgrund der Länge gekürzt)*";
      } else if (language === "fr") {
        truncationMessage = "*(Résumé tronqué en raison de la longueur)*";
      } else {
        truncationMessage = "*(Summary truncated due to length)*";
      }

      summary = summary.substring(0, 1900) + "...\n\n" + truncationMessage;
    }

    return summary;
  } catch (error) {
    console.error("[getHumanAssistance] Error generating local summary:", error);
    return "Failed to generate conversation summary. Please review the conversation history manually.";
  }
}

export default {
  customId: "get_human_assistance",
  async execute(interaction) {
    const serverId = interaction.guildId;
    const channelId = interaction.channelId;
    const userId = interaction.user.id;
    const username = interaction.user.tag;

    // Acknowledge the interaction immediately to prevent timeout
    await interaction.deferReply({ ephemeral: true });

    try {
      console.log(`[getHumanAssistance] Processing human assistance request for user ${userId} in server ${serverId}`);

      // 1. Get server configuration to find support role
      const serverConfig = await apiService.getServerConfig(serverId);
      if (!serverConfig || !serverConfig.config) {
        await interaction.editReply("Error: Server configuration not found.");
        return;
      }

      // Check if support role is configured
      const supportRoleId = serverConfig.config.supportRole || serverConfig.config.support_role_id;
      console.log(
        `[getHumanAssistance] Support role configuration: supportRole=${serverConfig.config.supportRole}, support_role_id=${serverConfig.config.support_role_id}, using: ${supportRoleId}`
      );
      if (!supportRoleId) {
        await interaction.editReply(
          "Error: Support role not configured for this server. Please ask an admin to set it up in the dashboard."
        );
        return;
      }

      console.log(
        `[getHumanAssistance] Looking for active or recent conversation for user ${userId} in channel ${channelId}`
      );

      // First try to get just the active conversation
      let activeConversation = await apiService.getActiveConversation(
        serverId,
        channelId,
        userId,
        interaction.channel.isThread() ? interaction.channel.id : null
      );

      if (activeConversation) {
        console.log(`[getHumanAssistance] Found active conversation ${activeConversation.id}`);
      } else {
        console.log(`[getHumanAssistance] No active conversation found. Checking for recent conversations...`);

        // Try to get any recent conversations
        const recentConversations = await apiService.findAllUserConversations(
          serverId,
          channelId,
          userId,
          interaction.channel.isThread() ? interaction.channel.id : null
        );

        if (recentConversations && recentConversations.length > 0) {
          console.log(`[getHumanAssistance] Found ${recentConversations.length} recent conversations:`);
          recentConversations.forEach((conv) =>
            console.log(`- ID: ${conv.id}, Status: ${conv.status}, Updated: ${conv.updated_at}`)
          );

          // Get the most recent one
          const mostRecent = recentConversations[0];

          // Try to reactivate it
          console.log(`[getHumanAssistance] Attempting to reactivate conversation ${mostRecent.id}`);
          try {
            const updatedConversation = await apiService.reactivateConversation(mostRecent.id);

            if (!updatedConversation) {
              console.error(`[getHumanAssistance] Failed to reactivate conversation`);
              await interaction.editReply(
                "Error: Could not reactivate your conversation. Please start a new conversation."
              );
              return;
            }

            console.log(`[getHumanAssistance] Successfully reactivated conversation ${mostRecent.id}`);
            activeConversation = updatedConversation;
          } catch (reactivateError) {
            console.error(`[getHumanAssistance] Exception during reactivation:`, reactivateError);
            await interaction.editReply(
              "Error: An error occurred while trying to process your request. Please try again later."
            );
            return;
          }
        } else {
          console.log(`[getHumanAssistance] No recent conversations found for user ${userId} in channel ${channelId}`);
          await interaction.editReply(
            "Error: No active conversation found. Please start a new conversation first with the AI by using /ask or mentioning the bot."
          );
          return;
        }
      }

      if (!activeConversation) {
        await interaction.editReply("Error: No active conversation found. Please start a new conversation first.");
        return;
      }

      console.log(
        `[getHumanAssistance] Using conversation ${activeConversation.id} with status "${activeConversation.status}"`
      );

      // 3. Generate conversation summary for Discord message
      let conversationSummary = "";
      let aiSummary = "";

      try {
        // Generate AI summary using the external service
        aiSummary = await generateAiSummary(activeConversation.transcript);
        conversationSummary = aiSummary; // Use the AI-generated summary for Discord message

        // Ensure it doesn't exceed Discord's character limit (2000 chars)
        if (conversationSummary.length > 1900) {
          // Leave some room for additional text
          console.log(`[getHumanAssistance] AI summary too long (${conversationSummary.length} chars), truncating...`);
          conversationSummary = conversationSummary.substring(0, 1900) + "...\n\n*(Summary truncated due to length)*";
        }

        console.log(
          `[getHumanAssistance] Using AI-generated summary (${aiSummary.length} characters) for Discord message`
        );
      } catch (summaryError) {
        console.error("[getHumanAssistance] Error generating AI summary:", summaryError);

        // Fallback to local summary if AI generation fails
        console.log("[getHumanAssistance] Falling back to locally generated summary");
        conversationSummary = await generateSummary(activeConversation.transcript);
      }

      // 4. Ping the support role in the channel
      const mentionMessage = await interaction.channel.send({
        content: `<@&${supportRoleId}> - ${username} has requested human assistance!`,
        allowedMentions: { roles: [supportRoleId] },
      });

      // 5. Post summary in the channel with "Mark as resolved" button
      const markAsResolvedButton = new ButtonBuilder()
        .setCustomId(`mark_as_resolved:${activeConversation.id}:ticket_placeholder`) // Will update this after creating the ticket
        .setLabel("Mark as Resolved")
        .setStyle(ButtonStyle.Success);

      const actionRow = new ActionRowBuilder().addComponents(markAsResolvedButton);

      const summaryMessage = await interaction.channel.send({
        content: `**Support Ticket Summary**\n\n${conversationSummary}`,
        components: [actionRow],
      });

      // 6. Get support role members
      const supportRole = await interaction.guild.roles.fetch(supportRoleId);
      if (!supportRole) {
        console.error(`Support role ${supportRoleId} not found`);
        // Continue with the process even if we can't find the role
      } else {
        // Send DMs to support team members
        const supportMembers = supportRole.members;

        // Create link to the conversation
        const channelLink = `https://discord.com/channels/${serverId}/${channelId}/${mentionMessage.id}`;

        // Send DMs to each support team member
        supportMembers.forEach(async (member) => {
          try {
            await member.send({
              content: `**Support Needed!**\n\nUser: ${username}\nServer: ${interaction.guild.name}\n\nClick here to view the conversation: ${channelLink}\n\n**Conversation Summary:**\n${conversationSummary.substring(0, 1500)}${conversationSummary.length > 1500 ? "..." : ""}`,
            });
          } catch (dmError) {
            console.error(`Failed to send DM to support member ${member.user.tag}:`, dmError);
          }
        });
      }

      // 7. Save the forwarded ticket in the database
      let forwardedTicket = null;
      try {
        forwardedTicket = await apiService.forwardConversation(serverId, activeConversation.id, {
          user_id: userId,
          notes: "Requested by user via 'Get Human Assistance' button",
          aiSummary: aiSummary, // Save the AI-generated summary
        });
        console.log(
          `[getHumanAssistance] Successfully created forwarded ticket ${forwardedTicket.id} for conversation ${activeConversation.id}`
        );

        // Update the button customId with the actual ticket ID
        if (forwardedTicket && forwardedTicket.id) {
          const updatedMarkAsResolvedButton = new ButtonBuilder()
            .setCustomId(`mark_as_resolved:${activeConversation.id}:${forwardedTicket.id}`)
            .setLabel("Mark as Resolved")
            .setStyle(ButtonStyle.Success);

          const updatedActionRow = new ActionRowBuilder().addComponents(updatedMarkAsResolvedButton);

          // Update the message with the correct ticket ID in the button
          await summaryMessage.edit({
            content: summaryMessage.content,
            components: [updatedActionRow],
          });
        }
      } catch (forwardError) {
        console.error(`[getHumanAssistance] Error creating forwarded ticket:`, forwardError);
        // Continue with the process even if forwarding fails
      }

      // 8. Clear conversation context by marking the conversation as completed
      try {
        const completedConversation = await apiService.completeConversation(activeConversation.id, serverId);
        console.log(
          `[getHumanAssistance] Successfully completed conversation ${activeConversation.id}, new status: ${completedConversation.status}`
        );
      } catch (completeError) {
        console.error(`[getHumanAssistance] Error completing conversation:`, completeError);
        // Continue with the process even if completing the conversation fails
      }

      // 9. Confirm to the user
      await interaction.editReply({
        content:
          "Your request for human assistance has been sent to the support team. They will assist you as soon as possible.",
        ephemeral: true,
      });
    } catch (error) {
      console.error("[getHumanAssistance] Error processing request:", error);

      // Send error message to user
      try {
        await interaction.editReply({
          content:
            "An error occurred while processing your request for human assistance. Please try again or contact a server administrator.",
          ephemeral: true,
        });
      } catch (followUpError) {
        console.error("[getHumanAssistance] Error sending error message:", followUpError);
      }
    }
  },
};
