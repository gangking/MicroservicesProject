
import { getData } from '@/api/platform/desktop/column'
import ActionUtils from '@/utils/action'
/**
 * 创建组件
 */
export function buildComponent(name, column) {
  try {
    return {
      name: name,
      props: {
        params: {
          type: Object,
          default: function() {
            return {}
          }
        },
        height: {
          type: Number,
          default: column.height ? column.height : 300
        },
        visible: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          loading: true,
          title: `${column.name}`,
          alias: `${column.alias}`,
          attrs: this.getAttrs(),
          variables: {}, // 一些变量，比如分页信息
          data: null,

          bodyShow: true,
          show: false,
          showHeight: '',
          cardHeight: 100 + '%',
          activeName: 'innerMessage',

          formName: 'form',
          dialogFormVisible: false,
          formLabelWidth: '120px',
          form: {
            label: '',
            url: '',
            target: ''
          },
          rules: {
            label: [{ required: true, message: this.$t('validate.required') }],
            url: [{ required: true, message: this.$t('validate.required') }],
            target: [{ required: true, message: this.$t('validate.required') }]
          }
        }
      },
      created() {
        this.fetchData()
      },
      methods: {
        fetchData(params = {}) {
          this.loading = true
          this.showHeight = this.getHeight()
          getData(column, params).then(response => {
            this.data = response.data
            this.variables = response.variables
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        },
        getHeightNoUnit() {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) : 150
          } else {
            return 150
          }
        },
        getHeight() {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) + 'px' : '150px'
          } else {
            return 100 + '%'
          }
        },
        getDashboardHeight() {
          return this.height ? (this.height + 20) + 'px' : '150px'
        },
        getAttrs() {
          const item = JSON.parse(JSON.stringify(column))
          item.templateHtml = null
          return item
        },
        getFullCalendarConfig() {
          return {
            height: this.height ? this.height - 40 : 150,
            header: {
              left: 'title',
              center: '',
              right: 'prev,next,today,month,agendaWeek,agendaDay,listWeek'
            },
            selectable: true,
            selectHelper: true,
            editable: false,
            eventLimit: true, // 更多
            locale: this.$i18n.locale ? this.$i18n.locale.toLowerCase() : 'zh-cn'
          }
        },
        /**
         * 处理按钮事件
         * @param {*} command
         * @param {*} position
         * @param {*} data
         * @param {*} actions
         */
        handleActionEvent(command, position, data, actions) {
          switch (command) {
            case 'refresh':// 刷新
              this.fetchData()
              break
            case 'fullscreen':// 全屏
              this.handleFullscreen()
              break
            case 'more':// 更多
              this.handleMore()
              break
            case 'collapse': // 收缩
            case 'expansion': // 展开
              this.handleCollapseExpand(command, data, actions)
              break
            default:
              break
          }
        },
        emitActionEventHandler(command) {
          this.$emit('action-event', command, ...Array.from(arguments).slice(1))
        },
        // 处理全屏
        handleFullscreen() {
          this.emitActionEventHandler('fullscreen', {
            id: this.attrs.id
          })
        },
        /**
         * 处理更多
         */
        handleMore() {
          if (this.attrs.colUrl === '') {
            this.$message({
              message: '未设置更多路径的url',
              type: 'warning'
            })
            return
          }
          this.$router.push(this.attrs.colUrl)
        },
        handleClick(tab, event) {
          console.log(tab, event)
        },
        addBreadcrumb() {
          let i = this.data.length
          i++
          this.data.push({
            url: 'http://pactera.com/index.html',
            label: '地址' + i
          })
        },
        handleCollapseExpand(command, data, actions) {
          this.bodyShow = !this.bodyShow
          const index = actions.findIndex(action => action.key === data.key)
          actions[index].key = this.bodyShow ? 'collapse' : 'expansion'
          if (!this.visible) {
            this.emitActionEventHandler(command, {})
            return
          }
          this.showHeight = this.bodyShow ? this.getHeight() : 0
          this.$refs['toolbar'].callback(actions)
        },

        formValidate() {
          this.$nextTick(() => {
            this.$refs[this.formName].validate(() => {})
          })
        },
        getFormData() {
          // 固定模拟数据
          this.dialogFormVisible = true
          this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
          this.formValidate()
          this.fetchData()
        },
        close() {
          this.$refs[this.formName].resetFields()
          this.dialogFormVisible = false
        },
        confirm() {
          // 未有API接口 模拟数据不会因添加而变化！ TODO ！
          this.$refs[this.formName].validate(valid => {
            if (valid) {
              this.data.push(this.form)
              this.dialogFormVisible = false
            } else {
              ActionUtils.saveErrorMessage()
            }
          })
        }
      },
      template: `${column.templateHtml}`
    }
  } catch (error) {
    console.info(error)
  }
}
