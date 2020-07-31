<template>
  <el-dialog
    title="导入数据"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="upload-dialog"
    width="60%"
    top="6vh"
    center
    v-dialogDrag
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <div class="upload">
      <div class="upload-step">
        <el-steps :active="active" finish-status="success">
          <el-step title="上传Excel"></el-step>
          <el-step title="预览数据"></el-step>
          <el-step title="选择字段"></el-step>
          <el-step title="导入数据"></el-step>
        </el-steps>
      </div>
      <div class="first" v-if="active==0">
        <el-upload
          class="upload-file"
          drag
          action
          :http-request="uploadFile"
          :beforeUpload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <!-- <div class="el-upload__tip" slot="tip">只能上传XLS或XLSX文件</div> -->
        </el-upload>
        <div class="upload-tip">
          <h5 class="tip-title">Excel文件要求：</h5>
          <ul class="list-style">
            <li>仅支持xls或xlsx格式的文件</li>
            <li>确保第一行为字段名，数据在第一个Sheet中，没有合并单元格</li>
            <li>文件大小请勿超过2.0 MB</li>
            <li>文件所含数据行数请勿超过2000行</li>
            <li>导入只做简单数据类型校验，不做数据有效性校验，请自行确保导入数据的正确性。</li>
          </ul>
        </div>
      </div>
      <div class="Second" v-else-if="active == 1">
        <!-- <ibps-crud
          ref="crud"
          :data="listData"
          :height="300"
          :loading="loading"
          :toolbars="listConfig.toolbars"
          :search-form="listConfig.searchForm"
          :pk-key="pkKey"
          :columns="listConfig.columns"
          :pagination="pagination"
        />-->
        <el-table :data="listData" class="showTable" height="300" border style="width: 100%">
          <template v-for="(column,index) in tableColumn">
            <el-table-column :prop="column" :label="column" :key="index" />
          </template>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          class="tablePage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
      <!-- 选择字段 -->
      <div class="three" v-else-if="active == 2">
        <el-table border :data="configData" style="width: 100%" height="350">
          <el-table-column label="Excel字段" width>
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column label="绑定字段" width="350">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.field"
                @change="fildsChange(scope.row.field,scope.$index,scope.row)"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in dataTemplatField"
                  :key="item.name+index"
                  :label="item.alias"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="four" v-else-if="active == 3" v-loading="success">
        <h3 class="success" v-if="!success">导入成功!</h3>

        <!-- 		成功导入条数据，失败条数据 -->
      </div>
    </div>

    <div class="upload-buttom" style="margin-top: 12px;">
      <el-button @click="pre" v-if="active!=0">上一步</el-button>
      <el-button @click="next" v-if="active!=0&&active!=3">下一步</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { buildTree } from "@/api/platform/data/dataset";
// import { mapActions,mapMutations } from "vuex";
// import _defaultsDeep from "lodash.defaultsdeep";
// import Utils from "./utils";

// import DataTemplateBuilder from "./index";

