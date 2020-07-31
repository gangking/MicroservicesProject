<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    top="0"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="openPopForm"
      v-loading="dialogLoading"
      inline
      :element-loading-text="$t('common.loading')"
      :model="openPop"
      :rules="rules"
      :label-width="formLabelWidth"
      :label-position="labelPosition"
    >

      <el-row>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务对象:" prop="name">
            <div class="el-item-label">
              <el-select
                v-model="openPop.bosForm.code"
                :disabled="formId!==''"
                filterable
                placeholder="请选择"
                style="width:100%;"
                @change="getSelBoVal"
              >
                <el-option
                  v-for="(item,index) in boData"
                  :key="index"
                  :value="item.code"
                  :label="item.code"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务对象名称:" prop="name">
            <div class="el-item-label">
              <el-input v-if="!readonly" v-model="openPop.bosForm.name" :disabled="true" />
              <span v-else>{{ openPop.bosForm.name }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务场景:" prop="bsCode">
            <div class="el-item-label">
              <el-select
                v-model="openPop.ywcjform.bsCode"
                :disabled="formId!==''"
                placeholder="请选择"
                style="width:100%;"
                @change="getYwcjSel"
              >
                <el-option
                  v-for="(item,index) in selywcjData"
                  :key="index"
                  :label="item.bsCode"
                  :value="item.bsCode"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务场景描述:" prop="scDescribe">
            <div class="el-item-label">
              <el-input v-if="!readonly" v-model="openPop.ywcjform.scDescribe" :disabled="true" />
              <span v-else>{{ openPop.ywcjform.scDescribe }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="流程ID:" prop="defId">
            <div class="el-item-label">
              <el-select
                v-model="openPop.lcidForm.defId"
                :disabled="formId!==''"
                placeholder="请选择"
                style="width:100%;"
                @change="getYwlcSel"
              >
                <el-option
                  v-for="(item,index) in lcidData"
                  :key="index"
                  :label="item.defKey"
                  :value="item.defId"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务流程名称:" prop="name">
            <div class="el-item-label">
              <el-input v-if="!readonly" v-model="openPop.lcidForm.name" :disabled="true" />
              <span v-else>{{ openPop.lcidForm.name }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="业务场景应用ID" prop="zuheName">
            <div class="el-item-label">
              <el-input v-if="!readonly" v-model="openPop.zuheName" :disabled="true" />
              <span v-else>{{ openPop.zuheName }}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label-width="150px" label="业务场景应用描述" prop="yyDesc">
            <div class="el-item-label ">
              <el-input v-if="!readonly" v-model="openPop.yyDesc" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" col>
          <!-- <el-form-item class="col-wd" label="业务流程技术表单:" label-width="150px" prop="key">
            <div class="el-item-label wdjsbd">
              <el-select v-model="openPop.bojsForm.key" :disabled="formId!==''" placeholder="请选择" style="width:200px" @change="getFormDefSel">
                <el-option
                  v-for="(item,index) in lcjsData"
                  :key="index"
                  :value="item.key"
                  :label="item.name"
                />
              </el-select>
            </div>
          </el-form-item> -->
        </el-col>
        <el-col :span="12" col>
          <el-form-item class="col-wd" label="URL:" prop="appUrl">
            <div class="el-item-label">
              <el-input v-if="!readonly" v-model="openPop.arrForm.appUrl" :disabled="true" />
              <span v-else>{{ openPop.arrForm.appUrl }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { saveScene, queryFormByBoList, queryYWLCByIdList, queryYWCJList, queryBOList } from '@/api/platform/buscene'
import { typeOptions } from './constants'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        id: String,
        title: String
    },
    data() {
        return {
            formName: 'levelForm',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            typeOptions: typeOptions,
            labelPosition: 'left',
            defaultForm: {},
            boData: '',
            selywcjData: '',
            selywlcData: '',
            lcidData: '',
            lcjsData: '',
            boId: '',
            openPop: {
                yyDesc: '',
                zuheName: '',
                arrForm: {
                    appIcon: '',
                    appBgColor: '',
                    appUrl: ''
                },
                bosForm: {
                    id: '',
                    name: '',
                    bsKey: '',
                    desc: '',
                    code: '',
                    bsCode: ''
                },
                ywcjform: {
                    cjName: '',
                    bsKey: '',
                    bsCode: '',
                    scDescribe: ''
                },
                lcidForm: {
                    defId: '',
                    defKey: '',
                    desc: '',
                    name: ''

                },
                bojsForm: {
                    boCode: '',
                    defId: '',
                    key: '',
                    name: ''
                }
            },

            rules: {
                // bsCode: [{ required: true, message: '业务类型不能为空', trigger: 'change' }]
                // { required: true, message: '业务场景应用描述不能为空', trigger: 'blur' }
                yyDesc: [
                    { required: true, message: '业务场景应用描述不能为空', trigger: 'blur' }
                ]

            },
            toolbars: [
                { key: 'save' }, { key: 'cancel' }
            ]
        }
    },
    computed: {
        dataTemplate() {
            return this.data ? this.data : {}
        },
        formId() {
            return this.id
        }
    },
    watch: {
        visible: {
            handler: function(val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    created() {
        this.defaultForm = JSON.parse(JSON.stringify(this.openPop))
    },
    methods: {
        handleActionEvent({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        changeItem() {
            const info = this.boData.filter(item => {
                return item.code === this.openPop.bosForm.code
            })
            console.log('changeitem', this.boData, this.openPop.bosForm)
            console.log('changeitem', info)
            this.fetchYWCJList(info[0].code)
            this.fetchYWLCList(info[0].code)
            // this.fetchFormDefList(info[0].code)
            // debugger
        },
        /**
     * 获取业务对象
     */
        fetchBOList() {
            this.loading = true
            const params = { 'parameters': [{ 'key': 'Q^TYPE_ID_^S', 'value': '' }], 'requestPage': { 'pageNo': 1, 'limit': 1000, 'totalCount': null }, 'sorts': [] }
            queryBOList(params).then(res => {
                this.boData = res.data.dataResult
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // 对业务对象数据处理给option
        getSelBoVal(val) {
            let selVal = []
            console.log('val', val)
            this.boData.forEach(i => {
                if (i.code == val) {
                    selVal = i
                    console.log('selVal9999---', selVal)
                    this.openPop.bosForm.bsCode = selVal.code
                    this.openPop.bosForm.name = selVal.name
                }
            })
            this.changeItem()
        },
        /**
     * 业务场景
     */
        fetchYWCJList(val) {
            this.loading = true
            const params = {
                topBo: val
            }
            queryYWCJList(params).then(res => {
                this.loading = false
                this.selywcjData = res.data
            }).catch(() => {
                this.loading = false
            })
        },
        getYwcjSel(val) {
            let selVal = []
            // console.log('val00----' + val)
            // debugger  业务场景.bscode+流程ID.defKey
            // 拼接场景应用ID组合name
            this.openPop.ywcjform.cjName = val
            console.log('val00----' + val)
            this.selywcjData.forEach(i => {
                if (i.bsCode == val) {
                    selVal = i
                    console.log('selVal---', selVal)

                    this.openPop.ywcjform.bsKey = selVal.bsKey // 业务场景bsKey
                    this.openPop.ywcjform.bsCode = selVal.bsCode //  业务场景编码
                    this.openPop.ywcjform.scDescribe = selVal.scDescribe
                }
            })
        },
        /**
         * 业务流程ID
         */
        fetchYWLCList(val) {
            this.loading = true
            const params = {
                boCode: val
            }
            queryYWLCByIdList(params).then(res => {
                this.loading = false
                this.lcidData = res.data
                // console.log('rrrr--' + JSON.stringify(res))
            }).catch(() => {
                this.loading = false
            })
        },
        getYwlcSel(val) {
            let selVal = []
            // 拼接场景应用ID组合name defKey
            this.openPop.zuheName = this.openPop.ywcjform.cjName + '_' + val
            // this.openPop.arrForm.appUrl = 'startapp?appId=' + this.openPop.zuheName
            this.openPop.arrForm.appUrl = 'dynamicURL:/#/startapp?appId=' + this.openPop.zuheName + '&status=submitterProcess'

            this.lcidData.forEach(i => {
                if (i.defId == val) {
                    selVal = i

                    this.openPop.lcidForm.defId = selVal.defId
                    this.openPop.lcidForm.defKey = selVal.defKey
                    // this.openPop.lcidForm.desc = selVal.desc
                    this.openPop.lcidForm.name = selVal.name
                }
            })
        },
        /**
     * 业务流程技术表单定义
     */
        fetchFormDefList() {
            this.loading = true
            const params = {
                boCode: 'taxpaymentformhead'
            }
            queryFormByBoList(params).then(res => {
                this.loading = false
                // console.log('res--' + JSON.stringify(res))
                this.lcjsData = res.data
            }).catch(() => {
                this.loading = false
            })
        },
        // getFormDefSel(val) {
        //     let selVal = []
        //     this.lcjsData.forEach(i => {
        //         if (i.key == val) {
        //             selVal = i
        //             console.log('selVal', selVal)
        //             this.openPop.bojsForm.key = selVal.key
        //         }
        //     })
        // },

        // 保存数据
        handleSave() {
            this.loading = true
            this.$refs['openPopForm'].validate((valid) => {
                if (valid) {
                    const params = {
                        id: '',
                        boKey: this.openPop.bosForm.bsCode,
                        boDescribe: this.openPop.bosForm.name,
                        bsKey: this.openPop.ywcjform.bsKey, // 业务场景bsKey
                        bsCode: this.openPop.ywcjform.bsCode, //  业务场景编码
                        bsDescribe: this.openPop.ywcjform.scDescribe,
                        defId: this.openPop.lcidForm.defId, // 流程id
                        bpmKey: this.openPop.lcidForm.defKey, // 流程id定义的defKey
                        bpmDescribe: this.openPop.lcidForm.name, // 流程id 描述
                        key: this.openPop.zuheName, // 业务场景应用ID
                        describe: this.openPop.yyDesc,
                        // formKey: this.openPop.bojsForm.key, // 业务流程技术表单
                        formKey: '',
                        appIcon: '',
                        appBgColor: '',
                        appUrl: this.openPop.arrForm.appUrl,
                        status: '' // 新增为空
                    }
                    saveScene(params).then(res => {
                        this.loading = false
                        if (res.state == '200') {
                            this.$message({
                                message: '保存成功 !',
                                type: 'success'
                            })
                            this.$parent.loadData() // 执行父组件刷新列表方法
                            this.$emit('close', false)
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    console.log('error !!')
                    return false
                }
            })
        },
        // 关闭当前窗口
        closeDialog() {
            this.openPop.bosForm.name = ''
            this.openPop.bosForm.code = ''
            this.openPop.ywcjform.bsCode = ''
            this.openPop.ywcjform.scDescribe = ''
            this.openPop.lcidForm.defId = ''
            this.openPop.lcidForm.name = ''
            this.openPop.zuheName = ''
            this.openPop.yyDesc = ''
            this.openPop.bojsForm.key = ''
            this.openPop.arrForm.appUrl = ''
            this.$emit('close', false)
        },

        /**
         * 获取表单数据
         */
        getFormData() {
            this.fetchBOList()
            // this.fetchYWCJList()
            // this.fetchYWLCList()
            // this.fetchFormDefList()
        }

    }

}
</script>
<style lang="scss" scoped>
.el-item-label{
  width: 200px;

}
.wdjsbd{
  width:215px;
}
.col-wd{
   text-align: left;
}
//  .col-item-hd  {
//   /deep/ .el-button--small{
//       width:200px;
//   }
// }
 /* .el-form-item__label /deep/ {
  width: 300px;
} */
</style>
