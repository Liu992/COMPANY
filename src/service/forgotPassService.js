import utils from '../utils/util.js';

// 重置密码
export const resetPassword = (values) => {
  return utils.fetch({
    url: "/api/sign/resetPassword",
    method: "post",
    data: {
      newPassword: values.confirm
    }
  })
}

// 忘记密码发送邮件
export const sendEmail = (value) => {
  return utils.fetch({
    url: "/api/sign/sendEmail",
    method: "post",
    data: {
      type: "reset",
      email: value
    }
  })
}
// 忘记密码发送手机号
export const sendSMS = (value) => {
  return utils.fetch({
    url: "/api/sign/sendSMS",
    method: 'post',
    data: {
      email: value
    }
  })
}

// 验证手机 邮箱
export const resetVerify = (email, emailCode, smsCode) => {
  return utils.fetch({
    url: "/api/sign/resetVerify",
    method: 'post',
    data: {
      email: email,
      emailCode: emailCode,
      smsCode: smsCode
    }
  })
}