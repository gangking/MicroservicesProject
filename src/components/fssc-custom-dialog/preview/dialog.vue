
<template>
  <div>
    <el-dialog
      title="选择数据"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      modal-append-to-body
      width="80%"
      top="6vh"
      append-to-body
      center
      v-dialogDrag
      @open="openDialog"
    >
      <!-- 主体 -->
      <div class="main-container">
        <ibps-crud
          ref="crud"
          :data="listData"
          :toolbars="listConfig.toolbars"
          :search-form="listConfig.searchForm"
          :pk-key="pkKey"
          :columns="listConfig.columns"
          :pagination="pagination"
          :loading="loading"
          tableColumnWidth="130px"
          :showOverflowTooltip="show"
          @selection-change="selectionChange"
          @select-all="selectAll"
          @select="select"
          @action-event="handleAction"
          @sort-change="handleSortChange"
          @pagination-change="handlePaginationChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleDetermine">确 定</el-button>
      </span>
    </el-dialog>

    <balance-dialog :visible.sync="balanceVisible" :balanceObj="balanceObj" />
  </div>
</template>
<script>
import {
  queryPageList,
  remove,
  changeStatus
} from "@/api/platform/data_authority/object_definition";
import ActionUtils from "@/utils/action";
import FixHeight from "@/mixins/height";
import Search from "./search";
import balanceDialog from "@/views/platform/account_balance/dialog/index";

