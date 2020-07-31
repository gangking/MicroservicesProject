<template>
  <div class="config-box">
    <div class="title">
      <span>移动端摘要配置</span>
    </div>
    <div class="select">
      <div class="select-business">
        <span class="select-span">业务场景：</span>
        <div class="dialog-select" @click="handleSelectorClick">
          <div>
            <el-input
              placeholder="请选择业务场景"
              ref="seBusiness"
              suffix-icon="el-icon-search"
              v-model="businessName"
            ></el-input>
          </div>
        </div>
        <div class="select-call">
          <span class="select-span">业务情形：</span>
          <el-select v-model="bsiCode" placeholder="请选择" @change="codeChange">
            <el-option
              v-for="item in dropdownList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="configTable">
      <div class="table-top">
        <el-button size="mini" type="primary" @click="handleEdit('add')">新增</el-button>
        <el-button size="mini" type="primary" @click="handleEdit('edit')">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleEdit('delete')">删除</el-button>
        <el-button size="mini" type="primary" @click="handleEdit('save')">保存排序</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          :prop="dropCol[index].prop"
          :label="item.label"
        ></el-table-column>
        <el-table-column label="拖拽排序" width="80">
          <template slot-scope="scope">
            <!-- <el-button icon="el-icon-s-tools" @click="handleEdit(scope.$index, scope.row)"></el-button> -->
            <i class="el-icon-s-tools icon" @click="handleTable(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <select-business
      :visible.sync="selectorVisible"
      :selectId="businessId"
      :dataTable="datatable"
      @selectData="selectData"
      @close="visible=>selectorVisible =visible"
    />

    <business-add
      ref="business"
      :visible.sync="busiesVisible"
      :dataTable="treeData"
      :selectList="selectList"
      :title="title"
      @businesEdit="businesEdit"
      @close="visible=>busiesVisible =visible"
    />
  </div>
</template>

<script>
import Sortable from "sortablejs";
import selectBusiness from "./select-business";
import businessAdd from "./business-add";
import effectApi from "@/api/platform/effectiveness/index.js";
import rulesApi from "@/api/platform/rules/index.js";
import { buildTree } from "@/api/platform/form/formDef";
import { queryScene } from "@/api/platform/bpmn/bpmDistribute";
import {
  getConfig,
  saveConfig,
  deleConfig,
  batchSave
} from "@/api/platform/summary/summary";

