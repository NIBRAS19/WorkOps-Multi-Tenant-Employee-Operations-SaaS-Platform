import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("health route", () => {
  it("creates an Express application", () => {
    const app = createApp();
    expect(app).toBeDefined();
  });
});