import { mapMutations } from "vuex";
import {
  queryRemoteData,
  getRemoteParameter
} from "@/api/platform/data/dataset";
import { queryDataTable, getFormKey } from "@/api/platform/data/dataTemplate";
export default {
  data() {
    return {
      show: true,
      balanceVisible: false, //记账余额的dialog
      balanceObj: {}, //dialog传入的值
      formKey: "", //表单的key
      selection: [],
      centerDialogVisible: false,
      chianRequired: [], //必填关联表单的字段
      isParameter: false,
      formField: "", // 远程搜索 关联的表单字段名
      formFieldValue: "", // 表单的值
      requiredText: "", // 必填字段
      placeholder: "请输入关键词", // 输入关键词
      isRead: false, // 是否只读
      allOptions: [], // 第一次搜索的全部数据
      count: 0, // 计数
      options: [],
      // value: [],
      selectData: "",
      listData: [],
      loading: false,
      parameters: {
        parameters: [{ key: "dataTemplateId", value: "" }],
        requestPage: { pageNo: 1, limit: 20, totalCount: null },
        sorts: []
      },
      condition: [], // 关联的查询条件

      pkKey: "id", // 主键  如果主键不是pk需要传主键
      title: "",
      loading: true,
      height: 400,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: "search"
          },
          // { key: "transfer", label: "转到" }
        ],
        searchForm: {
          forms: [
            // { prop: "Q^AUCODE_^SL", label: "编码" },
            // {
            //   prop: "Q^AU_NAME^SL",
            //   label: "描述"
            // }
          ]
        },
        // 表格字段配置
        columns: [
          // { prop: "aucode", label: "权限对象编码" },
          // { prop: "auname", label: "权限对象描述" },
          // { prop: "table", label: "权限表" },
          // { prop: "auFields", label: "权限字段" },
          // { prop: "auFieldsDescribe", label: "权限字段描述" },
          // { prop: "statusFields", label: "权限对象状态", sortable: "custom" }
        ]
      }
    };
  },
  components: {
    balanceDialog
  },
  created() {
    this.loadParameter();
    // this.loadData();
  },
  provide() {
    return {
      formData: () => this.remote,
      searchFile: () => this.model.data_condition
    };
  },
  // computed: {
  //   fileCondition() {
  //     return this.model.data_condition.map(item => {
  //       return item.name;
  //     });
  //   }
  // },
  mixins: [FixHeight, Search],
  props: {
    visibleCustom: {
      type: Boolean,
      default: false
    },
    remote: Object,
    isDisabled: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number, Array, Object],
      default: ""
    },
    model: {
      type: Object,
      default: () => {}
    },
    fieldOptions: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visibleCustom: {
      handler: function(val, oldVal) {
        this.centerDialogVisible = val;
      },
      immediate: true
    },
    centerDialogVisible: {
      handler(n, o) {
        if (!n) {
          this.closeDialog();
        }
      }
    },

    remote: {
      handler(obj, oldVal) {
        // console.log(obj, "表单所有数据更新");
        if (this.model) {
          setTimeout(() => {}, 10);
        }
      },
      immediate: true,
      deep: true
    },
    value: {
      handler(val, oldVal) {
        // console.log("选择框值发生变化", val);
        this.selectData = val;
      },
      immediate: true
    },
    fieldOptions: {
      handler(val, oldVal) {
        // console.log("fieldOptions", val);
      },
      immediate: true
    },
    model: {
      handler(val, oldVal) {
        if (val) {
          //this.$set(this.parameters, "dataTemplateId", val.search_url); //changed by dingdx 2020-04-11
          this.parameters.parameters[0].value = val.search_url;
        }
      },
      immediate: true
    },
    readonly: {
      handler(val, oldVal) {
        this.isRead = val;
        if (val) {
          this.placeholder = "";
        }
      },
      immediate: true
    },
    isParameter: {
      handler(val, oldVal) {
        if (val) {
          // console.log("参数加载完成");
        }
      }
    },
    formKey: {
      handler(val, oldVal) {
        // if (val != "OPTION_VIEW_CM01" || val != "OPTION_VIEW_CM01") {
        //   this.listConfig.toolbars.splice(1, 1);
        // }
      },
      immediate: true
    }
  },
  methods: {
    openDialog() {
      if (this.$refs.crud) {
        this.selection = [];
        this.$refs.crud.$refs.elTable.clearSelection();
      }
      setTimeout(() => {
        this.search();
      }, 30);
    },
    closeDialog() {
      this.$emit("close", false);
    },
    handleDetermine() {
      if (this.selection.length != 1) {
        this.$message({
          message: "请选择一条数据",
          type: "warning"
        });
        return;
      }
      const chain = this.exchangeChain();
      const currentObj = this.selection[0];

      const newObj = {};
      for (const a in chain) {
        for (const key in currentObj) {
          const element = currentObj[key];
          if (key == a) {
            newObj[chain[a]] = element;
            break;
          } else {
            newObj[chain[a]] = "";
          }
        }
      }

      //  console.log(newObj, "发送的值999");
      //清除表单不需要的值
      // this.clearDefault();
      let clearObj = this.clearDefault();
      for (const list in clearObj) {
        const element = clearObj[list];
        newObj[list] = element;
      }

      //this.$emit("input", val);
      //  console.log(newObj, "下拉联动的值");
      this.chainForm(newObj);

      this.closeDialog();
    },
    selectionChange(selection, row) {
      this.selection = selection;
    },
    select(selection, row) {
      // console.log(this.selection, "this.selection单选");
      //this.selection = selection;
    },
    selectAll(selection) {
      console.log(this.selection, "this.selection全选");
      this.selection = selection;
    },
    // // 加载数据
    // loadData() {
    //   this.loading = true;
    //   queryPageList(this.getSearcFormData())
    //     .then(response => {
    //       console.log(response);
    //       ActionUtils.handleListData(this, response.data);
    //       this.loading = false;
    //     })
    //     .catch(() => {
    //       this.loading = false;
    //     });
    // },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams(
        this.$refs["crud"] ? this.$refs["crud"].getSearcFormData() : {},
        this.pagination,
        this.sorts
      );
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts);
      ActionUtils.setPagination(this.pagination, page);
      this.loadCustom();
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort);
      ActionUtils.setPagination(this.pagination);
      this.loadCustom();
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination);
      ActionUtils.setSorts(this.sorts);
      this.loadCustom();
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case "search": // 查询
          this.search();
          break;
        case "transfer": // 查询
          console.log(this.selection[0], "选择的数据");

          if (this.selection.length != 1) {
            this.$message({
              message: "请选择一条数据",
              type: "warning"
            });
            return;
          }
          this.balanceObj = {
            eftyp: "合同",
            efval: this.selection[0].CONTRACTNO,
            componet: "special"
          };
          this.balanceVisible = true;
          this.balanceObj = {
            eftyp: "合同",
            efval: this.selection[0].CONTRACTNO,
            componet: "special"
          };
          if (this.formKey == "OPTION_VIEW_CM01") {
            this.balanceVisible = true;
            this.balanceObj = {
              eftyp: "合同",
              efval: this.selection[0].CONTRACTNO,
              componet: "special"
            };
          } else if (
            this.formKey == "OPTION_VIEW_AM01" ||
            this.formKey == "OPTION_VIEW_AM03"
          ) {
            this.balanceVisible = true;
            this.balanceObj = {
              refnr: this.selection[0].doc_number,
              refit: this.selection[0].id_,
              componet: "prepose"
            };
          }

          break;
        default:
          break;
      }
    },

    loadCustom() {
      let param = this.getSearcFormData();

      //this.$set(param, "dataTemplateId", this.model.search_url); //changed by dingdx 2020-04-11
      param.parameters.push({
        key: "dataTemplateId",
        value: this.model.search_url
      });

      // console.log(param, "param888888");
      queryDataTable(param)
        .then(response => {
          //  console.log("count", this.count);
          //  console.log("response.data.dataResult", response);
          this.listData = response.data.dataResult;
          ActionUtils.handleListData(this, response.data);
          this.loading = false;
        })
        .catch(() => {});
    },
    //获取表单的formkey
    getKey() {
      getFormKey({ dataTemplateId: this.model.search_url }).then(response => {
        this.formKey = response.data.key;

        //  console.log(this.formKey, "formKey99999999999");
      });
    },
    clearDefault() {
      // console.log(this.chianRequired, "this.chianRequired");
      if (!this.model.clearFields) return;
      if (this.model.clearFields.length == 0) return;

      let clearObj = {};
      this.model.clearFields.forEach(item => {
        console.log(item, "需要清空的值");
        clearObj[item] = "";
      });

      return clearObj;
    },
    ...mapMutations("ibps/form", ["chainForm"])
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.custom-dialog {
  z-index: 9999;
}
/deep/ .el-dialog--center .el-dialog__body {
  padding: 3px;
}
/deep/ .el-table,
.el-table--fit {
  min-height: 400px;
  max-height: 600px;
}
/deep/ .ibps-crud-search-form .el-form-item__label {
  width: 100px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>