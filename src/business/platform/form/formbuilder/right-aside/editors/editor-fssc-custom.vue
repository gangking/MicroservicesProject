<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('selector_type')">
        <template slot="label">
          对话框
          <help-tip prop="customDialog" />
        </template>
        <el-select
          v-model="fieldOptions.search_url"
          style="width:100%;"
          @change="changeSelectorType"
        >
          <el-option
            v-for="(option,index) in remoteOptions"
            :label="option.label"
            :value="option.value"
            :key="index"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item>
        <template slot="label">
          自动联动
          <help-tip prop="isAuto" />
        </template>

        <el-switch v-model="fieldOptions.isAuto"></el-switch>
      </el-form-item>-->

      <el-form-item>
        <template slot="label">
          查询字段
          <help-tip prop="remoteCondition" />
        </template>

        <el-button
          style="width:100%;"
          type="primary"
          size="mini"
          @click="settingLinkCondition"
        >查询字段关联</el-button>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          返回字段
          <help-tip prop="remoteLinkage" />
        </template>

        <el-button style="width:100%;" type="primary" size="mini" @click="settingLinkConfig">返回字段关联</el-button>
      </el-form-item>

      <el-form-item>
        <template slot="label">
          清空字段
          <help-tip prop="clearFields" />
        </template>
        <el-select v-model="fieldOptions.clearFields" multiple placeholder="请选择">
          <el-option
            v-for="(item,index) in bingFrom"
            :key="item.name"
            :label="item.label"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </div>
    <fssc-custom-link-dialog
      :dataSource="dataSource"
      :bingFrom="bingFrom"
      :remoteDialog="linkDialog"
      @close="(visible)=> linkDialog = visible"
    />
    <fssc-condition-dialog
      :dataSource="dataCondition"
      :bingFrom="bingFrom"
      :remoteDialog="conditionDialog"
      @close="(visible)=> conditionDialog = visible"
    />
  </div>
</template>
<script>
import { getRemoteSearch, queryRemoteData } from "@/api/platform/data/dataset"; //获取值来源数据api
import fsscCustomLinkDialog from "../components/fssc-custom-link-dialog"; // 联动数据弹窗
import fsscConditionDialog from "../components/fssc-custom-condition-dialog"; // 联动数据弹窗
import EditorMixin from "../mixins/editor"; // 混入 代码如下
/* 
export default {
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    types: {
      type: String
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    }
  }
}
 */

