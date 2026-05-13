# Task 1 — Postman Collection

API discovery and testing for the [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html) using Postman, with a full CRUD chain, token handling, dynamic variables, and a collection runner report.

---

## Files

| File | Description |
|---|---|
| `Restful_Booker_CRUD_Suite.postman_collection.json` | Full Postman collection with all requests chained in CRUD sequence |
| `Restful-Booker-DEV.postman_environment.json` | Environment file — base URL and all dynamic variables |
| `TestRunReport.json` | Collection runner report (JSON) |
| `TestRunReport_Screenshot1.png` | Collection runner results — screenshot 1 |
| `TestRunReport_Screenshot2.png` | Collection runner results — screenshot 2 |
| `TestRunReport_Screenshot3.png` | Collection runner results — screenshot 3 |
| `Task1_Challenges_and_Improvements.docx` | Challenges encountered and proposed improvements |

---

## Collection Structure

```
Restful Booker - CRUD Suite
├── Auth
│   ├── Health Check           ← GET /ping — confirms service is up
│   └── Get Auth Token         ← POST /auth — token stored as environment variable
│
├── Booking
│   ├── Create Booking         ← POST /booking — bookingId stored for subsequent requests
│   ├── Get Booking            ← GET /booking/:id — validates created booking
│   ├── Update Booking         ← PUT /booking/:id — full update with token
│   ├── Partial Update Booking ← PATCH /booking/:id — partial update with token
│   ├── Delete Booking         ← DELETE /booking/:id — removes booking with token
│   └── Verify Deleted Booking ← GET /booking/:id — confirms 404 after deletion
│
└── Negative Tests
    └── Get Invalid Booking    ← GET /booking/invalid — confirms error handling
```

---

## Environment Variables

The `Restful-Booker-DEV` environment manages all dynamic state across requests:

| Variable | Description |
|---|---|
| `baseUrl` | `https://restful-booker.herokuapp.com` |
| `token` | Set automatically after Get Auth Token runs |
| `bookingId` | Set automatically after Create Booking runs |
| `firstName` | Generated dynamically for each run |
| `lastName` | Generated dynamically for each run |
| `totalPrice` | Generated dynamically for each run |
| `updatedFirstName` | Used in Update Booking step |
| `updatedLastName` | Used in Update Booking step |
| `patchedFirstName` | Used in Partial Update step |

---

## How to Import and Run

### Import into Postman

1. Open **Postman**
2. Click **Import**
3. Select `Restful_Booker_CRUD_Suite.postman_collection.json`
4. Import again and select `Restful-Booker-DEV.postman_environment.json`
5. Select **Restful-Booker-DEV** from the environment dropdown (top right)

### Run the full collection

1. Click the collection **Restful Booker - CRUD Suite** in the sidebar
2. Click **Run collection**
3. Click **Run Restful Booker - CRUD Suite**

The entire CRUD chain runs automatically — no manual intervention required between requests.

### Run via Newman (command line)

```bash
npm install -g newman
newman run Restful_Booker_CRUD_Suite.postman_collection.json -e Restful-Booker-DEV.postman_environment.json
```
