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
  };

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return the server if it exists
  return mockServers[id] || null;
}
