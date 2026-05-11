export const TestData = {

  booking: {
    checkinDate:     '2025-06-01',
    checkoutDate:    '2025-06-10',
    additionalNeeds: 'Breakfast',
    depositPaid:     true,
    priceMin:        100,
    priceMax:        500
  },

  update: {
    checkinDate:     '2025-07-01',
    checkoutDate:    '2025-07-05',
    additionalNeeds: 'Lunch',
    totalPrice:      999,
    depositPaid:     false
  },

  patch: {
    totalPrice: 111
  },

  negative: {
    nonExistentId:  999999999,
    invalidPayload: { firstname: 'OnlyName' }
  },

  expectedStatus: {
    ok:          200,
    created:     201,
    forbidden:   403,
    notFound:    404,
    serverError: 500
  }

} as const;
