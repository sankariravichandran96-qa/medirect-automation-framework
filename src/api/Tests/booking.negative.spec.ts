import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BookingClient } from '../clients/BookingClient';
import { createBookingPayload } from '../clients/BookingFactory';
import { TestData } from '../../Common/testData';
import { Config } from '../../Common/config';

test.describe('Booking Negative Tests', () => {

  let apiContext: APIRequestContext;
  let client:     BookingClient;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: Config.api.baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      }
    });
    client = new BookingClient(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Get non-existent booking ID returns 404',
    async () => {
      const response = await test.step(`GET /booking/${TestData.negative.nonExistentId}`, async () => {
        return client.getBooking(TestData.negative.nonExistentId);
      });

      await test.step('Verify HTTP 404 Not Found', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.notFound);
      });
    });

  test('Delete booking without token returns 403',
    async () => {
      let tempBookingId: number;

      await test.step('Create a temporary booking as the delete target', async () => {
        const createRes = await client.createBooking(createBookingPayload());
        const body      = await createRes.json();
        tempBookingId   = body.bookingid;
      });

      const response = await test.step(`DELETE /booking/${tempBookingId!} with no auth token`, async () => {
        return apiContext.delete(`/booking/${tempBookingId}`);
      });

      await test.step('Verify HTTP 403 Forbidden — unauthenticated delete rejected', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.forbidden);
      });

      await test.step('Clean up — delete temp booking with valid token', async () => {
        await client.deleteBooking(tempBookingId!);
      });
    });

  test('Create booking with missing required fields returns 500',
    async () => {
      const response = await test.step('POST /booking with only firstname (all other fields missing)', async () => {
        return apiContext.post('/booking', { data: TestData.negative.invalidPayload });
      });

      await test.step('Verify HTTP 500 — server cannot process an incomplete booking', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.serverError);
      });
    });

});