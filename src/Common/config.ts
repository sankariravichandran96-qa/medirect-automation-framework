export const Config = {

  api: {
    baseUrl:  process.env.BASE_URL        || 'https://restful-booker.herokuapp.com',
    username: process.env.BOOKER_USERNAME || 'admin',
    password: process.env.BOOKER_PASSWORD || 'password123'
  },

  ui: {
    baseUrl: process.env.UI_BASE_URL || 'https://www.medirect.com.mt'
  }

} as const;
