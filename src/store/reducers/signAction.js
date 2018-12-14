import * as types from '../content';

let initialState = {
  name: 'signAction',
  isLogin: false,
  member: {
    email:null,
    sms: null,
    google: null,
    verify: false,
    nickname: null
  }
}
let reducer = (state = initialState, action) => {
  
  switch (action.type) {
    case types.GET_SIGN:
      return {
        ...state,
        isLogin: action.isLogin,
        member: action.member
      }
    // case types.GET_ACTIVE:
    //   return {
    //     ...state,
    //     isLogin: action.isLogin,
    //     member: action.member
    //   }
    default: return state
  }
}

export default reducer