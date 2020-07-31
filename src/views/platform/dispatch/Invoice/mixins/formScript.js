import JForm from '@/business/platform/form/utils/JForm'// 自定义脚本
import util from '@/utils/util'
let watchArray = []
const JFormMixins = () => {
    return {
        methods: {
            reloadScript() {
                JForm.cleanEvents()
                this.unWatch()
                if (!util.isEmpty(this.script)) {
                    this.$nextTick(() => {
                        this.loadScript()
                        this.initScriptJFormOnLoad()
                    })
                }
            },
            initScriptJFormOnLoad() {
                JForm.onLoad && JForm.onLoad(this, this)
            },

            unWatch() {
                watchArray.forEach((v, i) => {
                    if (v) {
                        v()
                    }
                })
                watchArray = []
            },
            loadScript() {
                return (new Function(this.script))()
            },

            onFormDataChange(field, method) {
                watchArray.push(this.$watch(`models.${field}`, (nval) => {
                    console.log('onformDataChange:', nval)
                    this.$emit('value-change-method', field, nval, method)
                }))
            }
        }
    }
}

export {
    JFormMixins
}
