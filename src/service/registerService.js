import utils from '../utils/util.js';

// 注册邮箱验证
export const emailVerify = (code) => {
  return utils.fetch({
    url: "/api/sign/emailVerify/"+code,
    method: 'get'
  })
}