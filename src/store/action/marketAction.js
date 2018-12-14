import * as types from '../content';

let marketAction = (markets) => {
  return {
    type: types.GET_MARKET,
    markets: markets.markets,
    tickers: markets.tickers,
    marketPrices: markets.marketPrices
  }
}

export default marketAction