<template>
  <div id="main" class="main">
    <div class="ibps-toolbar">
      <div class="header">
        <div class="haeder-title">[预览] &nbsp;&nbsp;{{ dataTemplate.name }}</div>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="header-button">
        <el-form ref="ruleForm" :rules="rules" :inline="true" :model="nameObj" label-width="100px">
          <el-form-item
            v-for="(val,key,index) in nameObj"
            :key="index"
            :label="getLabel(key)"
            :prop="key"
          >
            <el-input v-model="nameObj[key]" />
          </el-form-item>

          <!-- <el-form-item label="名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input></el-input>
          </el-form-item>-->
        </el-form>
      </div>
    </div>

    <div class="source-body">
      <!-- <div class="padding">
        <pre>{{dataTemplate}}</pre>
      </div> -->
      <div class="padding">
        <pre>{{ resust }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import {
    queryRemoteData,
    getRemoteParameter
} from '@/api/platform/data/dataset'
import { queryDataTable } from '@/api/platform/data/dataTemplate'
export default {
    components: {},
    props: {
        dataTemplate: Object,
        template: Object,
        value: [String, Number, Array, Object],
        multiple: Boolean,
        fields: Object
    },
    data() {
        return {
            nameObj: {}, // 表单对象
            rules: {}, // 表单规则对象
            mappingObj: {}, // 表单
            resust: '', // 返回数据
            parameters: {
                parameters: [{ key: 'response_data', value: '' }],
                requestPage: { pageNo: 1, limit: 20, totalCount: null },
                sorts: [],
                dataTemplateId: ''
            }
        }
    },
    computed: {},
    watch: {
        template: {
            handler(val, oldVal) {
                val.query_columns.forEach(item => {
                    this.$set(this.nameObj, item.name, '')
                    // this.$set(this.rules, element.tabName, this.rulesArr);
                    this.$set(this.mappingObj, item.name, item.label)
                })
            },
            immediate: true
        },
        'dataTemplate.id': {
            handler(val, oldVal) {
                this.loadParameter()
            },
            immediate: true
        }
    },
    created() {
    // this.loadParameter();
    },
    mounted() {},
    methods: {
        search() {
            this.parameters.parameters.forEach((item, index) => {
                console.log(this.parameters.parameters)
                for (const key in this.nameObj) {
                    const element = this.nameObj[key]
                    if (item.key == `Q^${key}^SL`) {
                        this.$set(this.parameters.parameters[index], 'value', element)
                    }
                }
            })

            queryDataTable(this.parameters)
                .then(response => {
                    //  console.log("count", this.count);
                    this.resust = response.data.dataResult
                    // console.log("response.data.dataResult", response.data.dataResult);
                })
                .catch(() => {})
        },
        getLabel(key) {
            for (const mapp in this.mappingObj) {
                if (this.mappingObj.hasOwnProperty(mapp)) {
                    if (mapp == key) {
                        return this.mappingObj[mapp]
                    }
                }
            }
        },
        /* 根据值来源选择id  获取参数 */
        loadParameter() {
            if (!this.dataTemplate.id) return
            this.$set(this.parameters, 'dataTemplateId', this.dataTemplate.id)
            console.log('this.parameters', this.parameters)
            getRemoteParameter({ dataTemplateId: this.dataTemplate.id }).then(
                response => {
                    this.parameters.parameters[0]['value'] = JSON.stringify(
                        response.data
                    )
                    // key: "Q^pernr^SL", value: ""
                    for (const key in this.nameObj) {
                        const element = this.nameObj[key]
                        this.parameters.parameters.push({
                            key: `Q^${key}^SL`,
                            value: element
                        })
                    }
                    console.log('this.parameters.parameters', this.parameters.parameters)
                    this.search()
                    //   if (this.model.data_condition.length > 0) {
                    //     let parame = this.getParameters(this.model.data_condition);
                    //     // console.log(parame);
                    //     if (parame.length > 0) {
                    //       parame.forEach((i, index) => {
                    //         this.parameters.parameters.push({
                    //           key: "Q^" + i.name + "^SL",
                    //           value: i.value
                    //         });
                    //       });
                    //     }
                    //   } else {
                    //     this.parameters.parameters.push({
                    //       key: "Q^" + this.model.remote_name + "^SL",
                    //       value: ""
                    //     });
                    //   }

                    console.log('this.parameters', this.parameters)
                }
            )
        }
    }
}
</script>
<style lang="scss" >
.data-template-renderer-dialog .el-dialog__body {
  height: 100%;
  overflow: hidden;
}
</style>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .ibps-toolbar {
    height: 68px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    .header {
      background-color: #f5f5f7;
      border: 1px solid #ebeef5;
      line-height: 45px;
      font-size: 18px;
      .haeder-title {
        display: inline-block;
        margin: 0 5px;
      }
    }
    .header-button {
      line-height: 30px;
    }
  }
  .source-body {
    width: 100%;
    height: calc(100% - 100px);
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 9999;
    display: block;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: auto;
    .padding {
      padding: 15px;
    }
  }
}

/deep/ .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
  margin-top: 3px;
}
</style>
