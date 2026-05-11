export const UITestData = {

  urls: {
    equitiesSearch: '/invest/equities/search/',
    stocksReports:  '/invest/equities/search/stocksreports/'
  },

  tabs: {
    equities: 'EQ Equities',
    funds:    'FND Funds',
    etfs:     'ETF ETFs',
    bonds:    'BND Bonds'
  },

  urlContains: {
    equities: '/invest/equities/search',
    funds:    'fund',
    etfs:     'etf',
    bonds:    'bond'
  },

  rowPrefix: {
    equities: 'EQ',
    funds:    'FND',
    etfs:     'ETF',
    bonds:    'BND'
  },

  search: {
    popularEquity:     'Apple',
    popularEquityRow:  'EQ APPLE INC TECHNOLOGY NMS',
    nonExistentEquity: 'XYZABCD1234NOTREAL'
  },

  restricted: {
    fullFunctionalityText: 'Do you want to start using the full functionality for FREE?',
    becomeCustomerBtn:     'Become a customer',
    becomeClientBtn:       'Become a client',
    lockedFields: [
      'Last Close', 'RoE', 'Mkt Cap', 'Dividend Yield',
      'Exchange', 'PE', 'Volume', 'Net Margin', 'Price/Sales'
    ],
    overviewHeading:      'Overview',
    experienceBetterText: 'Experience better Investing',
    signUpText:           'Sign up and open your account for free, within minutes.'
  },

  cookies: {
    acceptButton: 'Accept'
  }

} as const;
