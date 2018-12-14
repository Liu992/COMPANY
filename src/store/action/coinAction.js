import * as types from '../content';

let coinAction = (data) => {
  return {
    type: types.GET_COIN,
    data
  }
}

export default coinAction