<template>
  <div>
    <el-dialog
      title="添加业务对象"
      :visible.sync="dialogVisible"
      class="selectBox"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="true"
      :append-to-body="true"
      width="70%"
      top="5vh"
    >
      <el-form ref="form" :model="selecForm" label-width="100px">
        <div class="search">
          <div class="option">
            <span>业务对象名称:</span>
            <el-input v-model="form.name"></el-input>
          </div>
          <el-button type="primary" plain class="elbtn" @click="loadData">
            <i class="iconfont icon-search iconbtn" />
            <span class="icontext">搜索</span>
          </el-button>
        </div>

        <div class="table">
          <el-table
            :data="tableData"
            height="100%"
            style="width: 100%"
            v-loading="loading"
            element-loading-background="rgba(250, 250, 250, 0.5)"
            :header-cell-style="{color:'#000'}"
            @selection-change="getRow"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column prop="code" label="业务对象编码"></el-table-column>
            <el-table-column prop="name" label="业务对象名称"></el-table-column>
            <el-table-column prop="createBy" label="创建人"></el-table-column>
            <!-- <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  class="elbtn"
                  @click="confirm(scope.$index, scope.row)"
                >
                  <i class="iconfont icon-zhuanban iconbtn" />
                  <span class="icontext">确认转办</span>
                </el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>

        <div class="foot">
          <el-pagination
            :current-page.sync="currentpage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="pageAll.totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <el-form-item>
          <el-button type="primary" @click="confirm" class="btn">确 定</el-button>
          <el-button type="primary" @click="cancel" class="btn">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import { FORM_URL, BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  props: {
    dialogVisible: Boolean,
    busObjId:{
      type: String
    },
  },
  data() {
    return {
      pageAll: {},
      form: {},
      selecForm: {},
      loading: false,
      tableData: [],
      currentpage: 1,
      objId: "",
      objName:""
    };
  },
  methods: {
    loadData() {
      console.log('proName');
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + "bpm/definition/findByBoCode?boCode="+this.busObjId,
        method: "get",
        data: {
          // parameters: [{ key: "Q^TYPE_ID_^S", value: "" }],
          // requestPage: { pageNo: 1, limit: 10, totalCount: null },
          // sorts: []
        }
      })
        .then(res => {
          console.log("proName", res);
          this.tableData = res.data.dataResult;
          this.pageAll = res.data.pageResult;
          this.$emit("open");
        })
        .catch(res => {
          // this.$message.error("消息类重复!");
        });
    },
    confirm() {
      this.$emit("handleClose",this.objId,this.objName);
    },
    cancel() {
      this.$emit("handleClose");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.loadData();
    },
    getRow(row) {
      if (row.length != 1) {
        this.$message.error("请选择一条业务对象!");
      } else {
        // this.objId = row[0].code;
        // this.objName=row[0].name
      }
    }
  },
  watch: {
    busObjId: {
      handler: function(val, oldVal) {
        // this.tableData = [];
        // this.tableData = val;
      },
      immediate: true
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./add.scss";
</style>