export default {
  mixins: [EditorMixin],
  props: {
    types: {
      type: String,
      default: "selector_type,multiple,store"
    },
    formData: {
      type: Object
    }
  },
  components: {
    fsscCustomLinkDialog,
    fsscConditionDialog
  },
  data() {
    return {
      linkDialog: false,
      conditionDialog: false,
      remoteOptions: [], //值来源搜索
      dataSource: [], //值来源联动数据
      dataCondition: [], //值来源条件数据
      bingFrom: []
    };
  },
  watch: {
    fieldItem: {
      handler(val) {
        this.getDataChain();
        // this.dataSource = this.fieldItem.field_options.data_chain;
        // this.dataCondition = this.fieldItem.field_options.data_condition;
      },
      immediate: true
    },
    /* 中间表单全部数据 */
    formData: {
      handler(val) {
        console.log(val);
        this.bingFrom = [];
        // 栅格数据处理
        val.fields.forEach(item => {
          if (item.field_type == "grid") {
            //  console.log(9999, item.field_options.columns);
            let isGrid = item.field_options.columns;
            isGrid.forEach(list => {
              if (list.fields.length > 0) {
                if (
                  list.fields[0].field_type != "desc" &&
                  list.fields[0].field_type != "label"
                ) {
                  this.bingFrom.push({
                    name: list.fields[0].name,
                    label: list.fields[0].label
                  });
                }
              }
            });
          } else {
            if (item.field_type != "desc" && item.field_type != "label") {
              this.bingFrom.push({
                name: item.name,
                label: item.label
              });
            }
          }
        });
        console.log("绑定的bingdFrom", this.bingFrom);
      },
      immediate: true,
      deep: true
    },
    dataSource: {
      handler(val) {
        this.fieldOptions.data_chain = val;
        this.fieldOptions.data_chain.forEach(item => {
          if (item.select == this.fieldItem.name) {
            this.fieldOptions.remote_name = item.name;
          }
        });
      },
      deep: true
      // immediate: true
    },
    dataCondition: {
      handler(val) {
        this.fieldOptions.data_condition = val;
        console.log(val);
      },
      deep: true
    }
  },
  mounted() {
    this.loadRemoteSource();
    // this.dataSource = this.fieldItem.field_options.data_chain;
    // if (this.fieldItem.field_options.data_condition) {
    //   this.dataCondition = this.fieldItem.field_options.data_condition;
    // }
  },
  methods: {
    // 子集Key数据获取
    loadRemoteSource() {
      getRemoteSearch({
        parameters: [{ key: "Q^TYPE_^S", value: "dialog" }],
        requestPage: { pageNo: 1, limit: 1000, totalCount: null },
        sorts: []
      })
        .then(response => {
          const data = response.data.dataResult;
          /* 获取下拉框的选项  */
          this.remoteOptions = data.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
          if (this.fieldItem.field_options.search_url) {
            console.log(this.fieldItem.field_options.search_url);
            this.getDataChain();
          }
        })
        .catch(() => {});
    },
    /* 打开联动数据dialog */
    settingLinkConfig() {
      if (!this.fieldItem.field_options.search_url) {
        this.$message({
          message: "请选择值来源数据",
          type: "warning"
        });
        return;
      }
      this.linkDialog = true;
    },
    /* 打开关联条件dialog */
    settingLinkCondition() {
      if (!this.fieldItem.field_options.search_url) {
        this.$message({
          message: "请选择值来源数据",
          type: "warning"
        });
        return;
      }
      this.conditionDialog = true;
    },
    /* 选择的远程数据 */
    changeSelectorType(val) {
      // console.log(this.fieldItem);
      this.dataSource = [];
      this.dataCondition = [];
      this.getDataChain();
    },
    /* 获取联动数据 */
    getDataChain() {
      queryRemoteData({ dataTemplateId: this.fieldOptions.search_url }).then(
        response => {
          this.dataSource = [];
          this.dataCondition = [];
          if (response.data[0].displayColumns) {
            let resultColumns = JSON.parse(response.data[0].displayColumns);
            let copyColumns = JSON.parse(response.data[0].displayColumns);

            if (resultColumns.length > 0) {
              for (let list of resultColumns) {
                for (let item of this.fieldItem.field_options.data_chain) {
                  if (list.name == item.name) {
                    this.dataSource.push(item);
                    let index = copyColumns.findIndex(a => {
                      return a.name == item.name;
                    });
                    if (index != -1) copyColumns.splice(index, 1);
                  }
                }
              }
              if (copyColumns.length > 0) {
                copyColumns.forEach(item => {
                  item["select"] = "";
                  item["status"] = false;
                  item["update"] = false;
                  this.dataSource.push(item);
                });
              }
            }
          }

          //查询字段
          if (response.data[0].queryColumns) {
            let resultCondition = JSON.parse(response.data[0].queryColumns);
            let copyCondition = JSON.parse(response.data[0].queryColumns);
            if (resultCondition.length > 0) {
              for (let list1 of resultCondition) {
                for (let item1 of this.fieldItem.field_options
                  .data_condition) {
                  if (list1.name == item1.name) {
                    this.dataCondition.push(item1);
                    let index = copyCondition.findIndex(a => {
                      return a.name == item1.name;
                    });
                    if (index != -1) copyCondition.splice(index, 1);
                  }
                }
              }
              if (copyCondition.length > 0) {
                copyCondition.forEach(item => {
                  item["select"] = "";
                  item["fix_value"] = "";
                  item["required"] = false;
                  this.dataCondition.push(item);
                });
              }
            }
          }
        }
      );
    }
  }
};
</script>

