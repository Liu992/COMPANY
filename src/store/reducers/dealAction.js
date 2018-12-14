import * as types from '../content';

let initialState = {
  name: 'dealprice',
  price: ''
}
let reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DEALPRICE:
      return {
        ...state,
        price: action.price
      }
    default: return state
  }
}

export default reducer