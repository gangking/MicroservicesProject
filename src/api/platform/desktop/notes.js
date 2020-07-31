import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'

/**
 * 保存 工作台数据
 * @param {*} params
 */
export function saveNotes(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/syconsole/save',
    method: 'post',
    data: params
  })
  // return request({
  //   url: "http://192.168.30.21:5100/ibps/desktop/syconsole/save",
  //   method: 'post',
  //   data: params
  // })
}

/**
 * 获取 工作台数据
 * @param {*} params
 */
export function getNotes(id) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/syconsole/query',
    method: 'post',
    data: {
      parameters: [
        {
          key: "Q^userid_^S",
          value: id
        }
      ],
      requestPage: {
        limit: 0,
        pageNo: 0
      },
      sorts: [
        {
          field: "string",
          order: "string"
        }
      ]
    }
  })
  // return request({
  //   url: "http://192.168.30.21:5100/ibps/desktop/syconsole/query",
  //   method: 'post',
  //   data: {
  //     parameters: [
  //       {
  //         key: "string",
  //         value: "string"
  //       }
  //     ],
  //     requestPage: {
  //       limit: 0,
  //       pageNo: 0
  //     },
  //     sorts: [
  //       {
  //         field: "string",
  //         order: "string"
  //       }
  //     ]
  //   }
  // })
}





