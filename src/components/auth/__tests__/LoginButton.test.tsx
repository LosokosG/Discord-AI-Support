import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginButton } from "../LoginButton";

describe("LoginButton", () => {
  // Store original location and create a properly typed version for mocking
  const originalLocation = window.location;

  beforeEach(() => {
    // Create a new Location-like object that can be manipulated
    const mockLocation = {
      href: "",
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      toString: vi.fn(),
      origin: "",
      protocol: "",
      host: "",
      hostname: "",
      port: "",
      pathname: "",
      search: "",
      hash: "",
    };

    // Replace the location property
    Object.defineProperty(window, "location", {
      writable: true,
      value: mockLocation,
    });
  });

  afterEach(() => {
    // Restore by using defineProperty instead of direct assignment
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  it("renders a login button", () => {
    render(<LoginButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("redirects to Discord OAuth endpoint when clicked", async () => {
    render(<LoginButton />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Sprawdzamy czy przekierowanie było do API endpoint logowania
    expect(window.location.href).toContain("/api/auth/login");
  });

  it("adds redirect param when redirectTo prop is provided", () => {
    render(<LoginButton redirectTo="/dashboard" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // URL jest zakodowany, więc sprawdzamy zakodowany format
    expect(window.location.href).toContain("redirect_to=%2Fdashboard");
  });

  it("disables button when clicked", () => {
    render(<LoginButton />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Sprawdzamy czy przycisk jest wyłączony
    expect(button).toBeDisabled();
    // Sprawdzamy czy jest element z animacją ładowania
    expect(button.querySelector(".animate-spin")).not.toBeNull();
  });
});
