/**
 * 按钮统一处理
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:深圳文思海辉信息科技有限公司
 * </pre>
 */
import BUTTONS from '@/constants/buttons'

/**
 * 获取按钮的icon
 * @param {*} key
 */
export function getButtonIcon(key) {
  return BUTTONS[key] ? BUTTONS[key].icon : null
}

/**
 * 获取按钮类型
 */
export function getButtonType(key) {
  return BUTTONS[key] ? BUTTONS[key].type : 'primary'
}
