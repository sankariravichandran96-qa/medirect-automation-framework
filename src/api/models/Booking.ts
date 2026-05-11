export interface BookingDates {
  checkin:  string;
  checkout: string;
}

export interface Booking {
  firstname:        string;
  lastname:         string;
  totalprice:       number;
  depositpaid:      boolean;
  bookingdates:     BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking:   Booking;
}

export interface BookingIdResponse {
  bookingid: number;
}

export interface AuthResponse {
  token: string;
}
