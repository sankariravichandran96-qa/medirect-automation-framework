import { Page, Locator } from '@playwright/test';
import { UITestData } from '../../Common/uiTestData';

export class EquitiesSearchPage {
  readonly page:            Page;
  readonly searchInput:     Locator;
  readonly equityRows:      Locator;
  readonly cookieAcceptBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput     = page.getByRole('textbox', { name: 'Enter name, ISIN, or ticker' });
    this.equityRows      = page.getByRole('row').filter({ hasText: UITestData.rowPrefix.equities });
    this.cookieAcceptBtn = page.getByRole('button', { name: UITestData.cookies.acceptButton });
  }

  async navigate(): Promise<void> {
    await this.page.goto(UITestData.urls.equitiesSearch);
    await this.page.waitForLoadState('networkidle');
  }

  async dismissCookieBanner(): Promise<void> {
    try {
      if (await this.cookieAcceptBtn.isVisible({ timeout: 5000 })) {
        await this.cookieAcceptBtn.click();
        await this.page.waitForLoadState('networkidle');
      }
    } catch {
      // No banner present — continue
    }
  }

  // ── Tab navigation ────────────────────────────────────────────────────────

  async clickEquitiesTab(): Promise<void> {
    await this.page.locator('a').filter({ hasText: UITestData.tabs.equities }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickFundsTab(): Promise<void> {
    await this.page.locator('a').filter({ hasText: UITestData.tabs.funds }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEtfsTab(): Promise<void> {
    await this.page.locator('a').filter({ hasText: UITestData.tabs.etfs }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickBondsTab(): Promise<void> {
    await this.page.locator('a').filter({ hasText: UITestData.tabs.bonds }).click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Results ───────────────────────────────────────────────────────────────

  async waitForResults(): Promise<void> {
    await this.equityRows.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getEquityRowCount(): Promise<number> {
    return this.equityRows.count();
  }

  // ── Search ────────────────────────────────────────────────────────────────

  async searchFor(term: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(term);
    // Allow the search debounce to fire before checking network state
    await this.page.waitForTimeout(1500);
    await this.page.waitForLoadState('networkidle');
  }

  async clickMoreInformationForRow(rowName: string): Promise<void> {
    await this.page.getByRole('row', { name: rowName }).getByRole('button').click();
    await this.page.waitForLoadState('networkidle');
  }

  async isResultsEmpty(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return (await this.equityRows.count()) === 0;
  }
}
