import LocalStorageCache from 'localstorage-cache'
/*
 * Set cache size: 2 * 1024KB(2MB)
 * set cache strategy: LRU / LFU;
 */
const storageCache = new LocalStorageCache(2 * 1024, 'LRU')
const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const UUID_KEY = 'uuid'
/**
 * 获取tonken
 */
export function getToken() {
    return storageCache.getCache(TOKEN_KEY)
}

export function setToken(token, optins) {
    return storageCache.setCache(TOKEN_KEY, token)
}

export function removeToken() {
    return storageCache.deleteCache(TOKEN_KEY)
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
    return storageCache.getCache(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token, optins) {
    return storageCache.setCache(REFRESH_TOKEN_KEY, token)
}

export function removeRefreshToken() {
    return storageCache.deleteCache(REFRESH_TOKEN_KEY)
}

export function getUuid() {
    return storageCache.getCache(UUID_KEY)
}

export function setUuid(uuid, optins) {
    return storageCache.setCache(UUID_KEY, uuid)
}

export function removeUuid() {
    return storageCache.deleteCache(UUID_KEY)
}

export default storageCache

