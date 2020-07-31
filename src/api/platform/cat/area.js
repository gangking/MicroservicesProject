import request from '@/utils/request'
import { CAT_URL } from '@/api/baseUrl'

export function getAreaData(params = {}) {
  return request({
    url: CAT_URL + '/system/v3/cat/area/getData',
    method: 'post',
    data: params
  })
}

export function get(params = {}) {
  return request({
    url: CAT_URL + '/system/v3/cat/area/get',
    method: 'get',
    params
  })
}
