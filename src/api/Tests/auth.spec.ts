import { test, expect } from '@playwright/test';
import { BookingClient } from '../clients/BookingClient';
import { TestData } from '../../Common/testData';

test.describe('Auth API', () => {

  test('health check returns 201',
    async ({ request }) => {
      const client = new BookingClient(request);

      const response = await test.step('Send GET request to the health check endpoint', async () => {
        return client.ping();
      });

      await test.step('Verify the server responded with HTTP 201 — service is healthy', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.created);
      });
    });

  test('valid credentials return a non-empty token',
    async ({ request }) => {
      const client = new BookingClient(request);

      const token = await test.step('POST valid admin credentials to the auth endpoint', async () => {
        return client.authenticate();
      });

      await test.step('Verify the response contains a non-empty string token', async () => {
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      });
    });

});