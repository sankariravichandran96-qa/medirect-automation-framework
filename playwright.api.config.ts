import { defineConfig } from '@playwright/test';
import { Config } from './src/Common/config';

/**
 * Playwright configuration for API tests only.
 * Run: npx playwright test --config=playwright.api.config.ts
 */
export default defineConfig({
  testDir: './src/api/Tests',
  timeout:  60_000,
  retries:  1,
  workers:  1,

  reporter: [
    ['list'],
    ['html',              { outputFolder: 'playwright-report', open: 'never' }],
    ['json',              { outputFile:   'test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: true }]
  ],

  use: {
    baseURL: Config.api.baseUrl,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
    }
  }
});
