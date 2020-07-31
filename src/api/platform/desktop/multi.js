import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'

/**
 * 保存 多桌面数据
 * @param {*} params
 */
export function saveMulti(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/layout/muitilSave',
    method: 'post',
    data: params
  })
  // return request({
  //   url: "http://192.168.30.19:5100/ibps/desktop/layout/muitilSave",
  //   method: 'post',
  //   data: params
  // })
}

/**
 * 获取 多桌面数据
 * @param {*} params
 */
export function getMulti(id) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/layout/muitilQuery',
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
  //   url: "http://192.168.30.19:5100/ibps/desktop/layout/muitilQuery",
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




