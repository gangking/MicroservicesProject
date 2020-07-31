import request from '@/utils/request'
import { INVOICE_API, REQUEST_TYPE } from './InvoiceURL'

/**
 * 查询凭证信息接口
 * @param {*} params
 */
export function checkVoucherData(params) {
  return request({
    url: INVOICE_API.VOUCHER_INFO,
    method: REQUEST_TYPE.GET,
    params: params
  })
};
/**
 * 冲销接口
 * @param {*} params
 */
export function checkWriteOffCertData(params) {
  return request({
    url: INVOICE_API.OFFVOUCHER_DATA,
    method: REQUEST_TYPE.POST,
    data: params
  })
}
