import request from '@/utils/request'

export function listClient (query) {
  return request({
    url: '/upms/client/page',
    method: 'get',
    params: query
  })
}

export function addClient (obj) {
  return request({
    url: '/upms/client',
    method: 'post',
    data: obj
  })
}

export function getClient (clientId) {
  return request({
    url: '/upms/client/' + clientId,
    method: 'get'
  })
}

export function delClient (id) {
  return request({
    url: '/upms/client/' + id,
    method: 'delete'
  })
}

export function putClient (obj) {
  return request({
    url: '/upms/client',
    method: 'put',
    data: obj
  })
}