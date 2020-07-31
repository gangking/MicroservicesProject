/**
 * 数据持久化
 *  避免页面刷新数据丢失
 *   目前存储LocalStorage
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:深圳文思海辉信息科技有限公司
 * </pre>
 */
import low from 'lowdb'
// 存储方式
import LocalStorage from 'lowdb/adapters/LocalStorage'
// 设置
import setting from '@/setting.js'

const adapter = new LocalStorage(`ibps-${setting.releases.version}`)
const db = low(adapter)

db.defaults({
  sys: {},
  database: {}
}).write()

export default db
