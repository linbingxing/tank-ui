import request from '@/utils/request'

// 登录方法
export function login(username, password, code, randomStr) {
  const scope = 'all'
  const grant_type = 'password'

  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken:false,
      'Authorization': 'Basic enVpcGluOnpsdA=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/upms/user/getCurrentUser',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/tokens/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}