<template>
  <div>
    <ibps-card-list
      ref="crud"
      :title="title"
      :height="height"
      :data="listData"
      :pagination="pagination"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :loading="loading"
      :create-text="createText"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="east">
        <ibps-type-tree
          :width="width"
          :height="treeHeight"
          :category-key="categoryKey"
          title="数据模版分类"
          position="east"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        />
      </template>
      <template slot="item-symbol" slot-scope="scope">
        <i :key="scope.id" :class="'ibps-icon-table'" class="symbol-icon" />
      </template>
    </ibps-card-list>
    <!-- 导入数据 -->
    <import-data
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 复制数据模版 -->
    <copy
      :id="editId"
      :visible="copyDialogFormVisible"
      @close="visible => copyDialogFormVisible = visible"
    />
    <!--创建数据模版-->
    <create
      :title="createText"
      :type-id="typeId"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <template-builder
      :id="editId"
      :visible="templatebuilderDialogVisible"
      @callback="search"
      @close="visible => templatebuilderDialogVisible = visible"
    />

    <template-render-preview
      :data-template-key="dataTemplateKey"
      :visible="templaterenderDialogVisible"
      @callback="search"
      @close="visible => templaterenderDialogVisible = visible"
    />
  </div>
</template>
<script>
import {
  queryPageList,
  remove,
  exportFile
} from "@/api/platform/data/dataTemplate";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import FixHeight from "@/mixins/height";
import IbpsCardList from "@/components/ibps-card-list";
import IbpsTypeTree from "@/business/platform/cat/type/tree";
import Create from "./create";
import TemplateBuilder from "@/business/platform/data/templatebuilder/dialog";
import TemplateRenderPreview from "@/business/platform/data/templaterender/preview";
import ImportData from "./import";
import Copy from "./copy";

export default {
  components: {
    IbpsTypeTree,
    IbpsCardList,
    Create,
    Copy,
    ImportData,
    TemplateBuilder,
    TemplateRenderPreview
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: 500,
      title: "数据模版管理",
      createText: "创建数据模版",
      categoryKey: "DATA_TEMPLATE_TYPE",
      typeId: "",
      pkKey: "id", // 主键  如果主键不是pk需要传主键
      loading: false,
      dialogFormVisible: false,
      templatebuilderDialogVisible: false,
      templaterenderDialogVisible: false,
      importFormVisible: false,
      copyDialogFormVisible: false,
      dataTemplateKey: "",
      editId: "",
      listData: [],
      listConfig: {
        // 查询条件
        searchForm: { prop: "Q^name_^SL", label: "模版名称" },
        // 工具栏
        toolbars: [{ key: "import" }, { key: "export" }],

        // 表格字段配置
        columns: [{ prop: "name", label: "表单名称" }],
        // 管理列
        rowHandle: {
          actions: [
            { key: "preview", label: "预览", icon: "el-icon-view" },
            { key: "edit", label: "编辑", icon: "ibps-icon-edit" },
            { key: "remove", label: "删除", icon: "ibps-icon-remove" }
            // { key: 'copy', label: '复制', icon: 'ibps-icon-copy' }
          ]
        }
      },
      pagination: {},
      sorts: {}
    };
  },
  computed: {
    treeHeight() {
      return this.height - 75;
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true;
      queryPageList(this.getSearcFormData())
        .then(response => {
          ActionUtils.handleListData(this, response.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs["crud"]
        ? this.$refs["crud"].getSearcFormData()
        : {};
      params["Q^TYPE_ID_^S"] = this.typeId;
      return ActionUtils.formatParams(params, this.pagination, this.sorts);
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts);
      ActionUtils.setPagination(this.pagination, page);
      this.loadData();
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort);
      ActionUtils.setPagination(this.pagination);
      this.loadData();
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination);
      ActionUtils.setSorts(this.sorts);
      this.loadData();
    },
    handleAction(command, position, selection, data) {
      switch (command) {
        case "search": // 查询
          this.search();
          break;
        case "add": // 添加
          this.dialogFormVisible = true;
          break;
        case "edit": // 编辑
          this.handleEdit(selection);
          break;
        case "remove": // 删除
          ActionUtils.removeRecord(selection)
            .then(ids => {
              this.handleRemove(ids);
            })
            .catch(() => {});
          break;
        case "import": // 导入
          this.handleImport();
          break;
        case "export": // 导出
          ActionUtils.selectedMultiRecord(selection)
            .then(ids => {
              this.handleExport(ids);
            })
            .catch(() => {});
          break;
        case "preview": // 预览
          

          this.handlePreview(data.key);
          break;
        case "copy": // 复制
          this.handleCopy(data.id);
          break;
      }
    },
    handleImport() {
      this.importFormVisible = true;
    },
    handleExport(ids) {
      exportFile({ templateIds: ids })
        .then(response => {
          if (!response) {
            return;
          }
          ActionUtils.exportFile(
            response.data,
            "dataTemplate_" + fecha.formatDate("yyyyMMddHHmmss") + ".zip"
          );
        })
        .catch(() => {});
    },
    handleEdit(id) {
      console.log(id,"表单的ID")
      this.templatebuilderDialogVisible = true;
      this.editId = id;
    },
    handleCopy(id) {
      this.copyDialogFormVisible = true;
      this.editId = id;
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ dataTemplateIds: ids })
        .then(response => {
          ActionUtils.removeSuccessMessage();
          this.search();
        })
        .catch(() => {});
    },
    handleNodeClick(typeId) {
      this.typeId = typeId;
      this.loadData();
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30;
    },
    // 预览
    handlePreview(key) {
      this.dataTemplateKey = key;
      this.templaterenderDialogVisible = true;
    }
  }
};
</script>
