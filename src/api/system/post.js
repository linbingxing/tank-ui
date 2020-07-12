import request from '@/utils/request'

// 查询岗位列表
export function pagePost(query) {
  return request({
    url: '/upms/post/page',
    method: 'get',
    params: query
  })
}

// 查询岗位列表
export function listPost() {
  return request({
    url: '/upms/post/list',
    method: 'get'
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/upms/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/upms/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/upms/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/upms/post/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/upms/post/export',
    method: 'get',
    params: query
  })
}