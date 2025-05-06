import type { ChannelOption, RoleOption } from "../types/discord";

/**
 * Pobiera listę kanałów dla danego serwera Discord.
 *
 * @param serverId ID serwera Discord
 * @returns Promise zawierający listę kanałów
 */
export async function fetchDiscordChannels(serverId: string): Promise<ChannelOption[]> {
  // W docelowej implementacji, to będzie rzeczywiste wywołanie API
  // które pobierze kanały z Discord API lub z naszego backendu

  // Symulacja czasu odpowiedzi API
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Symulujemy odpowiedź API z przykładowymi kanałami
  // Te dane będą różne dla każdego serwera w rzeczywistej implementacji
  return [
    { id: `${serverId}-general`, name: "general" },
    { id: `${serverId}-announcements`, name: "announcements" },
    { id: `${serverId}-help`, name: "help" },
    { id: `${serverId}-bot-commands`, name: "bot-commands" },
    { id: `${serverId}-support`, name: "support" },
    { id: `${serverId}-feedback`, name: "feedback" },
    { id: `${serverId}-dev`, name: "dev" },
    { id: `${serverId}-chat`, name: "chat" },
  ];
}

/**
 * Pobiera listę ról dla danego serwera Discord.
 *
 * @param serverId ID serwera Discord
 * @returns Promise zawierający listę ról
 */
export async function fetchDiscordRoles(serverId: string): Promise<RoleOption[]> {
  // W docelowej implementacji, to będzie rzeczywiste wywołanie API
  // które pobierze role z Discord API lub z naszego backendu

  // Symulacja czasu odpowiedzi API
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Symulujemy odpowiedź API z przykładowymi rolami
  // Te dane będą różne dla każdego serwera w rzeczywistej implementacji
  return [
    { id: `${serverId}-admin`, name: "Admin" },
    { id: `${serverId}-moderator`, name: "Moderator" },
    { id: `${serverId}-support-team`, name: "Support Team" },
    { id: `${serverId}-developer`, name: "Developer" },
    { id: `${serverId}-member`, name: "Member" },
    { id: `${serverId}-bot`, name: "Bot" },
  ];
}
