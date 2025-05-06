import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { UserMenu } from "../UserMenu";
import userEvent from "@testing-library/user-event";
import React from "react";

describe("UserMenu", () => {
  beforeEach(() => {
    // Resetujemy mocki przed każdym testem
    vi.resetAllMocks();

    // Mockujemy globalny fetch
    global.fetch = vi.fn();
  });

  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ id: "123", username: "TestUser" }),
              }),
            100
          )
        )
    );

    render(<UserMenu />);
    // Sprawdzamy czy komponent jest w stanie ładowania (ma wyłączony przycisk)
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
  });

  it("shows login button when user is not authenticated", async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<UserMenu />);

    // Sprawdzamy, czy przycisk logowania jest widoczny
    const loginButton = await screen.findByRole("link");
    expect(loginButton).toHaveAttribute("href", "/auth/login");
  });

  it("shows user menu when user is authenticated", async () => {
    const mockUser = {
      id: "123",
      username: "TestUser",
      email: "test@example.com",
      avatar_url: "https://example.com/avatar.png",
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );

    render(<UserMenu />);

    // Sprawdzamy obecność menu użytkownika po zalogowaniu
    await waitFor(() => {
      const menuButton = screen.getByRole("button");
      expect(menuButton).not.toBeDisabled();
      expect(menuButton).toBeInTheDocument();
    });
  });

  it("calls logout API when logout button is clicked", async () => {
    const mockUser = { id: "123", username: "TestUser" };

    // Mock dla pierwszego fetch - pobierania użytkownika
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        })
      )
      // Mock dla drugiego fetch - wylogowania
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
        })
      );

    const user = userEvent.setup();
    render(<UserMenu />);

    // Czekamy aż menu załaduje się
    await waitFor(() => {
      const menuButton = screen.getByRole("button");
      expect(menuButton).not.toBeDisabled();
    });

    // Kliknij przycisk menu
    await user.click(screen.getByRole("button"));

    // Znajdź i kliknij opcję wyloguj
    const logoutButton = await screen.findByText(/wyloguj/i);
    await user.click(logoutButton);

    // Sprawdź czy fetch został wywołany z odpowiednimi argumentami
    expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
    });
  });
});
