<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="添加栏目"
    append-to-body
    @open="loadData()"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="模块名称:" prop="id">
        <el-select
          v-model="form.id"
          filterable
          placeholder="请输入栏目名称"
          @change="selectChange"
          style="width:100%;"
        >
          <el-option
            v-for="(item,index) in columnList"
            :key="item.alias+index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="高度:" prop="height">
        <el-input-number v-model="form.height" :min="1" :max="100" :step="5" placeholder="请输入高度" />
      </el-form-item>

      <el-form-item label="宽度:" prop="width">
        <el-input-number v-model="form.width" :min="1" :max="24" :step="2" placeholder="请输入宽度" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
  </el-dialog>
</template>
<script>
import { findHashRightsColumn } from "@/api/platform/desktop/multiColumn";
import uuid from "uuid";

export default {
  props: {
    visibleAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formLabelWidth: "120px",
      formName: "form",
      form: {
        parameters: "",
        id: "",
        alias: "",
        height: 10,
        width: 12
      },
      rules: {
        id: [{ required: true, message: this.$t("validate.required") }],
        height: [{ required: true, message: this.$t("validate.required") }],
        width: [{ required: true, message: this.$t("validate.required") }]
      },
      columnList: [],
      pagination: {
        page: 1,
        limit: 100
      },
      toolbars: [{ key: "confirm" }, { key: "cancel" }]
    };
  },
  watch: {
    visibleAdd: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visibleAdd;
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case "confirm":
          this.handerConfirm();
          break;
        case "cancel":
          this.closeDialog();
          break;
        default:
          break;
      }
    },

    selectChange(id) {
      let findObject = this.columnList.find(item => {
        return item.id == id;
      });
      this.form.parameters = findObject["parameters"];
      this.form.alias = findObject["alias"];
    },
    loadData() {
      /* 原有的接口加载 */
      findHashRightsColumn()
        .then(response => {
        //  console.log(response, "信息表格7777");

          this.columnList = response.data;
        })
        .catch(() => {});

      // this.columnList = [
      //   { alias: "desktop_notes", name: "工作台" },
      //   { alias: "bill", name: "单据办理" },
      //   { alias: "financial", name: "我的金额" },
      //   { alias: "mycard", name: "名片" },
      //   { alias: "notice", name: "通知公告" },
      //   { alias: "servey", name: "单据满意度调查" },
      //   { alias: "trainingCenter", name: "培训中心" },
      //   { alias: "carousel", name: "新闻" }
      // ];
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit("update:visibleAdd", false);
    },
    handerConfirm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          const item = {
            x: 0,
            y: 0,
            w: this.form.width,
            h: this.form.height,
            i: uuid() + "",
            alias: this.form.alias,
            parameters: this.form.parameters
          };
          this.$emit("confirm", item);
          this.closeDialog();
        } else {
          this.$message({
            message: "请选择栏目",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

