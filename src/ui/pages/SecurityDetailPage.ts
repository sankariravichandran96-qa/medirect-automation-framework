import { Page, Locator } from '@playwright/test';
import { UITestData } from '../../Common/uiTestData';

export class SecurityDetailPage {
  readonly page: Page;

  // ── Banner ──────────────────────────────────────────────────────
  readonly fullFunctionalityBanner: Locator;
  readonly becomeCustomerButton:    Locator;
  readonly lockedPriceIcon:         Locator;
  readonly backToSearchLink:        Locator;

  // ── Overview section ────────────────────────────────────────────
  readonly overviewHeading:         Locator;
  readonly lastCloseField:          Locator;
  readonly roeField:                Locator;
  readonly mktCapField:             Locator;
  readonly dividendYieldField:      Locator;
  readonly exchangeField:           Locator;
  readonly peField:                 Locator;
  readonly volumeField:             Locator;
  readonly netMarginField:          Locator;
  readonly priceSalesField:         Locator;

  // ── Bottom CTA ──────────────────────────────────────────────────
  readonly experienceBetterHeading: Locator;
  readonly becomeClientButton:      Locator;
  readonly signUpText:              Locator;

  constructor(page: Page) {
    this.page = page;

    // ── Banner ────────────────────────────────────────────────────
    this.fullFunctionalityBanner = page.getByText(
      UITestData.restricted.fullFunctionalityText
    );

    this.becomeCustomerButton = page
      .locator('section')
      .filter({ hasText: UITestData.restricted.fullFunctionalityText })
      .getByRole('link', { name: new RegExp(UITestData.restricted.becomeCustomerBtn, 'i') });

    this.lockedPriceIcon = page.locator('.text-6xl')
      .getByRole('img', { name: '🔒' });
    this.backToSearchLink = page.locator('a[href="/invest/equities/search/"]');

    // ── Overview ──────────────────────────────────────────────────
    this.overviewHeading = page.getByRole('heading', {
      name:  UITestData.restricted.overviewHeading,
      level: 3
    });

    this.lastCloseField     = this.lockedField('Last Close');
    this.roeField           = this.lockedField('RoE');
    this.mktCapField        = this.lockedField('Mkt Cap');
    this.dividendYieldField = this.lockedField('Dividend Yield');
    this.exchangeField      = this.lockedField('Exchange');
    this.peField            = this.lockedField('PE');
    this.volumeField        = this.lockedField('Volume');
    this.netMarginField     = this.lockedField('Net Margin');
    this.priceSalesField    = this.lockedField('Price/Sales');

    // ── Bottom CTA ────────────────────────────────────────────────
    this.experienceBetterHeading = page.getByText(UITestData.restricted.experienceBetterText);
    this.becomeClientButton      = page.getByRole('link', { name: UITestData.restricted.becomeClientBtn });
    this.signUpText              = page.getByText(UITestData.restricted.signUpText);
  }

  private lockedField(label: string): Locator {
    return this.page
      .locator('[data-widget_type="assetdetail.default"]')
      .locator('div[class*="justify-between"]')
      .filter({ has: this.page.locator('span').filter({ hasText: new RegExp(`^${label}$`) }) })
      .filter({ has: this.page.getByRole('img', { name: '🔒' }) });
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async isOnDetailPage(): Promise<boolean> {
    return this.page.url().includes('/stocksreports/');
  }

  async isFunctionalityBannerVisible(): Promise<boolean> {
    await this.fullFunctionalityBanner.scrollIntoViewIfNeeded().catch(() => {});
    return this.fullFunctionalityBanner.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isBottomCtaVisible(): Promise<boolean> {
    await this.experienceBetterHeading.scrollIntoViewIfNeeded().catch(() => {});
    return this.experienceBetterHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async scrollToOverview(): Promise<void> {
    await this.overviewHeading.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForLoadState('networkidle');
    await this.experienceBetterHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
