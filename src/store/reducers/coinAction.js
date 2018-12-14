import * as types from '../content';

let initialState = {
  name: 'coinaction',
  price: ''
}
let reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COIN:
      return {
        ...state,
        data: action.data
      }
    default: return state
  }
}

export default reducer