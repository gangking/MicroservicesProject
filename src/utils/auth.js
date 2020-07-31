
/**
 * TOKEN  等cookies的处理
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:深圳文思海辉信息科技有限公司
 * </pre>
 */
import Cookies from './util.cookies.js'

var TOKEN_KEY = 'token'
var REFRESH_TOKEN_KEY = 'refresh_token'
var UUID_KEY = 'uuid'

var tmpkey = 'fsfsdfsdf'
const setCurrentCookie = (val) => {
    TOKEN_KEY = 'token' + val
    REFRESH_TOKEN_KEY = 'refresh_token' + val
    UUID_KEY = 'uuid' + val
    Cookies.set(tmpkey, val)
}
if (Cookies.get(tmpkey)) {
    setCurrentCookie(Cookies.get(tmpkey))
}
/**
 * 获取tonken
 */
export function getToken() {
    return Cookies.get(TOKEN_KEY)
}

export function setToken(token, optins) {
    return Cookies.set(TOKEN_KEY, token, optins)
}

export function removeToken() {
    return Cookies.remove(TOKEN_KEY)
}

/**
 * 更新tonken（包含token和 refreshToken）
 */
export function updateToken(data) {
    // tonken 过期时间提前1分钟
    setToken(data.access_token, {
        expires: new Date(new Date().getTime() + ((parseInt(data.expires_in, 10) - 60) * 1000))
    })
    // 刷新过期时间提前2分钟
    setRefreshToken(data.refresh_token, {
        expires: new Date(new Date().getTime() + ((parseInt(data.remind_in, 10) - 120) * 1000))
    })
}

export function getRefreshToken() {
    return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token, optins) {
    return Cookies.set(REFRESH_TOKEN_KEY, token, optins)
}

export function removeRefreshToken() {
    return Cookies.remove(REFRESH_TOKEN_KEY)
}

export function getUuid() {
    return Cookies.get(UUID_KEY)
}

export function setUuid(uuid, optins) {
    uuid && setCurrentCookie(uuid)
    return Cookies.set(UUID_KEY, uuid, optins)
}

export function removeUuid() {
    return Cookies.remove(UUID_KEY)
}
