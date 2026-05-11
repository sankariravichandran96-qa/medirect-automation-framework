import { Page, Locator } from '@playwright/test';

export class SecurityDetailPage {
  readonly page: Page;

  // ── Banner (Image 1) ──────────────────────────────────────────────────────
  readonly fullFunctionalityBanner: Locator;
  readonly becomeCustomerButton:    Locator;
  readonly lockedPriceIcon:         Locator;
  readonly backToSearchLink:        Locator;

  // ── Overview section (Image 2) ────────────────────────────────────────────
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

  // ── Bottom CTA (Image 3) ──────────────────────────────────────────────────
  readonly experienceBetterHeading: Locator;
  readonly becomeClientButton:      Locator;
  readonly signUpText:              Locator;

  constructor(page: Page) {
    this.page = page;

    // ── Banner ────────────────────────────────────────────────────────────────
    this.fullFunctionalityBanner = page.getByText(
      'Do you want to start using the full functionality for FREE?'
    );

    // Scoped to the banner section — the same CTA link also appears in the
    // bottom "Experience better Investing" section, causing a strict-mode
    // violation if queried page-wide.
    this.becomeCustomerButton = page
      .locator('section')
      .filter({ hasText: 'Do you want to start using the full functionality for FREE?' })
      .getByRole('link', { name: /become a customer/i });

    this.lockedPriceIcon  = page.getByText('+ (+%)');
    this.backToSearchLink = page.getByRole('link', { name: 'Back to search results' });

    // ── Overview ──────────────────────────────────────────────────────────────
    this.overviewHeading    = page.getByText('Overview');
    this.lastCloseField     = page.locator('div').filter({ hasText: /^Last Close$/ });
    this.roeField           = page.locator('div').filter({ hasText: /^RoE$/ });
    this.mktCapField        = page.locator('div').filter({ hasText: /^Mkt Cap$/ });
    this.dividendYieldField = page.locator('div').filter({ hasText: /^Dividend Yield$/ });
    this.exchangeField      = page.locator('div').filter({ hasText: /^Exchange$/ });
    this.peField            = page.locator('div').filter({ hasText: /^PE$/ });
    this.volumeField        = page.locator('div').filter({ hasText: /^Volume$/ });
    this.netMarginField     = page.locator('div').filter({ hasText: /^Net Margin$/ });
    this.priceSalesField    = page.locator('div').filter({ hasText: /^Price\/Sales$/ });

    // ── Bottom CTA ────────────────────────────────────────────────────────────
    this.experienceBetterHeading = page.getByText('Experience better Investing');
    this.becomeClientButton      = page.getByRole('link', { name: 'Become a client' });
    this.signUpText              = page.getByText(
      'Sign up and open your account for free, within minutes.'
    );
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
