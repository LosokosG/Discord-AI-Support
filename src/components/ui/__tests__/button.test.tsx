import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button component", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
