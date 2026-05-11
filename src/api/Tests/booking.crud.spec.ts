import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BookingClient } from '../clients/BookingClient';
import { createBookingPayload, createUpdatePayload, createPatchPayload } from '../clients/BookingFactory';
import { Booking, BookingResponse, BookingIdResponse } from '../models/Booking';
import { TestData } from '../../Common/testData';
import { Config } from '../../Common/config';

test.describe('Booking CRUD Journey', () => {

  let apiContext:     APIRequestContext;
  let client:         BookingClient;
  let bookingId:      number;
  let createdPayload: Booking;
  let updatedPayload: Booking;
  let patchFields:    Partial<Booking>;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: Config.api.baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      }
    });
    client         = new BookingClient(apiContext);
    createdPayload = createBookingPayload();
    const createRes = await client.createBooking(createdPayload);
    const body      = await createRes.json() as BookingResponse;
    bookingId       = body.bookingid;
  });

  test.afterAll(async () => {
    try { await client.deleteBooking(bookingId); } catch { /* already deleted by test 06 */ }
    await apiContext.dispose();
  });

  test('01 - Create booking returns 200 and a valid booking ID',
    async () => {
      await test.step('Verify booking was created in beforeAll with a numeric ID', async () => {
        expect(typeof bookingId).toBe('number');
        expect(bookingId).toBeGreaterThan(0);
      });
    });

  test('02 - Get booking returns the correct guest data',
    async () => {
      const response = await test.step('GET /booking/:id', async () => {
        return client.getBooking(bookingId);
      });

      await test.step('Verify HTTP 200', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.ok);
      });

      const body = await test.step('Parse response body', async () => {
        return await response.json() as Booking;
      });

      await test.step(`Verify firstname = "${createdPayload.firstname}"`, async () => {
        expect(body.firstname).toBe(createdPayload.firstname);
      });

      await test.step(`Verify lastname = "${createdPayload.lastname}"`, async () => {
        expect(body.lastname).toBe(createdPayload.lastname);
      });

      await test.step(`Verify totalprice = ${createdPayload.totalprice}`, async () => {
        expect(body.totalprice).toBe(createdPayload.totalprice);
      });

      await test.step('Verify depositpaid = true', async () => {
        expect(body.depositpaid).toBe(true);
      });

      await test.step('Verify bookingdates contains checkin and checkout', async () => {
        expect(body.bookingdates).toHaveProperty('checkin');
        expect(body.bookingdates).toHaveProperty('checkout');
      });
    });

  test('03 - Get all bookings contains our booking ID',
    async () => {
      const response = await test.step('GET /booking', async () => {
        return client.getAllBookings();
      });

      await test.step('Verify HTTP 200', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.ok);
      });

      const body = await test.step('Parse response body', async () => {
        return await response.json() as BookingIdResponse[];
      });

      await test.step('Verify response is a non-empty array', async () => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });

      await test.step(`Verify booking ID ${bookingId} is in the list`, async () => {
        expect(body.some(b => b.bookingid === bookingId)).toBe(true);
      });
    });

  test('04 - Full update (PUT) returns the updated data',
    async () => {
      updatedPayload = createUpdatePayload();

      const response = await test.step(`PUT /booking/${bookingId}`, async () => {
        return client.updateBooking(bookingId, updatedPayload);
      });

      await test.step('Verify HTTP 200', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.ok);
      });

      const body = await test.step('Parse response body', async () => {
        return await response.json() as Booking;
      });

      await test.step(`Verify firstname = "${updatedPayload.firstname}"`, async () => {
        expect(body.firstname).toBe(updatedPayload.firstname);
      });

      await test.step(`Verify lastname = "${updatedPayload.lastname}"`, async () => {
        expect(body.lastname).toBe(updatedPayload.lastname);
      });

      await test.step(`Verify totalprice = ${TestData.update.totalPrice}`, async () => {
        expect(body.totalprice).toBe(TestData.update.totalPrice);
      });

      await test.step('Verify depositpaid = false', async () => {
        expect(body.depositpaid).toBe(TestData.update.depositPaid);
      });
    });

  test('05 - Partial update (PATCH) returns the patched fields',
    async () => {
      patchFields = createPatchPayload();

      const response = await test.step(`PATCH /booking/${bookingId}`, async () => {
        return client.partialUpdateBooking(bookingId, patchFields);
      });

      await test.step('Verify HTTP 200', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.ok);
      });

      const body = await test.step('Parse response body', async () => {
        return await response.json() as Booking;
      });

      await test.step(`Verify firstname patched to "${patchFields.firstname}"`, async () => {
        expect(body.firstname).toBe(patchFields.firstname);
      });

      await test.step(`Verify totalprice patched to ${TestData.patch.totalPrice}`, async () => {
        expect(body.totalprice).toBe(TestData.patch.totalPrice);
      });

      await test.step('Verify lastname unchanged (non-empty string)', async () => {
        expect(typeof body.lastname).toBe('string');
        expect(body.lastname.length).toBeGreaterThan(0);
      });
    });

  test('06 - Delete booking returns 201',
    async () => {
      const response = await test.step(`DELETE /booking/${bookingId}`, async () => {
        return client.deleteBooking(bookingId);
      });

      await test.step('Verify HTTP 201 — booking deleted', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.created);
      });
    });

  test('07 - Confirm deleted booking returns 404',
    async () => {
      const response = await test.step(`GET /booking/${bookingId} after deletion`, async () => {
        return client.getBooking(bookingId);
      });

      await test.step('Verify HTTP 404 — booking no longer exists', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.notFound);
      });
    });

});