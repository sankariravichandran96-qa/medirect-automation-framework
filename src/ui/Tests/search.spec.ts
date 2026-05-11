import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, label, description } from 'allure-js-commons';
import { EquitiesSearchPage } from '../pages/EquitiesSearchPage';
import { SecurityDetailPage } from '../pages/SecurityDetailPage';
import { UITestData } from '../../Common/uiTestData';

test.describe('Search — Equities Search Functionality', () => {

  test.describe.configure({ mode: 'serial' });

  let searchPage: EquitiesSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new EquitiesSearchPage(page);
    await searchPage.navigate();
    await searchPage.dismissCookieBanner();
  });

  test('TC01 - Search for a popular equity returns results',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC01 - Search by name returns matching equity rows');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        `Typing "${UITestData.search.popularEquity}" into the search box must return ` +
        'at least one matching EQ result row.'
      );

      await test.step(`Type "${UITestData.search.popularEquity}" into the search box`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquity);
      });

      await test.step('Verify at least one result row is returned', async () => {
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('TC02 - Search and click More Information navigates to the detail page',
    async ({ page }) => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC02 - More Information link navigates to security detail page');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        `After searching for "${UITestData.search.popularEquity}", clicking More Information ` +
        'on the Apple INC row must navigate to the security detail page under /stocksreports/.'
      );

      const detailPage = new SecurityDetailPage(page);

      await test.step(`Search for "${UITestData.search.popularEquity}"`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquity);
      });

      await test.step(`Click More Information on the "${UITestData.search.popularEquityRow}" row`, async () => {
        await searchPage.clickMoreInformationForRow(UITestData.search.popularEquityRow);
      });

      await test.step('Wait for the security detail page to fully load', async () => {
        await detailPage.waitForLoad();
      });

      await test.step('Verify navigation landed on the security detail page', async () => {
        expect(await detailPage.isOnDetailPage()).toBe(true);
      });

      await test.step('Verify the URL contains the stock report path', async () => {
        expect(page.url()).toContain('/stocksreports/');
      });
    });

  test('TC03 - Search for a non-existent equity returns an empty results list',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC03 - Non-existent equity search returns empty list');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        `Searching for "${UITestData.search.nonExistentEquity}" must produce ` +
        'zero result rows and show the empty-results indicator.'
      );

      await test.step(`Search for the non-existent term "${UITestData.search.nonExistentEquity}"`, async () => {
        await searchPage.searchFor(UITestData.search.nonExistentEquity);
      });

      await test.step('Verify no equity rows are shown in the results', async () => {
        const isEmpty = await searchPage.isResultsEmpty();
        expect(isEmpty).toBe(true);
      });
    });

});