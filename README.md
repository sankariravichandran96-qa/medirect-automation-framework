# MeDirect SDET Assessment — Task 2, 3 & 4

End-to-end test framework covering:
- **Task 2** — API integration and wrapper unit tests for the [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html)
- **Task 3** — UI automation tests for the [MeDirect Equities Search page](https://www.medirect.com.mt/invest/equities/search)
- **Task 4** — CI/CD pipeline via GitHub Actions with daily scheduling and Allure report publishing

Built with **Playwright + TypeScript**, **Jest** for unit tests, and **Allure** for rich test reporting.

---

## Quick Start

```bash
npm install
npx playwright install chromium

# API tests
npm run test:api

# UI tests
npm run test:ui

# Open Playwright report
npm run report:html
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | 6.x | Strong typing, interfaces, OOP |
| [Playwright](https://playwright.dev/) | 1.59+ | API + UI test runner |
| [Jest](https://jestjs.io/) | 29.x | Unit test runner for the BookingClient wrapper |
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
│   │       ├── booking.negative.spec.ts# Negative / error path tests
│   │       └── bookingClient.unit.spec.ts # Unit tests for BookingClient using Jest + mocks
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

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Test Specs                           │
│   auth.spec   crud.spec   navigation.spec   search.spec     │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   ┌──────────────────┐      ┌──────────────────────┐
   │    API Layer     │      │       UI Layer        │
   │  BookingClient   │      │  EquitiesSearchPage   │
   │  AuthHelper      │      │  SecurityDetailPage   │
   │  BookingFactory  │      │  (Page Object Model)  │
   └────────┬─────────┘      └──────────┬────────────┘
            │                           │
            ▼                           ▼
   ┌──────────────────┐      ┌──────────────────────┐
   │  Restful Booker  │      │   MeDirect Web App   │
   │       API        │      │  (medirect.com.mt)   │
   └──────────────────┘      └──────────────────────┘
```

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Java 11+** — required by Allure CLI to generate and open reports
- **Visual Studio Code** *(recommended)* — [Download](https://code.visualstudio.com/) with the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for one-click test running, debugging, and built-in test explorer

### Installing Java

Download **Eclipse Temurin 17** (free, LTS) from [adoptium.net](https://adoptium.net/). During the Windows installer, check **"Set JAVA_HOME"** and **"Add to PATH"**. On Mac/Linux:

```bash
# Mac
brew install openjdk@17

# Linux
sudo apt-get install -y openjdk-17-jre
```

Verify: `java --version`

### Installing Allure CLI

Allure is installed automatically via `npm install` — no separate setup needed.

Verify: `npx allure --version` — if this errors, Java is not on your PATH.

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

### 4 — Verify the setup

```bash
node --version       # 18 or higher
java --version       # 11 or higher
npx allure --version # 2.x.x
```

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

### Unit Tests — BookingClient (Task 2)

The `BookingClient` wrapper is covered by unit tests using **Jest** with mocked HTTP
responses — no real network calls are made.

```bash
npm run test:unit
```

> **Note:** Unit tests run locally only. They are intentionally excluded from the CI
> pipeline to keep the pipeline focused on integration and E2E tests against the live
> environments. This is a deliberate SDET decision — unit tests validate the wrapper
> logic in isolation; integration tests validate the real API behaviour.

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
| `npm run test:unit` | Run BookingClient unit tests (Jest, local only) |
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
| `auth.spec.ts` | 3 | Health check (ping), valid credentials return a token, invalid credentials return Bad credentials |
| `booking.crud.spec.ts` | 7 | Create → Get → List → PUT → PATCH → Delete → Confirm deleted |
| `booking.negative.spec.ts` | 3 | Non-existent ID (404), unauthorised delete (403), malformed payload (500) |

The CRUD tests run in a single chained describe block using `beforeAll` to create one shared booking — mirroring the Postman collection runner approach from Task 1.

### Unit Tests — BookingClient (Task 2)

| File | Tests | What is covered |
|---|---|---|
| `bookingClient.unit.spec.ts` | 8 | BookingClient methods tested in isolation using Jest mocks — no real HTTP calls made |

Unit tests mock the `APIRequestContext` to verify that `BookingClient` constructs requests
correctly (correct URLs, headers, token injection) without hitting the live API.

### UI Tests — MeDirect Equities (Task 3)

| File | Tests | What is covered |
|---|---|---|
| `navigation.spec.ts` | 4 | Default equities tab load + row count; Funds, ETFs, Bonds tab navigation |
| `search.spec.ts` | 7 | Search returns results; More Information navigates; non-existent search empty; case-insensitive search; partial name search; special character search; dynamic results update when term changes |
| `securityDetails.spec.ts` | 6 | Registration banner; Overview fields locked; Bottom CTA + sign-up text; Price lock icon; Back to search results click navigates back; Direct URL access still restricted |

---

## CI/CD Pipeline (Task 4)

The test framework is fully integrated into a GitHub Actions pipeline defined in
`.github/workflows/tests.yml`.

### Pipeline Overview

```
Push / PR / Schedule / Manual
           │
     ┌─────┴──────┐
     ▼            ▼
 api-tests     ui-tests        ← Run in parallel
     │            │
     └─────┬──────┘
           ▼
   publish-allure              ← Publishes Allure report to GitHub Pages
           │
           ▼
        notify                 ← Sends HTML email summary (schedule & failures)
```

### Triggers

| Trigger | When |
|---|---|
| `push` | Every commit pushed to `main` |
| `pull_request` | Every PR opened or updated against `main` |
| `schedule` | Every day at **22:30 UTC** (00:30 CEST / 12:30 AM CEST) automatically |
| `workflow_dispatch` | On-demand manual run from the GitHub Actions tab |

### Jobs

| Job | What it does |
|---|---|
| **API Integration Tests** | Runs all 13 API tests (auth, CRUD, negative) against the Restful Booker API |
| **UI End-to-End Tests** | Runs all 17 UI tests (navigation, search, security details) against the MeDirect site |
| **Publish Allure Report** | Downloads both Allure reports and deploys them to GitHub Pages |
| **Email Test Summary** | Parses results JSON and sends an HTML email with pass/fail counts |

> **Note — Unit tests are excluded from CI intentionally.** The `bookingClient.unit.spec.ts`
> Jest unit tests run locally only (`npm run test:unit`). The CI pipeline is deliberately
> kept focused on integration and E2E tests that validate real API and browser behaviour.
> Unit tests validate the `BookingClient` wrapper in isolation and do not require a
> pipeline environment to run.

### Artifacts

Every run uploads the following artifacts (retained for 30 days):

- `api-playwright-html-report` — Playwright HTML report for API tests
- `api-allure-report` — Allure report for API tests
- `ui-playwright-html-report` — Playwright HTML report for UI tests
- `ui-allure-report` — Allure report for UI tests
- `ui-failure-screenshots` — Screenshots captured on UI test failure (7 days)

### Live Test Reports

The latest Allure reports are published automatically to GitHub Pages after every run:

**[https://sankariravichandran96-qa.github.io/restful-booker-tests/](https://sankariravichandran96-qa.github.io/restful-booker-tests/)**

| Report | Direct link |
|---|---|
| API Tests | [/api/index.html](https://sankariravichandran96-qa.github.io/restful-booker-tests/api/index.html) |
| UI Tests | [/ui/index.html](https://sankariravichandran96-qa.github.io/restful-booker-tests/ui/index.html) |

### Running the Pipeline Manually

1. Go to the **Actions** tab in the GitHub repository
2. Click **Restful Booker — API & UI Tests** in the left sidebar
3. Click **Run workflow** → **Run workflow**
4. All four jobs will execute and results will be available as artifacts within ~5 minutes

### Email Notifications (Optional Setup)

The `notify` job sends an HTML email report after every scheduled run and on any
test failure. To enable it, add the following three secrets under
**Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `EMAIL_USERNAME` | Gmail address used to send the report |
| `EMAIL_PASSWORD` | Gmail App Password (16-character code from myaccount.google.com → Security → App passwords) |
| `EMAIL_RECIPIENT` | Email address that receives the daily report |

---

## Design Decisions

| Decision | Reason |
|---|---|
| `BookingClient` wraps all HTTP calls | Tests focus on behaviour — HTTP mechanics stay in one place and are easy to update |
| `AuthHelper` caches the token per context | Avoids a redundant auth call before every test that needs a token |
| `BookingFactory` generates unique names via `Date.now()` | Prevents ID collisions between parallel or repeated runs |
| `beforeAll` creates one shared booking for CRUD tests | All CRUD steps operate on the same record — consistent with the Postman collection approach from Task 1 |
| `afterAll` cleans up test data on every describe | Keeps the API clean between runs — no leftover test records accumulate |
| Page Object Model for all UI interactions | Locators live in one file — if the UI changes, only the page object needs updating |
| `test.step()` wraps every assertion | Allure report shows readable step names that a non-technical reviewer can follow |
| `test.describe.configure({ mode: 'serial' })` on UI suites | Tests that navigate across pages depend on order — serial mode enforces this |
| `workers: 1` in API config | CRUD tests share a booking ID across steps — running them in parallel would cause race conditions |
| Allure metadata via `allure-js-commons` | Uses the current non-deprecated API — `epic()`, `feature()`, `story()` called as plain async functions |
| Separate `playwright.api.config.ts` and `playwright.ui.config.ts` | API and UI suites have different base URLs and timeouts — keeping configs separate avoids cross-contamination |
| All test data in `src/Common/` | One place to update values — no hardcoded strings scattered across test files |

---

## Proposed Improvements

Natural next steps for a production version of this framework:

- **Tag-based test selection** — Add `@smoke` and `@regression` tags to enable selective CI runs (e.g. `--grep @smoke` for a quick sanity check on every PR, full regression nightly). Tags were omitted here to keep the test signatures clean for readability.
- **Search debounce handling** — `EquitiesSearchPage.searchFor()` uses `waitForTimeout(1500)` to account for the site's search debounce. A more robust approach would intercept the outgoing search request via `page.waitForResponse()` and resolve when the response arrives — eliminating the fixed wait and making tests faster and more reliable.
- **API response schema validation** — Assert the shape of every API response (required fields, correct types) using a schema library such as Zod or JSON Schema. This catches contract-breaking changes that a status-code check alone would miss.
- **Visual regression testing** — Screenshot comparisons for the locked fields and registration banner using Playwright's built-in `toHaveScreenshot()`, so any unintended UI change is caught automatically.
- **Retry on flake** — Enable `retries: 2` in CI to auto-retry transient network failures against the live test environments without marking a test as failed on the first timeout.
- **Cross-browser coverage** — Extend the UI suite to run against Firefox and WebKit in CI (in addition to Chromium) to catch browser-specific rendering or behaviour differences earlier in the pipeline.

