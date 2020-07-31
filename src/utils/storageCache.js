import util from '@/utils/util.js'
import LocalStorageCache from 'localstorage-cache';
const storageCache = new LocalStorageCache(2 * 1024, 'LRU');
const cacheKey = process.env.VUE_APP_SET_CLIENT_SECRET_KEY;
export const setCurrentSecret = () => {
    const s_params = util.queryToJson(window.location.href);
    console.log("s_params", s_params)
    storageCache.setCache(cacheKey, s_params['routerName'] ?
        process.env.VUE_APP_MOA_CLIENT_SECRET + "$$" + process.env.VUE_APP_MOA_CLIENT_ID : process.env.VUE_APP_CLIENT_SECRET + "$$" + process.env.VUE_APP_CLIENT_ID);
}

export default () => {
    var data = storageCache.getCache(cacheKey);
    return data ? data.split("$$") : [process.env.VUE_APP_CLIENT_SECRET, process.env.VUE_APP_CLIENT_ID];
}