import util from '../utils/util';

export const tokenSignin = (params) => {
  let auth = util.getCookie('Authorization');
  if (!auth) {
    return Promise.resolve({ result: 'not' });
  }
  return fetch(`/api/sign`, {
    method: "get",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + auth
    }
  }).then((res) => {
    return res.json();
  })
  .catch(err => {
    throw err;
  });
};

export const signin = (params) => {
  return fetch(`/api/sign/token`, {
    method: "post",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': 'Basic cGVhdGlvLmpzOmY0YzQ1OTJiMGM5ZjE2NjI='
    },
    body: util.getParams(params)
  }).then((res) => {
    return res.json();
  });
};
// 注册
export const signup = (params) => {
  return fetch(`/api/signup`, {
    method: "post",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded"
    },
    body: util.getParams(params)
  }).then((res) => {
    return res.json();
  });
};

export const getCode = () => {
  return fetch(`/api/sign/verifyCode`, {
    method: "get",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded"
    },
  }).then((res) => {
    return res.blob()
  });
}

// 登录验证
export const verifyCode = (type, googleCode, smsCode) => {
  return   util.fetch({
    url: '/api/auth/totp/verify',
    method: 'post',
    data: {
      type: type,
      code: type==="GA"?googleCode:smsCode
    }
  })
}

// 发送邮件
export const sendEmail = (email) => {
  return  util.fetch({
    url:'/api/sign/sendEmail',
    method: 'post',
    data: {
      email: email
    }
  })
}
// 发送手机短信
export const sendSMS = (data) => {
  return util.fetch({
    url: "/api/signup/sendSMS",
    method: "post",
    data: data
  })
}