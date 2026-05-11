import { Booking } from '../models/Booking';
import { TestData } from '../../Common/testData';

export function createBookingPayload(overrides: Partial<Booking> = {}): Booking {
  const { priceMin, priceMax, checkinDate, checkoutDate, additionalNeeds, depositPaid } = TestData.booking;
  return {
    firstname:       `User${Date.now()}`,
    lastname:        `QA${Math.floor(Math.random() * 10_000)}`,
    totalprice:      Math.floor(Math.random() * (priceMax - priceMin)) + priceMin,
    depositpaid:     depositPaid,
    bookingdates: {
      checkin:  checkinDate,
      checkout: checkoutDate
    },
    additionalneeds: additionalNeeds,
    ...overrides
  };
}

export function createUpdatePayload(overrides: Partial<Booking> = {}): Booking {
  const { checkinDate, checkoutDate, additionalNeeds, totalPrice, depositPaid } = TestData.update;
  return {
    firstname:       `User${Math.floor(Math.random() * 1_000)}`,
    lastname:        `QA${Math.floor(Math.random() * 1_000)}`,
    totalprice:      totalPrice,
    depositpaid:     depositPaid,
    bookingdates: {
      checkin:  checkinDate,
      checkout: checkoutDate
    },
    additionalneeds: additionalNeeds,
    ...overrides
  };
}

export function createPatchPayload(): Partial<Booking> {
  return {
    firstname:  `Patch${Math.floor(Math.random() * 1_000)}`,
    totalprice: TestData.patch.totalPrice
  };
}
