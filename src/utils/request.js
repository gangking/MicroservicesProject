import axios from 'axios'
import store from '@/store'
import I18n from '@/utils/i18n' // Internationalization 国际化
import Utils from '@/utils/util'
// 菜单和路由设置
import router from '@/router' // 路由
import { Message, MessageBox } from 'element-ui'

// 验权
import { getToken, removeToken } from '@/utils/auth'
import requestState from '@/constants/state'
const BASE_URL = process.env.VUE_APP_BASE_API
const HEADER_TOKEN_KEY = process.env.VUE_APP_TOKEN_KEY // header 请求的token key
const HEADER_SUBSYSTEM_KEY = process.env.VUE_APP_SUBSYSTEM_KEY // header 请求的token key
const TIMEOUT = 3000 * 10 * 2// 请求超时（timeout）时间
// 白名单，匿名的URL
const whiteList = [
    '/auth/v3/user/captcha',
    '/user/v3/user/login',
    '/auth/v3/user/login/apply',
    '/authorize',
    '/auth/v3/authorize/apply',
    '/authentication',
    '/auth/v3/authentication/apply',
    '/auth/v3/user/open'
]

/**
 * 创建axios实例
 */
const service = axios.create({
    baseURL: BASE_URL, // api的base_url
    timeout: TIMEOUT, // request timeout
    withCredentials: true //  跨域安全策略

})
const RefreshTokenInstance = {
    request: null
}
const showMessage = (msg) => {
    Message({
        message: `${msg}`,
        type: 'error',
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 5 * 1000
    })
}
const LOGIN_OUT = () => {
    return MessageBox.confirm(
        I18n.t('error.logout.message'),
        I18n.t('error.logout.title'), {
        confirmButtonText: I18n.t('error.logout.confirmButtonText'),
        cancelButtonText: I18n.t('error.logout.cancelButtonText'),
        type: 'warning'
    }).then(() => {
        console.log('重新登录')
        store.dispatch('ibps/account/fedLogout')
        router.push({
            name: 'login'
        })
        return Promise.reject()
    })
}
const RefreshToken = (request) => {
    if (RefreshTokenInstance.request) {
        return RefreshTokenInstance.request.then(() => {
            request.headers[HEADER_TOKEN_KEY] = getToken()
            return request
        })
    } else {
        // 先清理token
        removeToken()
        RefreshTokenInstance.request = store.dispatch('ibps/account/refreshToken').then(() => {
            request.headers[HEADER_TOKEN_KEY] = getToken()
            RefreshTokenInstance.request = null
            return request
        }).catch((err) => {
            RefreshTokenInstance.request = null
            LOGIN_OUT()
            // 刷新失败提示登录吧
            return Promise.reject(err)
        })
        return RefreshTokenInstance.request
    }
}

service.interceptors.request.use((request) => {
    // 判断是否需要token
    if (whiteList.indexOf(request.url) !== -1) {
        return request
    }
    const token = getToken()
    let sys = store.state.ibps.system.system;
    request.headers[HEADER_SUBSYSTEM_KEY] = sys ? sys.id : "";
    if (token) {
        request.headers[HEADER_TOKEN_KEY] = token
    } else {
        return RefreshToken(request)
    }
    return request
})

service.interceptors.response.use(response => {
    const dataAxios = response.data
    const { state, message, cause } = dataAxios
    if (response.config.responseType === 'arraybuffer') {
        // 刷新tonken
        return response
    }
    if (state === undefined) {
        const msg = '接口异常，没有返回[state]参数</br>' + response.config.url
        showMessage(msg)
        return Promise.reject(msg)
    }
    if (state === requestState.SUCCESS ||
        state === requestState.UNSUPORT ||
        state === requestState.WARNING || state === 500) {
        // if (!Utils.isEmpty(cause)) {
        //     showMessage(`${cause}, 接口:${response.config.url}`)
        //     return Promise.reject(cause)
        // }
        return dataAxios
    } else if (state === requestState.TOKEN_EXPIRED) {
        const config = response.config
        return RefreshToken(config).then((request) => {
            return service(request)
        })
    } else if (state === requestState.ILLEGAL_TOKEN ||
        state === requestState.NOTHER_CLIENTS ||
        state === requestState.TOKEN_REFRESH_EXPIRED) {
        LOGIN_OUT()
        return Promise.reject(message)
    } else {
        let errorMsg = ''
        if (Utils.isNotEmpty(message)) { // 有错误消息
            errorMsg = Utils.isNotEmpty(dataAxios.cause) ? I18n.t('error.messageCause', {
                message,
                cause: dataAxios.cause
            }) : I18n.t('error.message', {
                message
            })
        } else if (Utils.isNotEmpty(cause)) { // 只有错误原因
            errorMsg = I18n.t('error.cause', {
                cause
            })
        } else if (I18n.te('error.status.' + state)) { // 有错误编码
            errorMsg = I18n.t('error.status.' + state)
        } else { // 未知
            errorMsg = message || I18n.t('error.unknown', {
                state
            })
        }
        //Message.closeAll()
        // Message({
        //     message: `${errorMsg}`,
        //     type: 'error',
        //     showClose: true,
        //     dangerouslyUseHTMLString: true,
        //     duration: 5 * 1000
        // })
        const err = new Error(errorMsg)
        err.state = state
        err.cause = cause
        return Promise.reject(err)
    }
})

export default service
