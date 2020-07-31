import _ from 'lodash'
import FormOpenDailog from './mixins/form-open-dailog';
import FormOpenTags from './mixins/form-open-tags';
import FormOpenNative from './mixins/form-open-native';
import openWindowType from './mixins/open-form-component-type';
import beforeActionsCheck from './beforeActionMixins/checkFormException'
const files = require.context('./src', true, /index\.js$/);
const checkReturnVal = function (val, defaultValue) {
    if (val === undefined) {
        return Promise.resolve(defaultValue);
    } else if (val === false) {
        return Promise.reject("停止执行了...")
    } else {
        return Promise.resolve(val);
    }
}
const checkNextFunctionPromise = (val, defaultValue) => {
    if (val instanceof Promise) {
        return val.then((_val) => {
            return checkReturnVal(_val, defaultValue)
        });
    }
    return checkReturnVal(val, defaultValue);
}
//按钮参数规范
//(btn信息，从哪个vue组件触发的, ...其他的数据信息)
//btnval 规范 args触发参数列表, target :触发对象
const wrapperMethodFunction = function (nativeMethods) {
    let wrapperButtonFunction = function (btnVal) {
        //console.log('wrapperButtonFunction', btnVal, arguments)
        let self = this;
        return this.callPreCurrentTabVmEvent(btnVal).then(function (val) {
            return checkNextFunctionPromise(val, btnVal).then((_itemVal) => {
                let result = nativeMethods.apply(self, [_itemVal]);
                return checkNextFunctionPromise(result, _itemVal).then((_val) => {
                    if (_.has(_val, 'tabItems')) { //有tabItems才执行打开组件
                        self.opentComponent(_val);
                    }
                    return _val;
                }).catch((msg) => {
                    console.warn(msg)
                })
            }).catch((msg) => {
                console.warn(msg)
            })

        })

    };
    wrapperButtonFunction.IsWrapperButtonFunction = true;
    return wrapperButtonFunction;
}

let functionsCount = 0;

const buttomFunctions = files.keys().map(element => {
    let m = files(element).default,
        paths = element.split('/'),
        componentName = `${paths[paths.length - 2]}`;

    return { componentName, m }
}).reduce((result, { componentName, m }) => {
    if (_.isFunction(m)) {
        functionsCount += 1
        result.methods[componentName] = m;
    } else if (_.isPlainObject(m)) {
        functionsCount += _.keys(m.methods).length
        result.mixins.push(m);
    }

    return result;
}, {
    data() {
        return {
            _callPreEvent: []
        }
    },
    mixins: [
        FormOpenDailog, FormOpenTags, FormOpenNative, beforeActionsCheck
    ], methods: {
        opentComponent(btnVal) {
            const { openComponentType } = btnVal;
            console.log("打开。。。。", btnVal)
            switch (openComponentType) {
                case openWindowType.DAILOG:
                    return this.openInDailog(btnVal);
                case openWindowType.NATIVE:
                    console.log("原生打开。。。。", btnVal)
                    return this.openNative(btnVal);
                default:
                    return this.addTag(btnVal)

            }

        },
        /**
         * 如果是动态button 就必须包含tabItems属性，
         * @param {*} btnVal 
         * @param {*} $emitVM 
         * @param  {...any} args 
         */
        openAnyDynamicBtnFunction(item) {
            const { tabItems } = item;
            if (tabItems) {
                this.callPreCurrentTabVmEvent(item).then((val) => {
                    if (val !== false) {
                        this.opentComponent(item)
                    }
                })
            } else {
                console.log("没有buttom 功能不能识别", btnVal)
            }
        },

        /**
         * 在真正执行button功能之前检查当前tab容器是否有对应的方法要执行
         * @param {*} item 
         */
        callPreCurrentTabVmEvent(_item) {
            return this.beforeActionsCheck(_item).then((item) => {
                console.log("callPreCurrentTabVmEvent", item)
                let { bindFunction, target: $emitVM } = item;

                // console.log("按下button之前响应对应的", this.getTabsContainer($emitVM), item, $emitVM, this);
                let _vm = this.getTabsContainer($emitVM).currentVm();
                //console.log("按下button之前响应对应的0000", _vm, _vm[bindFunction]);
                if (_vm && _vm[bindFunction]) {
                    let result = _vm[bindFunction].apply(_vm, item);
                    if (result instanceof Promise) {
                        return result.then((preItem) => {
                            item.preItem = preItem;
                            return item;
                        })
                    } else if (result === false) {
                        return Promise.resolve(false);
                    } else {
                        item.preItem = result;
                        return Promise.resolve(item)
                    }

                }
                // console.log("按下button之前响应对应的11111", item);
                return Promise.resolve(item)
            })

        },



        onActionEvent(action, btn, target, ...args) {
            let contextEvent = this[action], btnVal = { ...btn, target, args };
            // console.log("开始执行:", action, contextEvent)
            //如果这个存在且本方法包装过先进行包装
            if (contextEvent && !contextEvent.IsWrapperButtonFunction) {
                //   console.log("包装未包装的方法:", action)
                contextEvent = this[action] = wrapperMethodFunction(contextEvent);
            } else if (!contextEvent) { // 方法不存在的时候,认为是动态方法
                //     console.log("没有定义的方法走动态button:", action)
                contextEvent = this.openAnyDynamicBtnFunction;
            }
            // console.log("开始执行方法", btnVal, contextEvent)
            return contextEvent.apply(this, [btnVal])

        },


    },
});

console.log(`总共有[${functionsCount}]表单方法要处理`)
export default buttomFunctions;