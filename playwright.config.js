import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */

//determine CI-specific configuration values
let retries;
if (process.env.CI) {
  retries = 2;
} else {
  retries = 0;
}

let workers;
if (process.env.CI) {
  workers = 1;
} else {
  workers = undefined;
}

export default defineConfig({
  /* CHANGE FILE PATH TO RE-ENABLE PLAYWRITE*/
  testDir: "./tests/_disabled",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries,
  /* Opt out of parallel tests on CI. */
  workers,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* never open the html report in browser*/
  reporter: [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      /* CHANGE FILE PATH TO RE-ENABLE PLAYWRITE*/
      testDir: "./tests/_disabled",
      fullyParallel: false, // nothing in this folder runs in parallel
      workers: 1, // this forces no paralell tests, do this to reduce flakiness but drop speed
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false, // ensures fresh server per run
    timeout: 120 * 1000, // 2 minutes
  },
});
