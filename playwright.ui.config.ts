import { defineConfig, devices } from '@playwright/test';
import { Config } from './src/Common/config';

/**
 * Playwright configuration for UI tests only.
 * Run: npx playwright test --config=playwright.ui.config.ts
 */
export default defineConfig({
  testDir: './src/ui/Tests',
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
    ...devices['Desktop Chrome'],
    baseURL:    Config.ui.baseUrl,
    headless:   true,
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'retain-on-failure'
  }
});
