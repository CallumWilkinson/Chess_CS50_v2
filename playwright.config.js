import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  // Run E2E tests one at a time to reduce shared server/state issues.
  fullyParallel: false,
  workers: 1,

  // CI configuration.
  forbidOnly: !!process.env.CI,
  // eslint-disable-next-line no-ternary
  retries: process.env.CI ? 2 : 0,

  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
