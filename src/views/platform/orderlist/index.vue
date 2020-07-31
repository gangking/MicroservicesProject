<template>
  <el-card style="height: 98%">
    <div class="title">
      <div class="redblock"></div>
      <p>跨期打开订单表</p>
    </div>
    <div class="btn">
      <div class="rightbtn">
        <el-dialog
          placement="left-start"
          :visible.sync="visible"
          class="selectBox"
          :close-on-click-modal="false"
          :show-close="false"
          :modal="false"
          :append-to-body="true"
          @show="openSel"
          width="40%"
          top="8vh"
        >
          <el-form ref="form" :model="selecForm" label-width="100px">
            <el-form-item v-for="item in titles" :key="item.id" :label="item.title">
              <el-input v-model="selecForm[item.key]"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm">保存</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-button @click="visiblebtn" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <el-button is-dot class="elbtn filter othbtn" plain @click="reLoad">
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
        height="98%"
        v-loading="loading"
        element-loading-background="rgba(250, 250, 250, 0.5)"
        :header-cell-style="{color:'#000'}"
        style="width: 100%"
        :default-sort="{prop: 'startTime', order: 'descending'}"
        @selection-change="getRow"
      >
        <el-table-column type="selection" width="45" />
        <!-- <el-table-column label="单据号" prop="docNumber" sortable width="180" align="center">
          <template slot-scope="scope">
            <p class="subject" @click="detailvisible(scope.row)">{{ scope.row.docNumber }}</p>
          </template>
        </el-table-column> -->

        <el-table-column
          v-for="item in titles"
          :key="item.id"
          :label="item.title"
          :prop="item.key"
          align="center"
          sortable
          :width="item.width"
        >
          <!-- <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>-->
        </el-table-column>
      </el-table>
    </div>

    <div class="foot">
      <el-pagination
        :current-page.sync="currentpage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="30"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  data() {
    return {
      visible: false,
      tableData: [
        // {
        //   id: 0,
        //   docNumber: "123123123123",
        //   username: "Rex",
        //   truename: "user1",
        //   phone: "11111111111",
        //   age: "19"
        // },
        // {
        //   id: 1,
        //   docNumber: "456456456456",
        //   username: "Ted",
        //   truename: "user2",
        //   phone: "22222222222",
        //   age: "16"
        // }
      ],
      selecForm: {},
      dot: false,
      loading: false,
      currentpage: 1,
      pageAll: {},
      titles: [
        // { id: 0, title: "序号", type: "text", key: "id", width: 100 },
        // { id: 1, title: "用户名", type: "text", key: "username", width: 150 },
        // { id: 2, title: "姓名", type: "text", key: "truename", width: 160 },
        // { id: 3, title: "手机号", type: "text", key: "phone", width: "" },
        // { id: 4, title: "年龄", type: "text", key: "age", width: 120 },
      ]
    };
  },
  mounted() {
    // 加载完成后显示提示
    //  this.showInfo();
    this.gettableData()
  },
  watch: {},
  methods: {
    /**
     * 获取表数据
     */
    gettableData(){
      this.loading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/zfssTwo/financelist",
        method: "post",
        data:{
          parameters:[
            this.selecForm
          ],
          sorts:{},
          requestPage:{"pageNo":1,"limit":5},
          extraParameters:null,
          dataTemplatedId:null
        }
      }).then(res => {
         this.loading = false;
         console.log("openSel", res);
        // this.select = res.data;
        this.tableData = res.variables.tableData.dataResult;
        this.titles = res.variables.titles;
      }).catch(res => {
          this.loading = false;
        });;
    },
    visiblebtn() {
      this.visible = true;
    },
    openSel() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: "/pzwjfz/finfListDoc",
        method: "get"
      }).then(res => {
        console.log("openSel", res);
        this.select = res.data;
      });
    },
    confirm() {
      console.log("this.selecForm", this.selecForm);

      let selForm = Object.values(this.selecForm);
      selForm.forEach(i => {
        if (i != "") {
          this.dot = true;
        }
      });
      this.currentpage = 1;
        this.gettableData();
      // this.showInfo();
      this.visible = false;
    },
    reLoad() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ""));
      // this.selectime = "";
      this.currentpage = 1;
    },
    cancel() {
      this.visible = false;
    },
    reLoadData() {},
    detailvisible() {},
    getRow() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      // this.gettableData();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>