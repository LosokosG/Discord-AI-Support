import type { ServerDetail } from "@/types";

// Custom types for mock server data
export interface ServerConfig {
  language: string;
  knowledge: {
    entries: number;
  };
  stats: {
    conversations: number;
  };
  memberCount: number;
}

export interface MockServerDetail {
  id: string;
  name: string;
  active: boolean;
  iconUrl: string | null;
  config: ServerConfig;
  createdAt: string;
  updatedAt: string;
  planId: string;
}

/**
 * Returns mock server data for development purposes
 * @param id Server ID
 * @returns ServerDetail object or null if not found
 */
export async function getServerById(id: string): Promise<MockServerDetail | null> {
  // Mock servers for development
  const mockServers: Record<string, MockServerDetail> = {
    "123456789": {
      id: "123456789",
      name: "AI Support Test",
      active: true,
      iconUrl: null,
      config: {
        language: "pl",
        knowledge: { entries: 12 },
        stats: { conversations: 25 },
        memberCount: 152,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planId: "free",
    },
    "987654321": {
      id: "987654321",
      name: "Development",
      active: false,
      iconUrl: null,
      config: {
        language: "en",
        knowledge: { entries: 5 },
        stats: { conversations: 10 },
        memberCount: 48,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planId: "free",
    },
    "555555555": {
      id: "555555555",
      name: "Community Server",
      active: true,
      iconUrl: null,
      config: {
        language: "en",
        knowledge: { entries: 32 },
        stats: { conversations: 87 },
        memberCount: 341,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planId: "pro",
    },
    "1046510699809079448": {
      id: "1046510699809079448",
      name: "Bot testing server",
      active: true,
      iconUrl: "https://cdn.discordapp.com/icons/1046510699809079448/256a79ee01431deb2446463cb476ffce.webp",
      config: {
        language: "en",
        knowledge: { entries: 0 },
        stats: { conversations: 0 },
        memberCount: 448,
      },
      createdAt: "2025-05-02T12:14:35.859284+00:00",
      updatedAt: "2025-05-02T12:14:35.859284+00:00",
      planId: "free",
    },
  };

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return the server if it exists
  return mockServers[id] || null;
}
