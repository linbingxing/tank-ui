import request from '@/utils/request'

// 查询字典类型列表
export function pageType(query) {
  return request({
    url: '/upms/dict/type/page',
    method: 'get',
    params: query
  })
}

// 查询字典类型列表
export function listType() {
  return request({
    url: '/upms/dict/type/list',
    method: 'get'
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/upms/dict/type/' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/upms/dict/type',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/upms/dict/type',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: '/upms/dict/type/' + dictId,
    method: 'delete'
  })
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: '/upms/dict/type/clearCache',
    method: 'delete'
  })
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: '/upms/dict/type/export',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/upms/dict/type/optionselect',
    method: 'get'
  })
}