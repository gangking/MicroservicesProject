import util from '@/utils/util'
const { keys, hasOwnProperty } = Object
/**
 * 迭代给对象赋值
 * @param {*} source
 * @param {*} val
 */
export function forEachAssign(source, val) {
    keys(val).forEach((item, i) => {
        // console.log("setState:", item, source)
        if (hasOwnProperty.call(source, item)) {
            source[item] = val[item]
        }
    })
}

/**
 * 初始化状态值
 * @param {*} state
 * @param {*} moduleState
 */
export function resetState(mState) {
    if (hasOwnProperty.call(mState, 'initState') && util.isFunction(mState.initState)) {
        const initState = mState.initState()
        forEachAssign(mState, initState)
    }
}

export function register(name, store, module) {
    store.registerModule(name, module)
}

export function unregister(name, store, module) {
    store.unregisterModule(name)
}
