import utils from '../utils/util';

/********personal*********/


// 实名认证
export const certification = (obj) => {
  return utils.fetch({
    url: '/api/idDocument/confirm',
    method: 'post',
    data: obj
  })
};

// 修改密码
export const changepass = (values) => {
  return utils.fetch({
    url: "/api/sign/changePassword",
    method: "post",
    data: {
      oldPassword: values.passwordold,
      newPassword: values.confirm,
      smsCode: values.captcha
    }
  })
}

// 请求短信验证码
export const sendSMS = () => {
  return utils.fetch({
    url: "/api/auth/sendSMS",
    method: 'post'
  })
}

// 绑定手机发送短信
export const bindSendSMS = (prefix, phone) => {
  return utils.fetch({
    url: "/api/auth/sendSMS",
    method: 'post',
    data: {
      prefix: prefix,
      phone: phone
    }
  })
}

// 新手机号发送验证码
export const newSendPhone = (phone) => {
  return  utils.fetch({
    url: "api/auth/sendSMS",
    method: "post",
    data: {
      phone: phone
    }
  })
}

// 发送邮件
export const sendEmail = (data) => {
  return utils.fetch({
    url: '/api/auth/sendemail',
    method: 'post',
    data: data
  })
}

// 验证开关
export const switchOn = (type, swit, codeObj) => {
  return utils.fetch({
    url: "/api/auth/" + type + "" + "/" + swit,
    method: 'post',
    data: {
      emailCode: codeObj.emailcode,
      SMSCode: codeObj.smscode,
      GAcode: codeObj.googlecode
    }
  })
}

// 绑定手机号
export const bindPhone = (values) => {
  return utils.fetch({
    url: "/api/auth/phone/bind",
    method: "post",
    data: {
      code: values.captcha
    }
  })
}

// 更新手机号
export const changePhone = (phone, newcode, oldcode) => {
  return utils.fetch({
    url: "/api/auth/phone/update",
    method: 'post',
    data: {
      phone: phone,
      codeNew: newcode,
      codeOld: oldcode
    }
  })
}

// 绑定谷歌
export const bindGoogle = (value) => {
  return  utils.fetch({
    url: '/api/auth/totp/bind',
    method: 'post',
    data: {
      type: 'bind',
      GAcode: value
    }
  })
}

// 查找keycode
export const searchSecret = () => {
  return utils.fetch({
    url: '/api/auth/totp/secret',
    method: 'get'
  })
}

// 查询国家
export const searchNation = () => {
  return utils.fetch({
    url: '/api/idDocument',
    method: 'get'
  })
}

// 绑定邮箱发送邮件
export const setEmail = (data) => {
  return utils.fetch({
    url: "/api/auth/bind/sendEmail",
    method: "post",
    data: data
  })
}

// 验证绑定邮箱
export const verifyEmail = (data) => {
  return utils.fetch({
    url: "/api/auth/bind/email",
    method: "post",
    data: data
  })
}



