<template>
  <div class="main-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
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
import Edit from "./edit";

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: "", // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: "id", // 主键  如果主键不是pk需要传主键

      title: "",
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: "search"
          },
          {
            key: "add"
          },

          {
            key: "edit"
          },
          {
            key: "start",
            label: "是否启用",
            type: "warning"
          }
          // {
          //   key: "remove",
          //   type: "danger"
          // }
        ],
        searchForm: {
          forms: [
            { prop: "Q^AUCODE_^SL", label: "权限对象编码" },
            {
              prop: "Q^AU_NAME^SL",
              label: "权限对象描述"
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: "aucode", label: "权限对象编码" },
          { prop: "auname", label: "权限对象描述" },
          { prop: "table", label: "权限表" },
          { prop: "auFields", label: "权限字段" },
          { prop: "auFieldsDescribe", label: "权限字段描述" },
          { prop: "statusFields", label: "权限对象状态", sortable: "custom" }
        ]
        // rowHandle: {
        //   actions: [{
        //     key: 'edit'
        //   }, {
        //     key: 'remove'
        //   }, {
        //     key: 'detail'
        //   }]
        // }
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true;
      queryPageList(this.getSearcFormData())
        .then(response => {
          console.log(response);
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
     * 查询FF
     */
    search() {
      ActionUtils.setPagination(this.pagination);
      ActionUtils.setSorts(this.sorts);
      this.loadData();
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case "search": // 查询
          this.loadData();
          break;
        case "add": // 添加
          this.handleEdit();
          this.title = "添加数据权限对象";
          break;
        case "start": // 是否启用
          ActionUtils.selectedRecord(selection)
            .then(id => {
              let currentData = this.listData.filter(item => {
                return item.id == id;
              });
              let changeSta = !JSON.parse(currentData[0].status);
              console.log("currentData[0].status", changeSta);
              changeStatus({ id: id, status: changeSta }).then(res => {
                if (res) {
                  // console.log(res);
                  this.loadData();
                } else {
                }
              });
              // this.handleEdit(id);
              // this.title = "标记删除";
            })
            .catch(() => {});
          break;
        case "remove": // 删除
          ActionUtils.removeRecord(selection)
            .then(ids => {
              this.handleRemove(ids);
            })
            .catch(() => {});
          break;
        case "edit": // 编辑
          ActionUtils.selectedRecord(selection)
            .then(id => {
              this.handleEdit(id);
              this.title = "编辑数据权限对象";
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(id = "", readonly = false) {
      this.editId = id;
      this.readonly = readonly;
      this.dialogFormVisible = true;
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ levelIds: ids })
        .then(response => {
          ActionUtils.removeSuccessMessage();
          this.search();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .ibps-toolbar .buttons {
//   float: right;
// }
</style>
