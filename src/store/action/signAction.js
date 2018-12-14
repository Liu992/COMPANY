import * as types from '../content';

let signAction = (active = {isLogin: false}) => {
  return {
    type: types.GET_SIGN,
    isLogin: active.isLogin,
    member: active.member
  }
}

function signActionTimeout(active) {
  return function (dispatch) {
    setTimeout(() => {
      dispatch(signAction(active))
    },0)
  } 
}

export default signActionTimeout