export default {
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      col: [
        { label: "序号", prop: "sn" },
        { label: "id", prop: "id" },
        { label: "bsKey", prop: "bsKey" },
        // { label: "bsCode", prop: "bsCode" },
        { label: "bsiCode", prop: "bsiCode" },
        { label: "字段描述", prop: "fieldDesc" },
        { label: "字段名", prop: "fieldName" }
      ],
      dropCol: [
        { label: "序号", prop: "sn" },
        { label: "id", prop: "id" },
        { label: "bsKey", prop: "bsKey" },
        // { label: "bsCode", prop: "bsCode" },
        { label: "bsiCode", prop: "bsiCode" },
        { label: "字段描述", prop: "fieldDesc" },
        { label: "字段名", prop: "fieldName" }
      ],
      tableData: [
        // {
        //   id: "",
        //   bsKey: "",
        //   bsCode: "",
        //   bsiCode: "",
        //   sn: 0,
        //   fieldDesc: "",
        //   fieldName: ""
        // }
      ],
      title: "编辑",
      loading: true,
      allTableData: [], //原始的未处理的数据
      selectList: [], //选择的一条数据
      configTable: [], //摘要配置表格
      objTreeData: [], //业务对象树
      datatable: [], //表格数据
      busiesVisible: false, //编辑新增弹窗
      businessSelect: [], //表格的选择数据
      selectorVisible: false, //选择业务场景弹窗
      businessName: "",
      businessId: "",
      bsiCode: "",
      bsKey: "",
      dropdownList: []
    };
  },
  computed: {
    hideField(item) {}
  },
  created() {
    this.getData();
  },
  mounted() {
    this.rowDrop();
  },
  watch: {
    tableData: {
      handler(val, oldVal) {
        console.log("表格排序变化", val);
      },
      deep: true
    }
  },
  methods: {
    //表格的增删改 保存
    handleEdit(command) {
      switch (command) {
        case "add": // 新增
          this.title = "新增";
          this.selectList = [];
          this.$refs.business.ruleForm.fieldDesc = "";
          this.$refs.business.ruleForm.fieldName = "";
          this.busiesVisible = true;
          break;
        case "edit": // 编辑
          this.title = "编辑";
          // ActionUtils.selectedRecord(selection)
          //   .then(id => {
          //     this.handleEdit(id);
          //     this.title = "编辑权限配置";
          //   })
          //   .catch(() => {});
          //console.log(this.businessSelect, "businessSelect");
          if (this.businessSelect.length != 1) {
            this.$message({
              message: "请选择一条数据",
              type: "warning"
            });
            return;
          }
          this.busiesVisible = true;
          this.selectList = this.businessSelect;
          break;
        case "delete": // 删除数据
          if (this.businessSelect.length == 0) {
            this.$message({
              message: "请选择一条数据",
              type: "warning"
            });
            return;
          }
          // let copyData = JSON.parse(JSON.stringify(this.tableData));
          // this.tableData.forEach((item, index) => {
          //   this.businessSelect.forEach(i => {
          //     if (item.id == i.id) {
          //       copyData.splice(index, 1);
          //     }
          //   });
          // });
          // if (copyData.length == 0) {
          //   let clearAll = [{ bsiCode: this.bsiCode, bsKey: this.bsKey }];
          //   this.save(clearAll);
          // } else {
          //   this.save(copyData);
          // }
          console.log(this.businessSelect, "this.businessSelect");
          let deleArr = this.businessSelect.map(item => item.id);
          console.log(deleArr, "deleArr");
          this.delete(deleArr);
          break;
        case "save":
          this.saveData();
        default:
          break;
      }
    },
    //表格选择的数据
    handleSelectionChange(val) {
      this.businessSelect = val;
    },
    businesEdit(form, fieldSelect) {
      // console.log(form, "获取的form");
      //console.log(fieldSelect, "获取的fieldSelect");
      let sendForm = {
        id: "",
        bsKey: this.bsKey,
        bsCode: "",
        bsiCode: this.bsiCode,
        sn: ++this.tableData.length,
        fieldDesc: form.fieldDesc,
        fieldName: fieldSelect.fieldName,
        fieldId: fieldSelect.value
      };
      if (this.tableData.length == 0) {
        this.save(sendForm);
      } else {
        if (form.id) {
          let indexlist = 0;
          this.tableData.forEach((item, index) => {
            if (form.id == item.id) {
              indexlist = index;
              this.$set(this.tableData[index], "fieldDesc", form.fieldDesc);
              this.$set(
                this.tableData[index],
                "fieldName",
                fieldSelect.fieldName
              );
              this.$set(this.tableData[index], "fieldId", fieldSelect.value);
            }
          });
          this.save(this.tableData[indexlist]);
        } else {
          this.save(sendForm);
        }
      }
    },
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(
        ".configTable .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        }
      });
    },
    //选择业务场景弹窗
    handleSelectorClick() {
      //console.log("失去焦点");
      this.selectorVisible = true;
      this.$refs.seBusiness.blur();
    },
    // 选择的数据
    selectData(rowData) {
      this.loading = true;
      //选择的名字
      this.businessName = rowData.name;
      this.bsKey = rowData.bizKey;
      //对象树和弹窗的下拉
      buildTree({
        boCode: rowData.bizKey,
        boDefId: rowData.boDefId,
        mode: "bo"
      })
        .then(response => {
          //console.log("获取所选的业务对象", response);
          this.objTreeData = response.data.filter(item => {
            return item.attrType == "field";
          });
          this.$emit("objTree", this.objTreeData);
        })
        .catch(e => {
          this.$message.error("业务场景获取失败");
        });

      queryScene({ bsKey: rowData.bizKey }).then(response => {
        //console.log(response.data, "数据请求 下拉数据");
        this.dropdownList = response.data.map(item => {
          return {
            label: item.bsiDesc,
            value: item.bsiCode
          };
        });
        this.bsiCode = this.dropdownList[0].value;
        this.getTableConfig();
      });

      // console.log(rowData, "选择的rowData");
    },
    getData() {
      effectApi
        .bsBasicQueryAll({})
        .then(res => {
          this.datatable = res.data;
          let data = res.data[0];
          // 默认选择第一项
          this.businessName = data.name;
          this.businessId = data.bizKey;
          //console.log(data, "第一条数据");
          // this.$emit("getSelectScenario", this.selectValue);

          this.selectData(data);
        })
        .catch(req => {
          this.loading = false;
          this.$message.error("业务场景获取失败");
          console.log("获取业务场景失败");
        });
    },
    // 获取配置表格数据
    getTableConfig() {
      this.loading = true;
      getConfig({ bsKey: this.bsKey, bsiCode: this.bsiCode })
        .then(res => {
          this.tableData = res.data;
          this.allTableData = res.data;
          this.loading = false;
        })
        .catch(req => {
          this.loading = false;
          this.$message.error("表格加载失败");
        });
    },

    // 保存表格数据 编辑和新增
    save(formData) {
      this.loading = true;
      saveConfig(formData)
        .then(res => {
          this.getTableConfig();
        })
        .catch(req => {
          this.loading = false;
          this.$message({
            message: "数据操作失败",
            type: "warning"
          });
        });
    },
    //删除 批量
    delete(arr) {
      this.loading = true;
      deleConfig(arr)
        .then(res => {
          this.getTableConfig();
        })
        .catch(req => {
          this.loading = false;
          this.$message({
            message: "数据操作失败",
            type: "warning"
          });
        });
    },
    //保存排序
    saveData(arr) {
      this.loading = true;
      batchSave(this.tableData)
        .then(res => {
          this.getTableConfig();
        })
        .catch(req => {
          this.loading = false;
          this.$message({
            message: "数据操作失败",
            type: "warning"
          });
        });
    },
    // 业务情形下拉变化
    codeChange(val) {
      this.bsiCode = val;
      this.loading = true;
      this.getTableConfig();
    }
  },
  components: {
    selectBusiness,
    businessAdd
  }
};
</script>

<style scoped lang="scss">
.config-box {
  height: 100%;
  border: 1px solid #ccc;
  .title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    padding-left: 5px;
    box-sizing: border-box;
    span {
      display: inline-block;
      border-left: 5px solid #fa5555;
      padding-left: 10px;
      font-size: 13px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }
  }
  .select {
    padding: 10px;
    height: 40px;
    line-height: 40px;
    .select-business {
      display: inline-block;
      .dialog-select {
        cursor: pointer;
        display: inline-block;
      }
      > span {
        text-align: right;
        display: inline-block;
        width: 90px;
      }
    }
    .select-call {
      display: inline-block;
      > span {
        text-align: right;
        display: inline-block;
        width: 90px;
      }
    }
  }
  .configTable {
    padding: 10px;
    .table-top {
      padding-bottom: 5px;
    }
    /deep/ .el-table_1_column_5 .cell {
      text-align: center;
    }
    .icon {
      font-size: 22px;
      cursor: move;
    }
  }
}
</style>
