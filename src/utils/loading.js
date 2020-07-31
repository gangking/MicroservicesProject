import { Loading } from 'element-ui'

let loadingCount = 0
let loading
let settimeCurrent = null
const startLoading = () => {
    loading = Loading.service({
        lock: true,
        // text: '加载中……',
        customClass: 'stageloading',
        spinner: 'dot-pulse',
        background: 'rgba(0, 0, 0, 0.6)'
    })
}

const endLoading = () => {
    settimeCurrent = setTimeout(() => {
        loading.close()
    }, 500)
}

export const showLoading = () => {
    if (loadingCount === 0) {
        startLoading()
    }
    settimeCurrent && window.clearTimeout(settimeCurrent)
    loadingCount += 1
}

export const hideLoading = () => {
    if (loadingCount <= 0) {
        return
    }
    loadingCount -= 1
    if (loadingCount === 0) {
        endLoading()
    }
}
