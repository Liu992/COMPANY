import * as types from '../content';

let klineAction = (data) => {
  return {
    type: types.GET_KLINE,
    data
  }
}

export default klineAction