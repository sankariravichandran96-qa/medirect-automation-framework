# Task 4 — CI/CD Pipeline

GitHub Actions pipeline that runs all API and UI tests automatically on every push, pull request, and on a daily schedule.

---

## Pipeline Overview

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
        notify                 ← Sends HTML email summary
```

---

## Triggers

| Trigger | When |
|---|---|
| `push` | Every commit pushed to `main` |
| `pull_request` | Every PR opened or updated against `main` |
| `schedule` | Every day at **22:30 UTC** automatically |
| `workflow_dispatch` | On-demand manual run from the GitHub Actions tab |

---

## Jobs

| Job | What it does |
|---|---|
| **API Integration Tests** | Runs all 13 API tests against the Restful Booker API |
| **UI End-to-End Tests** | Runs all 17 UI tests against the MeDirect site |
| **Publish Allure Report** | Deploys Allure reports to GitHub Pages |
| **Email Test Summary** | Sends HTML email with pass/fail counts |

---

## Live Reports

Reports are published automatically to GitHub Pages after every run:

| Report | Link |
|---|---|
| API Tests | [Allure API Report](https://sankariravichandran96-qa.github.io/medirect-automation-framework/api/index.html) |
| UI Tests | [Allure UI Report](https://sankariravichandran96-qa.github.io/medirect-automation-framework/ui/index.html) |

---

## Deliverables

The `deliverables/` folder contains screenshots demonstrating the pipeline is fully operational:

| File | Description |
|---|---|
| `pipeline-success.png` | GitHub Actions run showing all 4 jobs passing |
| `email-report.png` | HTML email summary received after a scheduled run |
| `allure-api-report.png` | Allure dashboard for API test results |
| `allure-ui-report.png` | Allure dashboard for UI test results |

---

## Pipeline Configuration

The full pipeline is defined in `.github/workflows/tests.yml`.

### Artifacts retained per run

- Playwright HTML reports — 30 days
- Allure reports — 30 days
- Failure screenshots — 7 days
