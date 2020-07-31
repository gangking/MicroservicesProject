import request from '@/utils/request'
import { INVOICE_API, REQUEST_TYPE } from './InvoiceURL'

/**
 * 行项目导出接口
 * @param {*} params
 */
export function columnExport(params) {
  return request({
    url: INVOICE_API.COLUMN_EXPORT,
    method: REQUEST_TYPE.POST,
    data: params
  })
};
/**
 * 业务事务导出接口
 * @param {*} params
 */
export function transactionExport(params) {
  return request({
    url: INVOICE_API.TRANSACTION_EXPORT,
    method: REQUEST_TYPE.POST,
    responseType: 'arraybuffer',
    data: params
  })
}
