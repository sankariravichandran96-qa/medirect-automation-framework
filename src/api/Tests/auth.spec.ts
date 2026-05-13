import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, label, description } from 'allure-js-commons';
import { BookingClient } from '../clients/BookingClient';
import { TestData } from '../../Common/testData';

test.describe('Auth API', () => {

  test('TC01 - Health check endpoint returns 201 Created',
    async ({ request }) => {
      await epic('Restful Booker API');
      await feature('Auth — Health Check');
      await story('TC01 - Ping returns 201 confirming the service is up');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'A GET request to the /ping endpoint must return HTTP 201 Created, ' +
        'confirming the API service is reachable and healthy.'
      );

      const client = new BookingClient(request);

      const response = await test.step('Send GET request to the health check endpoint', async () => {
        return client.ping();
      });

      await test.step('Verify the server responded with HTTP 201 — service is healthy', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.created);
      });
    });

  test('TC02 - Valid credentials return a non-empty authentication token',
    async ({ request }) => {
      await epic('Restful Booker API');
      await feature('Auth — Token Generation');
      await story('TC02 - Valid credentials yield a non-empty token');
      await severity('critical');
      await label('priority', 'P1');
      await description(
        'POSTing valid admin credentials to /auth must return HTTP 200 and ' +
        'a response body containing a non-empty string token.'
      );

      const client = new BookingClient(request);

      const token = await test.step('POST valid admin credentials to the auth endpoint', async () => {
        return client.authenticate();
      });

      await test.step('Verify the response contains a non-empty string token', async () => {
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      });
    });

  test('TC13 - Invalid credentials return a bad credentials error — no token issued',
    async ({ request }) => {
      await epic('Restful Booker API');
      await feature('Auth — Token Generation');
      await story('TC13 - Invalid credentials return Bad credentials reason with no token');
      await severity('normal');
      await label('priority', 'P2');
      await description(
        'POSTing incorrect credentials to /auth must return HTTP 200 but ' +
        'the response body must contain a "reason" field with "Bad credentials" ' +
        'and must NOT contain a token field.'
      );

      const client = new BookingClient(request);

      const response = await test.step(
        `POST invalid credentials (username: "${TestData.negative.invalidUsername}") to the auth endpoint`,
        async () => {
          return client.postAuth(
            TestData.negative.invalidUsername,
            TestData.negative.invalidPassword
          );
        }
      );

      await test.step('Verify the response status is HTTP 200', async () => {
        expect(response.status()).toBe(TestData.expectedStatus.ok);
      });

      const body = await test.step('Parse the response body', async () => {
        return response.json() as Promise<Record<string, unknown>>;
      });

      await test.step('Verify the body contains a "reason" field indicating bad credentials', async () => {
        expect(body).toHaveProperty('reason');
        expect(body.reason).toBe('Bad credentials');
      });

      await test.step('Verify no token was issued for the invalid credentials', async () => {
        expect(body).not.toHaveProperty('token');
      });
    });

});