import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, label, description } from 'allure-js-commons';
import { EquitiesSearchPage } from '../pages/EquitiesSearchPage';
import { SecurityDetailPage } from '../pages/SecurityDetailPage';
import { UITestData } from '../../Common/uiTestData';

test.describe('Security Details are Restricted Content for Public Users', () => {

  test.describe.configure({ mode: 'serial' });

  let searchPage: EquitiesSearchPage;
  let detailPage: SecurityDetailPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new EquitiesSearchPage(page);
    detailPage = new SecurityDetailPage(page);

    await searchPage.navigate();
    await searchPage.dismissCookieBanner();
    await searchPage.searchFor(UITestData.search.popularEquity);
    await searchPage.clickMoreInformationForRow(UITestData.search.popularEquityRow);
    await detailPage.waitForLoad();
  });

  test('TC01 - Detail page shows full-functionality prompt to public users',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Security Detail Page — Restricted Access');
      await story('TC01 - Public users see the registration banner');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'A public (non-logged-in) user viewing a security detail page must see the ' +
        'purple "full functionality" banner and the "Become a customer" CTA button.'
      );

      await test.step('Verify the purple registration banner is visible', async () => {
        const visible = await detailPage.isFunctionalityBannerVisible();
        expect(visible).toBe(true);
      });

      await test.step('Verify the "Become a customer" button is shown inside the banner', async () => {
        await expect(detailPage.becomeCustomerButton).toBeVisible();
      });
    });

  test('TC02 - Overview section shows all financial fields locked for public users',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Security Detail Page — Restricted Access');
      await story('TC02 - Financial data fields are locked in the Overview section');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        'The Overview section must be present and all nine financial data fields ' +
        'must be visible but locked for unauthenticated users.'
      );

      await test.step('Scroll to the Overview section', async () => {
        await detailPage.scrollToOverview();
      });

      await test.step('Verify the Overview heading is visible', async () => {
        await expect(detailPage.overviewHeading).toBeVisible();
      });

      await test.step('Verify Last Close field is present but locked', async () => {
        await expect(detailPage.lastCloseField).toBeVisible();
      });

      await test.step('Verify RoE field is present but locked', async () => {
        await expect(detailPage.roeField).toBeVisible();
      });

      await test.step('Verify Mkt Cap field is present but locked', async () => {
        await expect(detailPage.mktCapField).toBeVisible();
      });

      await test.step('Verify Dividend Yield field is present but locked', async () => {
        await expect(detailPage.dividendYieldField).toBeVisible();
      });

      await test.step('Verify Exchange field is present but locked', async () => {
        await expect(detailPage.exchangeField).toBeVisible();
      });

      await test.step('Verify PE field is present but locked', async () => {
        await expect(detailPage.peField).toBeVisible();
      });

      await test.step('Verify Volume field is present but locked', async () => {
        await expect(detailPage.volumeField).toBeVisible();
      });

      await test.step('Verify Net Margin field is present but locked', async () => {
        await expect(detailPage.netMarginField).toBeVisible();
      });

      await test.step('Verify Price/Sales field is present but locked', async () => {
        await expect(detailPage.priceSalesField).toBeVisible();
      });
    });

  test('TC03 - Validate Become a client CTA for public users',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Security Detail Page — Restricted Access');
      await story('TC03 - Bottom CTA prompts public users to sign up');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        'Scrolling to the bottom must reveal the "Experience better Investing" heading, ' +
        'the "Become a client" button, and the sign-up invitation text.'
      );

      await test.step('Scroll to the bottom of the security detail page', async () => {
        await detailPage.scrollToBottom();
      });

      await test.step('Verify the "Experience better Investing" heading is shown', async () => {
        const visible = await detailPage.isBottomCtaVisible();
        expect(visible).toBe(true);
      });

      await test.step('Verify the "Become a client" button is shown at the bottom', async () => {
        await expect(detailPage.becomeClientButton).toBeVisible();
      });

      await test.step('Verify the sign-up invitation text is shown', async () => {
        await expect(detailPage.signUpText).toBeVisible();
      });
    });

  test('TC04 - Price and percentage data is hidden behind lock icons for public users',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Security Detail Page — Restricted Access');
      await story('TC04 - Live price data is locked and back-navigation is available');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'The price and percentage change area must show a lock icon placeholder instead ' +
        'of live values. The "Back to search results" link must also be visible.'
      );

      await test.step('Verify the price area shows a lock icon instead of the actual value', async () => {
        await expect(detailPage.lockedPriceIcon).toBeVisible();
      });

      await test.step('Verify the "Back to search results" link is available', async () => {
        await expect(detailPage.backToSearchLink).toBeVisible();
      });
    });

});
