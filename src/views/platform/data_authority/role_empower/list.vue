<template>
  <div class="main-container">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <div slot="rightTools" class="role-name">
        <div class="role-show">
          <span>角色名称：</span>
          <el-input v-model="roleName" readonly placeholder></el-input>
        </div>
        <div class="role-show">
          <span>角色别名：</span>
          <el-input v-model="aliasName" readonly placeholder></el-input>
        </div>
      </div>
    </ibps-crud>
    <edit
      :id="editId"
      :role="roleId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />

    <role-dialog :visible.sync="dialogRole" @close="roleClose" @getRole="getRole" />
  </div>
</template>

<script>
import {
  queryPageList,
  remove,
  changeStatus
} from "@/api/platform/data_authority/role_empower";
import ActionUtils from "@/utils/action";
import FixHeight from "@/mixins/height";
import Edit from "./edit";
import roleDialog from "./role_dialog";

export default {
  components: {
    Edit,
    roleDialog
  },
  mixins: [FixHeight],
  data() {
    return {
      roleName: "",
      aliasName: "",
      roleId: "",
      dialogRole: false, // 角色选择弹窗
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
            key: "search",
            label: "关联角色"
          },
          {
            key: "add"
          },
          {
            key: "edit",
            label: "编辑"
          },
          {
            key: "remove",
            type: "danger"
          }
        ],
        // searchForm: {
        //   forms: [
        //     { prop: "Q^NAME_^SL", label: "权限角色" },
        //     // {
        //     //   prop: "Q^TYPE_^S",
        //     //   label: "参与者类型",
        //     //   fieldType: "select",
        //     // }
        //   ]
        // },
        // 表格字段配置
        columns: [
          { prop: "auCode", label: "权限对象编码" },
          { prop: "auName", label: "权限对象描述" },
          { prop: "auField", label: "权限字段" },
          { prop: "isAll", label: "是否全局对象" },
          { prop: "auValue", label: "权限赋值" }
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

      queryPageList({
        parameters: [
          {
            key: "Q^ROLE_ID_^S",
            value: this.roleId
          }
        ],
        requestPage: {
          limit: 0,
          pageNo: 0
        },
        sorts: []
      })
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
     * 查询
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
          this.searchRole();
          break;
        case "add": // 添加
          if (!this.roleId) {
            this.$message.error("请关联角色对象");

            return;
          }
          this.handleEdit();
          this.title = "添加角色赋权";
          break;
        case "edit": // 编辑
          if (!this.roleId) {
            this.$message.error("请关联角色对象");
            return;
          }
          ActionUtils.selectedRecord(selection)
            .then(id => {
              console.log("id", id);
              this.handleEdit(id);
              this.title = "编辑角色赋权";
            })
            .catch(() => {});
          break;
        case "remove": // 删除
          if (!this.roleId) {
            this.$message.error("请关联角色对象");
            return;
          }
          ActionUtils.removeRecord(selection)
            .then(ids => {
              this.handleRemove(ids);
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },
    /* 查询角色 */
    searchRole() {
      this.dialogRole = true;
    },
    /* 关闭角色查询弹窗 */
    roleClose(visible, id) {
      this.dialogRole = visible;
    },
    /* 获取roleid */
    getRole(id, name, alias) {
      this.roleId = id;
      this.roleName = name;
      this.aliasName = alias;
      // ActionUtils.setSorts(this.sorts);
      // ActionUtils.setPagination(this.pagination, page);
      this.loadData();
      console.log("roleId", this.roleId);
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
      remove({ ids: ids })
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
.role-name {
  display: flex;
  justify-content: center;
  align-items: center;
  .role-show {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      color: #333;
      padding-left: 5px;
      white-space: nowrap;
      display: inline-block;
    }
  }
}
</style>
