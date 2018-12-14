import * as types from '../content';

let dealAction = (price) => {
  return {
    type: types.GET_DEALPRICE,
    price
  }
}

export default dealAction