import { APIRequestContext } from '@playwright/test';
import { AuthResponse } from '../models/Booking';
import { Config } from '../../Common/config';

export class AuthHelper {
  private readonly request: APIRequestContext;
  private token: string | null = null;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getToken(): Promise<string> {
    if (this.token) return this.token;

    const response = await this.request.post('/auth', {
      data: {
        username: Config.api.username,
        password: Config.api.password
      }
    });

    if (!response.ok()) {
      throw new Error(`Auth failed with status: ${response.status()}`);
    }

    const body = await response.json() as AuthResponse;

    if (!body.token) {
      throw new Error('No token returned from auth endpoint');
    }

    this.token = body.token;
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }
}
