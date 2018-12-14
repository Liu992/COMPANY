import * as types from '../content';

let initialState = {
  name: 'klineaction',
  data: null
}
let reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_KLINE:
      let newdata = {}
      for (let attr in action.data) {
        let arr = attr && action.data[attr];
        let newarr = []
        for (let i = 0; i < arr.length; i++) {
          newarr.push(arr[i].c)
        }
        newdata[attr] = newarr
      }
      return {
        ...state,
        data: newdata
      }
    default: return state
  }
}

export default reducer