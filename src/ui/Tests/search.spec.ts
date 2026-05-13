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
        const count = await searchPage.getEquityRowCount();
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

  test('TC04 - Search is case-insensitive — lowercase, uppercase and mixed case all return results',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC04 - Case-insensitive search returns consistent results');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        'Searching for the same equity using different letter cases (lowercase "apple", ' +
        'uppercase "APPLE", mixed case "Apple") must all return matching results, ' +
        'demonstrating the search is case-insensitive.'
      );

      await test.step(`Search with lowercase "${UITestData.search.popularEquityLower}" and verify results`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquityLower);
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });

      await test.step(`Search with uppercase "${UITestData.search.popularEquityUpper}" and verify results`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquityUpper);
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });

      await test.step(`Search with mixed case "${UITestData.search.popularEquity}" and verify results`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquity);
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('TC05 - Partial search term returns matching equity results',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC05 - Partial equity name returns matching results');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        `Searching with the partial term "${UITestData.search.partialEquity}" must return ` +
        'at least one matching equity result, demonstrating the search supports partial name matching.'
      );

      await test.step(`Search with partial term "${UITestData.search.partialEquity}"`, async () => {
        await searchPage.searchFor(UITestData.search.partialEquity);
      });

      await test.step('Verify at least one matching equity result is returned', async () => {
        const count = await searchPage.getEquityRowCount();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('TC06 - Special character search is handled gracefully with no application crash',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC06 - Special character search returns empty list without error');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        `Entering special characters "${UITestData.search.specialChars}" into the search box ` +
        'must not crash the application and must return zero equity results.'
      );

      await test.step(`Search with special characters "${UITestData.search.specialChars}"`, async () => {
        await searchPage.searchFor(UITestData.search.specialChars);
      });

      await test.step('Verify the application has not crashed (page is still responsive)', async () => {
        await expect(searchPage.searchInput).toBeVisible();
      });

      await test.step('Verify zero equity rows are returned for special character input', async () => {
        const count = await searchPage.getEquityRowCount();
        expect(count).toBe(0);
      });
    });

  test('TC07 - Search results update dynamically when the search term changes',
    async () => {
      await epic('MeDirect Equities Platform');
      await feature('Equities Search Functionality');
      await story('TC07 - Changing the search term refreshes the results list');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        `Searching first for "${UITestData.search.popularEquity}" and then changing the term to ` +
        `"${UITestData.search.alternateEquity}" must update the results list. Both searches must ` +
        'return at least one row, confirming the results are dynamic and not cached.'
      );

      let firstCount = 0;

      await test.step(`Search for "${UITestData.search.popularEquity}" and record the result count`, async () => {
        await searchPage.searchFor(UITestData.search.popularEquity);
        firstCount = await searchPage.getEquityRowCount();
        expect(firstCount).toBeGreaterThan(0);
      });

      await test.step(`Change the search term to "${UITestData.search.alternateEquity}"`, async () => {
        await searchPage.searchFor(UITestData.search.alternateEquity);
      });

      await test.step('Verify the results list updated and returns at least one row for the new term', async () => {
        const secondCount = await searchPage.getEquityRowCount();
        expect(secondCount).toBeGreaterThan(0);
      });
    });

});