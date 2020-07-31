/**
 * Cookies工具类
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:深圳文思海辉信息科技有限公司
 * </pre>
 */
import JsCookies from 'js-cookie'
import setting from '@/setting.js'
const cookies = {
  /**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
  set: function(name = 'default', value = '', cookieSetting = {}) {
    const currentCookieSetting = {
      expires: 1
    }
    Object.assign(currentCookieSetting, cookieSetting)
    JsCookies.set(`ibps-${setting.releases.version}-${name}`, value, currentCookieSetting)
  },
  /**
 * @description 获取 cookie 值
 * @param {String} name cookie name
 */
  get: function(name = 'default') {
    return JsCookies.get(`ibps-${setting.releases.version}-${name}`)
  },
  /**
 * @description 获取 cookie 全部的值
 */
  getAll: function() {
    return JsCookies.get()
  },
  /**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
  remove: function(name = 'default') {
    return JsCookies.remove(`ibps-${setting.releases.version}-${name}`)
  }

}

export default cookies
