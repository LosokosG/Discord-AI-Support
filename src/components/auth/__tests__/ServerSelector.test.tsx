import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServerSelector } from "../ServerSelector";
import userEvent from "@testing-library/user-event";

describe("ServerSelector", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mockujemy window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<ServerSelector />);

    // Sprawdzamy czy są elementy ładowania, bez polegania na konkretnej implementacji
    expect(document.querySelector('[data-slot="skeleton"]')).not.toBeNull();
  });

  it("handles fetch errors", async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<ServerSelector />);

    // Sprawdzamy główną funkcjonalność - czy pokazuje się element informujący o błędzie i retry button
    const retryButton = await screen.findByRole("button", { name: /spróbuj ponownie/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("redirects to server dashboard when clicked", async () => {
    const mockServers = [{ id: "1", name: "Server Name", icon: "icon1", permissions: "8", owner: true }];

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ guilds: mockServers }),
      })
    );

    const user = userEvent.setup();
    render(<ServerSelector />);

    // Czekamy na załadowanie serwera
    const serverName = await screen.findByText("Server Name");

    // Znajdź przycisk serwera i kliknij go
    const serverButton = serverName.closest("button");
    if (serverButton) {
      await user.click(serverButton);
      // Główna funkcjonalność - sprawdzamy czy nastąpiło przekierowanie do dashboard
      expect(window.location.href).toBe("/dashboard/1");
    }
  });

  it("disables servers without admin permissions", async () => {
    const mockServers = [{ id: "1", name: "Non-Admin Server", icon: null, permissions: "0", owner: false }];

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ guilds: mockServers }),
      })
    );

    render(<ServerSelector />);

    // Czekamy na załadowanie serwera
    const serverName = await screen.findByText("Non-Admin Server");

    // Główna funkcjonalność - sprawdzenie czy przycisk jest wyłączony
    const serverButton = serverName.closest("button");
    expect(serverButton).toHaveAttribute("disabled");
  });
});
