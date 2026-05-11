import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../models/Booking';
import { AuthHelper } from './AuthHelper';

export class BookingClient {
  private readonly request:    APIRequestContext;
  private readonly authHelper: AuthHelper;

  constructor(request: APIRequestContext) {
    this.request    = request;
    this.authHelper = new AuthHelper(request);
  }

  // ── Health ────────────────────────────────────────────────────────────────
  async ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  async authenticate(): Promise<string> {
    return this.authHelper.getToken();
  }

  // ── Booking CRUD ──────────────────────────────────────────────────────────
  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(`/booking/${bookingId}`);
  }

  async getAllBookings(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  async updateBooking(bookingId: number, booking: Booking): Promise<APIResponse> {
    const token = await this.authHelper.getToken();
    return this.request.put(`/booking/${bookingId}`, {
      data:    booking,
      headers: { Cookie: `token=${token}` }
    });
  }

  async partialUpdateBooking(bookingId: number, fields: Partial<Booking>): Promise<APIResponse> {
    const token = await this.authHelper.getToken();
    return this.request.patch(`/booking/${bookingId}`, {
      data:    fields,
      headers: { Cookie: `token=${token}` }
    });
  }

  async deleteBooking(bookingId: number): Promise<APIResponse> {
    const token = await this.authHelper.getToken();
    return this.request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` }
    });
  }
}
