import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Načti proměnné z .env souboru
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { BASE_URL, CI } = process.env;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/tests',
  /* Spouštět testy paralelně */
  fullyParallel: true,

  /* Zakázat test.only na CI */
  forbidOnly: !!CI,

  /* Retry pouze na CI */
  retries: CI ? 2 : 0,

  /* Vypnout paralelismus na CI */
  workers: CI ? 1 : undefined,

  /* Reportér */
  reporter: 'html',

  /* Společná konfigurace pro všechny projekty */
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  /* Prohlížeče */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Lokální server – volitelné */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !CI,
  // },
});
