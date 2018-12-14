import * as types from '../content';

let initialState = {
  name: 'marketAction',
  markets: [],
  tickers: {},
  marketPrices: {}
}
let reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_MARKET:
      return {
        ...state,
        markets: action.markets,
        tickers: action.tickers,
        marketPrices: action.marketPrices
      }
    default: return state
  }
}

export default reducer