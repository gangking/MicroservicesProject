import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'

// 查询
export function getTable(params) {
  return request({
    url: '/system/v3/apiLog/queryLog',
    method: 'post',
    data: params
  })
}

// // 导出
// export function downExcel(params) {
//   return request({
//     url: COMP_URL + '/scene/v3/outstandingaccount/export',
//     method: 'post',
//     responseType: 'arraybuffer',
//     data: params
//   })
// }