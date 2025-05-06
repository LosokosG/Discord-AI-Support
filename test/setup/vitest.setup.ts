import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Global mock setup can be added here
// For example, mocking fetch:
// vi.mock('node-fetch', () => ({
//   default: vi.fn()
// }));

// Add custom matchers if needed
