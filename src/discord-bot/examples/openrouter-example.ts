/**
 * OpenRouter Service Example for Discord Bot
 *
 * This example demonstrates how to use the OpenRouter service in a Discord.js bot
 * to implement AI-powered commands that interact with language models.
 */

import { Client, Events, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { OpenRouterService, OpenRouterModel } from "../../lib/openrouter";
import type { Message } from "../../lib/openrouter";

// Create an instance of the OpenRouter service
// In a real app, you'd get this from environment variables
const openRouter = new OpenRouterService(process.env.OPENROUTER_API_KEY || "", OpenRouterModel.GPT35Turbo, {
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 500,
  presence_penalty: 0,
  frequency_penalty: 0,
});

// Example slash command definition
export const askCommand = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the AI")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question for the AI").setRequired(true)
    )
    .addStringOption((option) => {
      const modelOption = option.setName("model").setDescription("AI model to use").setRequired(false);

      // Add model choices grouped by provider

      // OpenAI models (popular and cost-effective options)
      modelOption.addChoices(
        { name: "GPT-3.5 Turbo (Fast & Affordable)", value: OpenRouterModel.GPT35Turbo },
        { name: "GPT-4o Mini (Good Balance)", value: OpenRouterModel.GPT4oMini },
        { name: "GPT-4o (Powerful)", value: OpenRouterModel.GPT4o },
        { name: "GPT-4.1 (Advanced)", value: OpenRouterModel.GPT41 }
      );

      // Anthropic models
      modelOption.addChoices(
        { name: "Claude 3 Haiku (Fast)", value: OpenRouterModel.Claude3Haiku },
        { name: "Claude 3.7 Sonnet (Latest)", value: OpenRouterModel.Claude37Sonnet },
        { name: "Claude 3 Opus (Powerful)", value: OpenRouterModel.Claude3Opus }
      );

      // Affordable alternatives
      modelOption.addChoices(
        { name: "Gemini (Free)", value: OpenRouterModel.Gemini },
        { name: "Mistral 7B (Affordable)", value: OpenRouterModel.Mistral7B },
        { name: "Llama 3 (Affordable)", value: OpenRouterModel.Llama3 },
        { name: "Qwen 14B (Affordable)", value: OpenRouterModel.Qwen14B }
      );

      // Newer and more powerful models
      modelOption.addChoices(
        { name: "Mistral Large (Latest)", value: OpenRouterModel.MistralLarge },
        { name: "Gemini 1.5 Pro (Advanced)", value: OpenRouterModel.Gemini15Pro },
        { name: "Qwen 235B (Advanced)", value: OpenRouterModel.Qwen235B },
        { name: "Llama 405B (Cutting Edge)", value: OpenRouterModel.Llama405B }
      );

      return modelOption;
    }),

  // Execute method for the command handler
  async execute(interaction: ChatInputCommandInteraction) {
    // Defer reply to give the API time to respond
    await interaction.deferReply();

    try {
      const question = interaction.options.getString("question", true);
      const modelOption = interaction.options.getString("model");
      const model = modelOption || OpenRouterModel.GPT35Turbo;

      // Create the messages array
      const messages: Message[] = [
        {
          role: "system",
          content: "You are a helpful assistant answering questions in a Discord server.",
        },
        {
          role: "user",
          content: question,
        },
      ];

      // Log the incoming question
      console.log(`User ${interaction.user.tag} asked: ${question}`);
      console.log(`Using model: ${model}`);

      // Get the completion from OpenRouter
      const completion = await openRouter.chatCompletion(messages, {
        model,
        params: {
          temperature: 0.7,
          max_tokens: 500,
        },
      });

      // Extract the assistant's response
      const response = completion.choices[0].message.content;

      // Send the response back to Discord
      // If the response is too long, split it into multiple messages
      if (response.length <= 2000) {
        await interaction.editReply(response);
      } else {
        // Split long messages (Discord has a 2000 character limit)
        const chunks = response.match(/.{1,2000}/g);
        if (chunks && chunks.length > 0) {
          await interaction.editReply(chunks[0]);

          // Send additional chunks as follow-up messages
          for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp(chunks[i]);
          }
        } else {
          await interaction.editReply("Sorry, I couldn't format the response properly.");
        }
      }

      // Optionally log token usage
      const { prompt_tokens, completion_tokens } = completion.usage;
      const totalTokens = prompt_tokens + completion_tokens;
      const estimatedCost = openRouter.estimateCost(prompt_tokens, completion_tokens, model);
      console.log(`Token usage - Prompt: ${prompt_tokens}, Completion: ${completion_tokens}, Total: ${totalTokens}`);
      console.log(`Estimated cost: $${estimatedCost.toFixed(6)}`);
    } catch (error) {
      // Handle errors properly
      console.error("Error in /ask command:", error);

      const errorMessage = error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred";

      // Reply with the error if we haven't replied yet
      if (interaction.deferred && !interaction.replied) {
        await interaction.editReply(`Sorry, I couldn't process your request. ${errorMessage}`);
      } else if (!interaction.replied) {
        await interaction.reply({
          content: `Sorry, I couldn't process your request. ${errorMessage}`,
          ephemeral: true,
        });
      }
    }
  },
};

/**
 * Example of registering and handling the command in a Discord.js bot
 */
export function setupAskCommand(client: Client) {
  // Register the command handler
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "ask") return;

    await askCommand.execute(interaction);
  });

  console.log("AI ask command has been registered");

  // Return the command data for registration with Discord API
  return askCommand.data.toJSON();
}
