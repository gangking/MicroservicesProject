
<template>
  <div class="addHeader">
    <div>
      <el-button type="primary" icon="ibps-icon-save" @click="handerSave">保存</el-button>
      <el-button icon="ibps-icon-add" @click="handerAdd()">添加栏目</el-button>
      <el-button type="danger" icon="ibps-icon-undo" @click="handerReset">重置</el-button>
      <!-- <el-button type="info" icon="ibps-icon-undo" @click="handerRestoreDefault()">还原默认</el-button> -->
      <el-button type="primary" icon="el-icon-plus" @click="addPage">新增一页</el-button>
      <el-button type="danger" icon="el-icon-minus" @click="removePage">减少一页</el-button>
    </div>
    <!-- <div>
      <desktop-layout
        :data="layout"
        :ectypal="ectypal"
        :empty-text="emptyText"
        :visible="addColumnVisible"
        @init="loadData"
        @close="visible => addColumnVisible =visible"
        @change="changeLayout"
      />
    </div>-->
    <add-column :visibleAdd.sync="dialogVisible" @confirm="handerAddConfirm" />
  </div>
</template>

<script>
import DesktopLayout from "./layout";
import AddColumn from "./add-column";
import { getMyLayout, save, remove } from "@/api/platform/desktop/myLayout";
export default {
  components: {
    DesktopLayout,
    AddColumn
  },
  data() {
    return {
      dialogVisible: false,
      emptyText:
        "未设置个人桌面布局，请添加栏目，否则则按默认布局设置您的首页。",
      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      layout: [],
      ectypal: [],

      defaultForm: {},
      desktopMyLayout: {
        id: "",
        sysAlias: "",
        templateHtml: ""
      }
    };
  },
  created() {},
  methods: {
    handerAddConfirm(data) {
      this.$emit("change", data);
    },

    handerAdd() {
      this.dialogVisible = true;
    },
    changeLayout(data) {
      this.layout = data;
    },

    addPage() {
      this.$emit("addPage");
    },
    removePage() {
      this.$emit("removePage");
    },
    handerSave() {
      this.$emit("save");
    },
    handerReset() {
      this.$emit("reset");
    },
    // handerRestoreDefault() {
    //   this.$message("还原默认");
    // }
  }
};
</script>


<style scoped lang="scss">
.addHeader{
  padding:0 10px;
  background:#fff;
}
</style>
