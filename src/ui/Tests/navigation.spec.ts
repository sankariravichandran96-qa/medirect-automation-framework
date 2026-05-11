import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, label, description } from 'allure-js-commons';
import { EquitiesSearchPage } from '../pages/EquitiesSearchPage';
import { UITestData } from '../../Common/uiTestData';

test.describe('Navigation — Security Type Tabs', () => {

  test.describe.configure({ mode: 'serial' });

  let searchPage: EquitiesSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new EquitiesSearchPage(page);
    await searchPage.navigate();
    await searchPage.dismissCookieBanner();
  });

  test('TC01 - Page loads on the Equities tab by default and shows a list of equities',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Security Type Navigation');
      await story('TC01 - Default page load shows equities list');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'Verify the equities search page loads correctly with the Equities tab ' +
        'active by default and at least one EQ row visible in the results table.'
      );

      await test.step('Verify the URL points to the equities search page', async () => {
        expect(page.url()).toContain(UITestData.urlContains.equities);
      });

      await test.step('Wait for the equities result list to render', async () => {
        await searchPage.waitForResults();
      });

      await test.step('Verify at least one EQ row is visible in the results table', async () => {
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('TC02 - Clicking the Equities tab shows a list of equities',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Security Type Navigation');
      await story('TC02 - Equities tab click renders equity rows');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'Clicking the EQ Equities tab must keep the URL on the equities path ' +
        'and render at least one equity result row.'
      );

      await test.step('Click the EQ Equities tab', async () => {
        await searchPage.clickEquitiesTab();
      });

      await test.step('Verify the URL points to the equities section', async () => {
        expect(page.url()).toContain(UITestData.urlContains.equities);
      });

      await test.step('Wait for equity rows to render', async () => {
        await searchPage.waitForResults();
      });

      await test.step('Verify at least one EQ row is visible', async () => {
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('TC03 - Clicking the Funds tab navigates to the Funds section',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Security Type Navigation');
      await story('TC03 - Funds tab navigates to correct URL');
      await severity('normal');
      await label('priority', 'P2');
      await description('Clicking the FND Funds tab must redirect to a URL containing "fund".');

      await test.step('Click the FND Funds tab', async () => {
        await searchPage.clickFundsTab();
      });

      await test.step('Verify the URL has changed to the Funds section', async () => {
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(UITestData.urlContains.funds);
      });
    });

  test('TC04 - Clicking the ETFs tab navigates to the ETFs section',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Security Type Navigation');
      await story('TC04 - ETFs tab navigates to correct URL');
      await severity('normal');
      await label('priority', 'P2');
      await description('Clicking the ETF ETFs tab must redirect to a URL containing "etf".');

      await test.step('Click the ETF ETFs tab', async () => {
        await searchPage.clickEtfsTab();
      });

      await test.step('Verify the URL has changed to the ETFs section', async () => {
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(UITestData.urlContains.etfs);
      });
    });

  test('TC05 - Clicking the Bonds tab navigates to the Bonds section',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Security Type Navigation');
      await story('TC05 - Bonds tab navigates to correct URL');
      await severity('normal');
      await label('priority', 'P2');
      await description('Clicking the BND Bonds tab must redirect to a URL containing "bond".');

      await test.step('Click the BND Bonds tab', async () => {
        await searchPage.clickBondsTab();
      });

      await test.step('Verify the URL has changed to the Bonds section', async () => {
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(UITestData.urlContains.bonds);
      });
    });

});