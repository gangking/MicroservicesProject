<template>
  <el-card style="height: 100%">
    <div class="tab">
      <div class="title">
        <div class="redblock"></div>
        <p>定时任务</p>
      </div>
      <div class="btn">
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
        <div class="rightbtn">
          <el-button @click="reLoad" plain class="elbtn filter">
            <el-badge :is-dot="dot">
              <i class="iconfont icon-uniE0561 iconbtn filbtn" />
            </el-badge>
          </el-button>
          <el-button is-dot class="elbtn filter othbtn" plain @click="reLoadData">
            <i class="iconfont icon-uniE248 iconbtn filbtn" />
          </el-button>
          <el-button class="elbtn filter othbtn" plain @click="confirm">
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
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="msgid" label="消息类" sortable align="center" />

          <el-table-column prop="stext" label="名称" sortable />
        </el-table>
      </div>

      <div class="foot">
        <el-pagination
          :current-page.sync="currentpage"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="100"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  data() {
    return {
      tableData: [],
      currentpage: 1,
      delIds: [],
      select: [],
      dialogTableVisible: false,
      dot: false,
      loading: false
    };
  },
  methods: {
    addData() {},
    open() {
      this.$confirm("此操作将永久删除该内容, 是否继续?", "提示", {
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
    deletedata() {},
    reLoad() {
      this.visible = true;
    },
    reLoadData() {
      // this.dot = false;
      // Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ""));
      // this.currentpage = 1;
      // this.$emit("msgTypeData");
    },
    gettableData() {
      // this.loading = true;
      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: COMP_URL + "/bsCheckStep/queryForMsgClass",
      //   method: "post",
      //   data: {
      //     parameters: [
      //       {
      //         key: "Q^MSGID_^SL",
      //         value: this.selecForm.selmsgtype
      //       },
      //       {
      //         key: "Q^STEXT_^SL",
      //         value: this.selecForm.selmsgname
      //       }
      //     ],
      //     requestPage: {
      //       pageNo: this.currentpage,
      //       limit: 20,
      //       totalCount: null
      //     },
      //     sorts: []
      //   }
      // })
      //   .then(res => {
      //     console.log("未提交翻页", res);
      //     this.tableData = res.data.dataResult;
      //     this.pageAll = res.data.pageResult;
      //     this.loading = false;
      //   })
      //   .catch(res => {
      //     this.loading = false;
      //   });
    },
    confirm() {
      // let selForm = Object.values(this.selecForm);
      // selForm.forEach(i => {
      //   if (i != "") {
      //     this.dot = true;
      //   }
      // });
      // this.currentpage = 1;
      // this.gettableData();
      // this.visible = false;
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
      console.log("this.select", this.select);
      this.delIds = [];
      row.forEach(item => {
        this.delIds.push(item.id);
      });
      this.delIds = this.delIds.toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/views/platform/processmanage/components/table/table.scss";
</style>