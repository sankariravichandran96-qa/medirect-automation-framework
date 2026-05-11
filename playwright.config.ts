import { defineConfig, devices } from '@playwright/test';
import { Config } from './src/Common/config';

/**
 * Master Playwright configuration — runs API + UI together.
 * For isolated runs use:  playwright.api.config.ts  |  playwright.ui.config.ts
 */
export default defineConfig({
  timeout:  60_000,
  retries:  1,
  workers:  1,

  reporter: [
    ['list'],
    ['html',              { outputFolder: 'playwright-report', open: 'never' }],
    ['json',              { outputFile:   'test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: true }]
  ],

  projects: [
    // ── API ───────────────────────────────────────────────────────────────────
    {
      name:    'api-tests',
      testDir: './src/api/Tests',
      use: {
        baseURL: Config.api.baseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept':       'application/json'
        }
      }
    },

    // ── UI ────────────────────────────────────────────────────────────────────
    {
      name:    'ui-tests',
      testDir: './src/ui/Tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL:    Config.ui.baseUrl,
        headless:   true,
        screenshot: 'only-on-failure',
        video:      'retain-on-failure',
        trace:      'retain-on-failure'
      }
    }
  ]
});
