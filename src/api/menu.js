import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/upms/menu/getRouter',
    method: 'get',
    params: {sysId:1}
  })
}