import axios from "axios";
import { mapState } from "vuex";
import request from "@/utils/request";
import { FORM_URL, BASE_URL } from "@/api/baseUrl";
import { fieldSelect } from "@/api/platform/data/upload";
export default {
  components: {
    //DataTemplateBuilder
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parentData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    dataTemplatField: {
      type: Array,
      default: () => []
    },
    boKey: {
      type: String,
      default: ""
    },
    allBoKey: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      upcolumns: [],
      success: true,
      pkKey: "id", // 主键  如果主键不是pk需要传主键
      active: 0,
      configData: [], //
      dialogVisible: this.visible,
      dialogLoading: false,
      listData: [], //表格数据
      saveList: [], //保存数据
      tableColumn: [], //表头
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数

      loading: false,
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            //key: "search"
          }
        ],
        searchForm: {
          // forms: [{ prop: "Q^AUCODE_^SL", label: "编码" }]
        },
        // 表格字段配置
        columns: [
          //{ prop: "aucode", label: "权限对象编码" }
        ]
      }
    };
  },
  computed: {
    // ...mapState("ibps/form", {
    //   dataTemplatField: state => state.dataTemplatField,
    //   dataTemplatKey: state => state.dataTemplatKey,
    //   allBoKey: state => state.allBoKey
    // })
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    columns: {
      handler(val, oldVal) {
        // console.log(val, "表头字段");
        this.upcolumns = val.map(item => {
          return item.prop;
        });
      },
      immediate: true
    }
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;

      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    pre() {
      this.active--;
      if (this.active == 0) this.listData = [];
    },
    next() {
      this.active++;
      if (this.active == 0) this.listData = [];
      if (this.active == 3) this.saveData();
      // if (this.active++ > 3) this.active = 0;
    },
    uploadFile(param) {
      // this.active = 1;
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      let url = BASE_URL + FORM_URL + "/form/data/template/upload";
      return request({
        url: url,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(response => {
          if (response.message == "上传成功！") {
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });

            this.active = 1;
            this.tableColumn = response.data[0];
            let tableData = response.data.slice(1);
            this.totalCount = tableData.length;

            tableData.forEach((item, index) => {
              let obj = {};
              item.forEach((list, i) => {
                this.tableColumn.forEach((table, inner) => {
                  let key = table;
                  obj[key] = item[inner];
                });
              });
              this.listData.push(obj);
            });
            // 字段绑定
            this.tableColumn.forEach(item => {
              this.dataTemplatField.forEach(list => {
                if (item == list.label) {
                  this.configData.push({
                    title: item,
                    name: list.name,
                    field: item + "-" + list.name
                  });
                }
              });
            });

            console.log(
              this.dataTemplatField,
              "dataTemplatFielddataTemplatFielddataTemplatField9999"
            );
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(message => {
          console.log("message======================", message);
          this.$message.error("上传失败，请联系管理员");
        });
    },
    saveData() {
      console.log("保存数据--");
      this.listData.forEach(item => {
        let obj = {};
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element = item[key];
            this.configData.forEach(list => {
              if (list.title == key) {
                obj[list.name] = element;
              }
            });
          }
        }
        this.saveList.push(obj);
      });
      console.log(this.saveList, "this.saveList");

      let formData = new FormData();

      formData.append("data", JSON.stringify(this.saveList));
      formData.append("tableName", this.allBoKey);
      return request({
        url: BASE_URL + FORM_URL + "/form/data/template/saveUploadNew",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(response => {
        if (response.message == "保存数据成功") {
          this.configData = [];
          this.saveList = [];
          this.active = 3;
          this.success = false;
          this.$emit("upTable");
        }
      });
    },
    //上传类型判断
    beforeAvatarUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "warning"
        });
      }
      return extension || (extension2 && isLt2M);
    },
    // 关闭当前窗口
    closeDialog() {
      this.configData = [];
      this.$emit("close", false);
    },
    handleCallback() {
      this.$emit("callback");
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.active = 0;
      this.success = true;

      this.configData = [];
      this.saveList = [];
      this.listData = [];
    },
    fildsChange(fields, data) {
      console.log("改变字段");
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-buttom {
  text-align: center;
}
.upload-file {
  padding-top: 15px;
  text-align: center;
  /deep/ .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 95%;
      margin: 0 auto;
      height: 210px;
    }
  }
}

.upload-tip {
  .tip-title {
    height: 25px;
    line-height: 25px;
    color: red;
    font-size: 14px;
    margin: 5px;
  }
  .list-style {
    list-style: disc;
    margin-left: 10px;
    overflow: auto;
  }
}
// .showTable,
// .tablePage {
//   padding-top: 10px;
// }
.four {
  .success {
    padding-top: 100px;
    font-size: 18px;
    text-align: center;
    color: #3d6;
  }
}
.upload {
  height: 470px !important;
  max-height: 700px;
  overflow: auto;
}
// /deep/ .el-table .cell {
//   height: 23px;
// }
// /deep/ .el-table {
//   overflow-x: auto;
// }
</style>

