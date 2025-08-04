"use client";

import "@testing-library/jest-dom";
import { jest } from "@jest/globals"; // Added import for jest

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "";
  },
}));

// Mock global fetch here to ensure it's available before tests run
// Provide a default mock implementation that returns a Promise<Response>
global.fetch = jest.fn(async () =>
  Promise.resolve({
    ok: true,
    json: async () => ({}), // Default empty JSON response
    text: async () => "", // Default empty text response
    status: 200,
    statusText: "OK",
    headers: new Headers(),
    url: "mock-url",
    clone: () => Promise.resolve({} as Response), // Add clone method
    redirected: false,
    type: "basic",
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
  } as unknown as Response)
) as jest.Mock<typeof fetch>; // Use jest.Mock for type assertion, now resolving from global types
