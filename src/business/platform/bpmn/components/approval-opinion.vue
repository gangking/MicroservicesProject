<template>
  <div>
    <div v-if="enableCommon">
      <template v-if="!disabled && commonStatments && commonStatments.length>0">
        <el-dropdown @command="handleCommonStatment">
          <span class="el-dropdown-link">
            常用语<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(common,i) in commonStatments"
              :key="i"
              :command="common"
            >{{ common.value }}</el-dropdown-item>
            <el-dropdown-item v-if="totalCount >5" command="more"><span class="el-dropdown-link">>>更多...</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <span v-else class="el-dropdown-link">
        常用语<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-tag
        v-for="(shortcut,i) in shortcutTags"
        :key="i"
        :type="shortcut.type"
        @click="handleShortcut(shortcut)"
      >{{ shortcut.label }}</el-tag>
    </div>
    <el-input ref="input" v-model="data" type="textarea" rows="4" :disabled="disabled" />
  </div>
</template>
<script>
import { queryPageList } from '@/api/platform/bpmn/bpmCommonStatment'
import { valueEquals } from 'element-ui/src/utils/util'
import emitter from 'element-ui/src/mixins/emitter'

export default {
    mixins: [emitter],
    props: {
        value: {
            type: String
        },
        action: {
            type: String
        },
        enableCommon: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    data() {
        return {
            shortcutTags: [{
                type: 'success',
                label: '同意'
            },
            {
                type: 'danger',
                label: '反对'
            },
            {
                type: 'warning',
                label: '拒绝'
            }],
            commonStatments: [],
            totalCount: 0
        }
    },
    computed: {
        data: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    watch: {
        value: {
            handler(val, oldVal) {
                if (!valueEquals(val, oldVal)) {
                    this.dispatch('ElFormItem', 'el.form.change', val)
                }
            },
            immediate: true
        },
        action: {
            handler(val, oldVal) {
                if (!valueEquals(val, oldVal)) {
                    if (this.enableCommon && !this.disabled) {
                        this.loadCommonStatment()
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        loadCommonStatment() {
            queryPageList({
                action: this.action
            }).then(response => {
                const data = response.data
                this.commonStatments = data.dataResult
                this.totalCount = data.totalCount
            })
        },
        handleShortcut({ label }) {
            // TODO: 后面写光标

            const v = this.getCursorPos(this.$refs.input.$el)
            console.info(v)

            this.data = this.data + label
        },
        handleCommonStatment(command) {
            if (this.disabled) {
                return
            }

            this.data = this.data + command.value
        },
        getCursorPos(pTextArea) {
            let cursurPosition = -1
            if (pTextArea.selectionStart) { // 非IE浏览器
                cursurPosition = pTextArea.selectionStart
            } else { // IE
                var range = document.selection.createRange()
                range.moveStart('character', -pTextArea.value.length)
                cursurPosition = range.text.length
            }
            return cursurPosition
        }
    }
}
</script>
<style lang="scss" scoped>
.el-tag{
   cursor: pointer;
   display: inline-block;
   margin: 0 5px;
}
</style>

