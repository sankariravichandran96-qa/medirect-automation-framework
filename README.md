# MeDirect SDET Assessment — Task 2 & 3

End-to-end test framework covering:
- **Task 2** — API integration tests for the [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html)
- **Task 3** — UI automation tests for the [MeDirect Equities Search page](https://www.medirect.com.mt/invest/equities/search)

Built with **Playwright + TypeScript**, with **Allure** for rich test reporting.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | 6.x | Strong typing, interfaces, OOP |
| [Playwright](https://playwright.dev/) | 1.59+ | API + UI test runner |
| [Allure](https://allurereport.org/) | 3.x | Visual reporting with epics, features, severity |
| [allure-js-commons](https://www.npmjs.com/package/allure-js-commons) | 3.x | Allure metadata functions |
| [rimraf](https://github.com/isaacs/rimraf) | 6.x | Cross-platform folder cleanup |

---

## Project Structure

```
restful-booker-tests/
├── src/
│   ├── api/
│   │   ├── clients/
│   │   │   ├── AuthHelper.ts           # Token acquisition and caching
│   │   │   ├── BookingClient.ts        # HTTP wrapper — all API calls live here
│   │   │   └── BookingFactory.ts       # Random test data generation
│   │   ├── models/
│   │   │   └── Booking.ts              # TypeScript interfaces for request/response shapes
│   │   └── Tests/
│   │       ├── auth.spec.ts            # Health check + auth token tests
│   │       ├── booking.crud.spec.ts    # Full CRUD journey (Create → Read → Update → Delete)
│   │       └── booking.negative.spec.ts# Negative / error path tests
│   ├── ui/
│   │   ├── pages/
│   │   │   ├── EquitiesSearchPage.ts   # Page object for the equities search page
│   │   │   └── SecurityDetailPage.ts   # Page object for the security detail page
│   │   └── Tests/
│   │       ├── navigation.spec.ts      # Security type tab navigation tests
│   │       ├── search.spec.ts          # Equity search functionality tests
│   │       └── securityDetails.spec.ts # Restricted content visibility tests
│   └── Common/
│       ├── config.ts                   # Shared config — baseUrl, credentials (env-overridable)
│       ├── testData.ts                 # API test data constants
│       └── uiTestData.ts              # UI test data constants
├── playwright.api.config.ts            # Playwright config for API tests
├── playwright.ui.config.ts             # Playwright config for UI tests
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Java 8+** — required by Allure CLI — [Download](https://www.java.com/en/download/)

Verify:

```bash
node --version
npm --version
java --version
```

---

## Installation

### 1 — Clone the repository

```bash
git clone <your-repo-url>
cd restful-booker-tests
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Install Playwright browsers (required for UI tests)

```bash
npx playwright install chromium
```

### 4 — Verify Allure CLI

```bash
npx allure --version
```

You should see a version number (e.g. `2.40.0`). If not, ensure Java is installed and on your PATH.

---

## Running Tests

### API Tests (Task 2)

```bash
# Run all API tests
npm run test:api

# Run and open Allure report
npm run test:api:allure
```

### UI Tests (Task 3)

```bash
# Run headless (default)
npm run test:ui

# Run in browser (visible)
npm run test:ui:headed

# Run and open Allure report
npm run test:ui:allure
```

---

## Reports

### Playwright HTML Report

Generated after every run at `playwright-report/index.html`.

```bash
npm run report:html
```

### Allure Report

Richer report with epics, features, severity, and step-level details.

```bash
npm run report:allure
```

Or generate and open manually:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

The Allure report includes:
- **Overview** — pass/fail summary
- **Behaviours** — tests grouped by Epic → Feature → Story hierarchy
- **Suites** — tests grouped by file
- **Timeline** — execution timing
- **Graphs** — severity and status breakdowns

---

## Environment Configuration

Tests use sensible defaults and can be overridden via environment variables — no code changes needed.

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://restful-booker.herokuapp.com` | API base URL |
| `BOOKER_USERNAME` | `admin` | API auth username |
| `BOOKER_PASSWORD` | `password123` | API auth password |
| `UI_BASE_URL` | `https://www.medirect.com.mt` | UI base URL |

**Mac / Linux:**
```bash
BASE_URL=https://staging.example.com npm run test:api
```

**Windows (PowerShell):**
```powershell
$env:BASE_URL="https://staging.example.com"; npm run test:api
```

All values are centralised in `src/Common/config.ts` — no magic strings in tests or page objects.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run test:api` | Run all API tests |
| `npm run test:api:allure` | Run API tests + open Allure report |
| `npm run test:ui` | Run all UI tests (headless) |
| `npm run test:ui:headed` | Run UI tests in visible browser |
| `npm run test:ui:allure` | Run UI tests + open Allure report |
| `npm run report:html` | Open Playwright HTML report |
| `npm run report:allure` | Generate and open Allure report |
| `npm run clean` | Delete all generated report and result folders |

---

## Test Coverage

### API Tests — Restful Booker (Task 2)

| File | Tests | What is covered |
|---|---|---|
| `auth.spec.ts` | 2 | Health check (ping), valid credentials return a token |
| `booking.crud.spec.ts` | 7 | Create → Get → List → PUT → PATCH → Delete → Confirm deleted |
| `booking.negative.spec.ts` | 3 | Non-existent ID (404), unauthorised delete (403), malformed payload (500) |

The CRUD tests run in a single chained describe block using `beforeAll` to create one shared booking — mirroring the Postman collection runner approach from Task 1.

### UI Tests — MeDirect Equities (Task 3)

| File | Tests | What is covered |
|---|---|---|
| `navigation.spec.ts` | 4 | Default equities tab load + row count; Funds, ETFs, Bonds tab navigation |
| `search.spec.ts` | 3 | Search returns results; More Information navigates to detail page; non-existent search returns empty list |
| `securityDetails.spec.ts` | 4 | Registration banner visible; Overview fields locked; Bottom CTA + sign-up text visible; Price locked behind lock icon |

---

## Design Decisions

| Decision | Reason |
|---|---|
| `BookingClient` wraps all HTTP calls | Tests never call `request.get/post` directly — clean separation of concerns |
| `AuthHelper` caches the token per context | No repeated auth requests — efficient and mirrors real-world SDK patterns |
| `BookingFactory` generates unique names via `Date.now()` | Guaranteed unique data on every run — matches Postman's random data strategy |
| `beforeAll` creates one shared booking for CRUD tests | Tests chain on the same record — mirrors the Postman collection runner approach |
| `afterAll` cleans up test data on every describe | No orphaned records left in the API between runs |
| Page Object Model for all UI interactions | Locators and actions are defined once and reused — changes to the UI only require updates in one place |
| `test.step()` wraps every assertion | Allure shows plain-English steps readable by non-technical stakeholders |
| `test.describe.configure({ mode: 'serial' })` on UI suites | UI tests that navigate across steps must run in order |
| `workers: 1` in API config | CRUD tests share booking state — parallel execution would cause race conditions |
| Allure metadata via `allure-js-commons` | Uses the non-deprecated API — `epic()`, `feature()`, `story()`, `severity()` called as plain functions |
| Separate `playwright.api.config.ts` and `playwright.ui.config.ts` | API and UI suites can be run independently with their own base URLs and browser settings |
| All test data in `src/Common/` | Single source of truth — no magic values scattered across test files |

---

## Proposed Improvements

These items were considered but deliberately kept out of scope to avoid over-engineering the assessment solution. They represent natural next steps for a production framework:

- **Tag-based test selection** — Add `@smoke` and `@regression` tags to enable selective CI runs (e.g. `--grep @smoke` for a quick sanity check on every PR, full regression nightly). Tags were omitted here to keep the test signatures clean for readability.
- **Search debounce handling** — `EquitiesSearchPage.searchFor()` uses `waitForTimeout(1500)` to account for the site's search debounce. A more robust approach would intercept the outgoing search request via `page.waitForResponse()` and resolve when the response arrives.
- **Parameterised UI tests** — The four security type tabs (Equities, Funds, ETFs, Bonds) could be driven by a data table to reduce repetition.
- **Visual regression testing** — Screenshot comparisons for the locked fields and banner UI using Playwright's built-in `toHaveScreenshot()`.
- **Retry on flake** — Enable `retries: 2` in CI to auto-retry transient network failures against the live test environments.
- **Parallel UI test execution** — Enable cross-browser runs (Chromium, Firefox, WebKit) in CI to catch browser-specific rendering differences earlier.

---

## Troubleshooting

**`npx allure --version` gives an error**

Allure CLI requires Java 8+. Install from [java.com](https://www.java.com/en/download/) and ensure `java` is on your PATH.

**Tests fail with `Cannot find name 'process'`**

Ensure `@types/node` is installed:
```bash
npm install --save-dev @types/node
```

**UI tests fail with timeout on search results**

The MeDirect site applies a search debounce. If results don't load within the timeout, check your network connection — the page must be reachable at `https://www.medirect.com.mt`.

**Allure report shows stale results from a previous run**

Run `npm run clean` before re-running tests. All `*:allure` scripts do this automatically.

**`Fixture { request } from beforeAll cannot be reused` error**

The API tests use `playwrightRequest.newContext()` inside `beforeAll` instead of the `{ request }` fixture — this is intentional. Do not replace it with the fixture.
