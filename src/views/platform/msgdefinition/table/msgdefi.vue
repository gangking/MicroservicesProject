<template>
  <div class="tab">
    <div class="btn">
      <!-- <el-input
        v-model="searchinput"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        class="inp"
        
      ></el-input>
      <el-button type="primary" plain class="elbtn" @click="loadData">
        <i class="iconfont icon-search iconbtn" />
        <span class="icontext">搜索</span>
      </el-button>-->
      <el-button size="mini" plain type="primary" class="elbtn" @click="addData">
        <i class="iconfont icon-zengjiaxiaoxi iconbtn" />
        <span class="icontext">增加</span>
      </el-button>
      <el-button type="text" @click="open">
        <el-button size="mini" plain type="danger" class="elbtn">
          <i class="iconfont icon-uniE03D1 iconbtn" />
          <span class="icontext">删除</span>
        </el-button>
      </el-button>
      <el-button size="mini" plain type="success" class="elbtn" @click="editData">
        <i class="iconfont icon-bianjixiaoxi iconbtn" />
        <span class="icontext">编辑</span>
      </el-button>
      <!-- <el-button size="mini" type="primary" plain class="elbtn" @click="reLoad">
        <i class="iconfont icon-uniE076 iconbtn" />
        <span class="icontext">筛选</span>
      </el-button>

      <el-button size="mini" plain type="success" class="elbtn" @click="reLoadData">
        <i class="iconfont icon-uniE249 iconbtn" />
        <span class="icontext">重置</span>
      </el-button> -->
      <div class="rightbtn">
        <el-button @click="reLoad" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <el-button is-dot class="elbtn filter" plain @click="reLoadData">
          <i class="iconfont icon-uniE248 iconbtn filbtn" />
        </el-button>
        <el-button class="elbtn filter" plain @click="confirm">
          <i class="iconfont icon-uniE00A1 iconbtn filbtn" />
        </el-button>
      </div>
    </div>

    <div class="datatable">
      <el-table
        :data="tableData"
        height="100%"
        v-loading="loading"
        element-loading-background="rgba(250, 250, 250, 0.5)"
        :header-cell-style="{color:'#000'}"
        style="width: 100%"
        :default-sort="{prop: 'startTime', order: 'descending'}"
        @selection-change="getRow"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="msgid" label="消息类" sortable align="center" width="120" />
        <el-table-column prop="msgno" label="消息编号" sortable align="center" width="100" />
        <el-table-column prop="msgtx" label="消息文本" />
      </el-table>
    </div>

    <div class="foot">
      <el-pagination
        :current-page.sync="currentpage"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="pageAll.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 筛选 -->
    <el-dialog
      title="筛选消息"
      placement="left-start"
      :visible.sync="visible"
      class="selectBox"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :append-to-body="true"
      @show="openSel"
      width="40%"
      top="25vh"
    >
      <el-form ref="form" :model="selecForm" label-width="100px">
        <el-form-item label="消息类:">
          <el-input
            v-model="selecForm.selmsgtype"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            class="inp"
          ></el-input>
        </el-form-item>
        <el-form-item label="消息编号:">
          <el-input
            v-model="selecForm.selmsgname"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            class="inp"
          ></el-input>
        </el-form-item>
        <el-form-item label="消息文本:">
          <el-input
            v-model="selecForm.selmsgtext"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            class="inp"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirm">保存</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 增加 -->
    <el-dialog
      title="添加消息"
      placement="left-start"
      :visible.sync="addvisible"
      class="selectBox"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :append-to-body="true"
      @show="openSel"
      width="40%"
      top="25vh"
    >
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="消息类:">
          <el-select v-model="addForm.msgid" placeholder="请选择" class="margin5">
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息编号:">
          <el-input v-model="addForm.msgno" placeholder="请输入内容" class="inp"></el-input>
        </el-form-item>
        <el-form-item label="消息文本:">
          <el-input v-model="addForm.msgtx" placeholder="请输入内容" class="inp"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAdd">保存</el-button>
          <el-button type="primary" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      title="筛选消息"
      placement="left-start"
      :visible.sync="editvisible"
      class="selectBox"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :append-to-body="true"
      @show="openSel"
      width="40%"
      top="25vh"
    >
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="消息类:">
          <el-input disabled v-model="editForm.msgid" class="inp"></el-input>
        </el-form-item>
        <el-form-item label="消息编号:">
          <el-input disabled v-model="editForm.msgno" class="inp"></el-input>
        </el-form-item>
        <el-form-item label="消息文本:">
          <el-input v-model="editForm.msgtx" class="inp"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveEdit">保存</el-button>
          <el-button type="primary" @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import { COMP_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  props: {
    msgdata: {
      type: Array,
      default: () => {
        return [];
      }
    },
    msgnum: {
      type: Object,
      default: () => {
        return {};
      }
    },
    appId: {
      type: String
    },
    load: {
      type: Boolean
    }
  },
  data() {
    return {
      searchinput: "",
      tableData: [],
      currentpage: 1,
      dialogTableVisible: false,
      delIds: [],
      selecForm: {
        selmsgtype: "",
        selmsgname: "",
        selmsgtext: ""
      },
      addForm: {
        msgid: "",
        msgno: "",
        msgtx: ""
      },
      editForm: {
        id: "",
        msgid: "",
        msgno: "",
        msgtx: ""
      },
      select: [],
      pageAll: {},
      loading: false,
      options: [],
      visible: false,
      addvisible: false,
      editvisible: false,
      dot: false
    };
  },
  watch: {
    msgdata: {
      handler: function(val, oldVal) {
        this.tableData = [];
        this.tableData = val;
      },
      immediate: true
    },
    msgnum: {
      handler: function(val, oldVal) {
        this.pageAll = val;
      },
      immediate: true,
      deep: true
    },
    load: {
      handler: function(val, oldVal) {
        this.loading = val;
      },
      immediate: true
    }
  },
  mounted() {
    this.getOptions();
  },
  destroyed() {},
  methods: {
    loadData() {},
    reLoadData() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ""));
      this.currentpage = 1;
      this.$emit("msgData");
    },
    handleClose() {
      this.dialogTableVisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.gettableData();
    },
    getRow(row) {
      this.select = row;
      this.delIds = [];
      row.forEach(item => {
        this.delIds.push(item.id);
      });
      this.delIds = this.delIds.toString();
    },
    open() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.deletedata();
        })
        .catch(() => {});
    },
    deletedata() {
      if (this.select.length == 0) {
        this.$message.error("请选择要删除的内容");
      } else {
        console.log("delIds", this.delIds);
        return request({
          baseURL: BASE_GATEWAY_API,
          url: COMP_URL + "/bsCheckStep/deleteMsgDef?ids=" + this.delIds,
          method: "get"
        }).then(res => {
          console.log("res", res);
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.gettableData();
        });
      }
    },
    gettableData() {
      this.loading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/bsCheckStep/queryMsgDef",
        method: "post",
        data: {
          parameters: [
            {
              key: "Q^MSGID_^SL",
              value: this.selecForm.selmsgtype
            },
            {
              key: "Q^MSGNO_^SL",
              value: this.selecForm.selmsgname
            },
            {
              key: "Q^MSGTX_^SL",
              value: this.selecForm.selmsgtext
            }
          ],
          requestPage: {
            pageNo: this.currentpage,
            limit: 20,
            totalCount: null
          },
          sorts: []
        }
      })
        .then(res => {
          console.log("未提交翻页", res);
          this.tableData = res.data.dataResult;
          this.pageAll = res.data.pageResult;
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    confirm() {
      let selForm = Object.values(this.selecForm);
      selForm.forEach(i => {
        if (i != "") {
          this.dot = true;
        }
      });
      this.currentpage = 1;
      this.gettableData();
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    addData() {
      Object.keys(this.addForm).forEach(key => (this.addForm[key] = ""));
      this.addvisible = true;
    },
    saveAdd() {
      if (this.addForm.msgid) {
        if (this.addForm.msgno.length < 4) {
          return request({
            baseURL: BASE_GATEWAY_API,
            url: COMP_URL + "/bsCheckStep/addMsgDef",
            method: "post",
            data: this.addForm
          })
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.gettableData();
              this.addvisible = false;
            })
            .catch(res => {
              this.addvisible = false;
            });
        } else {
          this.$message.error("消息编号最多3位");
          return false;
        }
      } else {
        this.$message.error("请选择消息类");
        return false;
      }
    },
    cancelAdd() {
      this.addvisible = false;
    },
    editData() {
      if (this.select.length != 1) {
        this.$message.error("请选择一条编辑内容");
      } else {
        const { id, msgid, msgno, msgtx } = this.select[0];
        this.editForm = { id, msgid, msgno, msgtx };
        this.editvisible = true;
      }
    },
    saveEdit() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/bsCheckStep/addMsgDef",
        method: "post",
        data: this.editForm
      })
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.gettableData();
          this.editvisible = false;
        })
        .catch(res => {
          this.editvisible = false;
        });
    },
    cancelEdit() {
      this.editvisible = false;
    },
    reLoad() {
      this.visible = true;
    },
    openSel() {},
    getOptions() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + "/bsCheckStep/findAllMsgid",
        method: "post"
      })
        .then(res => {
          console.log("options", res);
          this.options = res.data;
          console.log("this.options", this.options);
        })
        .catch(res => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/views/platform/processmanage/components/table/table.scss";
</style>
