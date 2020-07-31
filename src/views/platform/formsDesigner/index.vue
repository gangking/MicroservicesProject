<template>
  <div class="crud">
    <div class="avue-crud__menu">
      <div class="avue-crud__left">
        <el-button-group>
          <el-button type="primary" size="medium" @click="open('table','表格配置')">表格配置</el-button>
          <el-button type="primary" size="medium" @click="open('menu','操作配置')">操作配置</el-button>
          <el-button type="primary" size="medium" @click="open('dialog','弹框配置')">弹框配置</el-button>
          <el-button type="primary" size="medium" @click="open('btn','按钮配置')">按钮配置</el-button>
        </el-button-group>
      </div>
      <div class="avue-crud__right">
        <el-button type="text" size="medium" icon="el-icon-document" @click="handleAvueDoc">Avue文档</el-button>
        <el-button type="text" size="medium" icon="el-icon-upload2" @click="importJsonVisible = true">导入JSON</el-button>
        <el-button type="text" size="medium" icon="el-icon-download" @click="handleGenerateJson">生成JSON</el-button>
        <el-button type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
        <el-button class="danger" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
      </div>
    </div>
    <!-- 配置 -->
    <el-drawer :title="title" show-close append-to-body size="50%" :visible.sync="box">
      <el-scrollbar style="height:100%">
        <avue-form :option="tableOption" v-model="tableForm" v-if="type==='table'"></avue-form>
        <avue-form :option="menuOption" v-model="menuForm" v-else-if="type==='menu'"></avue-form>
        <avue-form :option="dialogOption" v-model="dialogForm" v-else-if="type==='dialog'"></avue-form>
        <avue-form :option="btnOption" v-model="btnForm" v-else-if="type==='btn'"></avue-form>
      </el-scrollbar>
    </el-drawer>
    <avue-crud :option="option" style="margin-top:30px;" v-model="form" ref="crud" @row-save="rowSave" @row-update="rowUpdate" @row-del="rowDel" @sortable-change="sortableChange" :data="list" :before-open="beforeOpen"></avue-crud>
    <!-- 导入JSON -->
    <el-drawer title="导入JSON" append-to-body :visible.sync="importJsonVisible" size="50%" destroy-on-close>
      <v-json-editor v-model="importJson" height="82vh"></v-json-editor>
      <div class="drawer-foot">
        <el-button size="medium" type="primary" @click="handleImportJsonSubmit">确定</el-button>
        <el-button size="medium" type="danger" @click="importJsonVisible = false">取消</el-button>
      </div>
    </el-drawer>
    <!-- 生成JSON -->
    <el-drawer title="生成JSON" append-to-body :visible.sync="generateJsonVisible" size="50%" destroy-on-close>
      <v-json-editor v-model="widgetFormPreview" height="82vh"></v-json-editor>
      <div class="drawer-foot">
        <el-button size="medium" type="primary" @click="handleCopy">复制</el-button>
        <el-button size="medium" type="danger" @click="generateJsonVisible = false">取消</el-button>
      </div>
    </el-drawer>
    <!-- 预览 -->
    <el-drawer title="预览" size="70%" :visible.sync="drawer">
      <avue-crud :option="codeOption" :data="codeList"></avue-crud>
    </el-drawer>
  </div>
</template>

<script>
import { setStore, getStore } from '@/util/store';
import { option, tableOption, menuOption, dialogOption, btnOption } from './option';
import { pretty } from './js-object-pretty-print';
import { crudDecoder } from './decoder.js';
import VJsoneditor from 'v-jsoneditor';
const Mock = require('mockjs');
export default {
  name: 'crud',
  components: { VJsonEditor },
  data() {
    return {
      drawer: false,
      importJsonVisible: false,
      generateJsonVisible: false,
      widgetFormPreview: {},
      importJson: {},
      title: '',
      box: false,
      type: '',
      form: {},
      activeName: 0,
      tableForm: {},
      tableOption: tableOption,
      menuForm: {},
      menuOption: menuOption,
      dialogForm: {},
      dialogOption: dialogOption,
      btnForm: {},
      btnOption: btnOption,
      option: option,
      list: [],
      optionData: ''
    };
  },
  created() {
    this.list = getStore({ name: 'crud_list' }) || [];
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
    codeList() {
      let list = [];
      //const Mock = window.Mock;
      for (let i = 0; i < 10; i++) {
        let obj = {};
        this.list.forEach(ele => {
          let result = '';
          if (ele.type == 'number') {
            result = Mock.mock({
              'number|1-100': 100
            });
          } else {
            result = Mock.mock('@cname');
          }
          obj[ele.prop] = result;
        });
        list.push(obj);
      }
      return list;
    },
    codeOption() {
      let jsStr = this.code();
      var jsObj = eval('(' + jsStr + ')');
      return jsObj;
    }
  },
  watch: {
    optionData(value) {
      let columnOb = eval('(' + value + ')'); //转换页面js回 option 对象
      let optionObj = crudDecoder.decode(columnOb);
      this.list = optionObj;
    },
    list(value) {
      setStore({ name: 'crud_list', content: value });
    }
  },
  methods: {
    // 生成JSON - 弹窗
    handleGenerateJson() {
      this.widgetFormPreview = this.codeOption;
      this.generateJsonVisible = true;
    },
    // 导入JSON - 弹窗 - 确定
    handleImportJsonSubmit() {
      this.list = this.importJson.column;
      this.importJsonVisible = false;
    },
    // 生成JSON - 弹窗 - 拷贝
    handleCopy() {
      this.$Clipboard({
        text: JSON.stringify(this.widgetFormPreview, null, 2)
      })
        .then(() => {
          this.$message.success('复制成功');
        })
        .catch(() => {
          this.$message.error('复制失败');
        });
    },
    // 清空
    handleClear() {
      if (this.list.length !== 0) {
        this.$confirm('确定要清空吗？', '警告', {
          type: 'warning'
        }).then(() => {
          this.list = [];
        });
      } else this.$message.error('没有需要清空的内容');
    },
    handleAvueDoc() {
      window.open('https://avuejs.com/doc/crud/crud-doc', '_blank');
    },
    handlePreview() {
      this.drawer = true;
    },
    code() {
      function vaild(option = {}, ele = '') {
        const result = option[ele] + '' || '';
        return !result || ele.includes('$');
      }
      let option = {};
      option = this.deepClone(
        Object.assign(this.tableForm, this.menuForm, this.dialogForm, this.btnForm) || {}
      );
      Object.keys(option).forEach(ele => {
        if (vaild(option, ele)) delete option[ele];
      });
      option.column = this.deepClone(this.list || []);
      option.column.forEach(ele => {
        Object.keys(ele).forEach(key => {
          if (vaild(ele, key)) delete ele[key];
        });
      });
      let jsStr = pretty(option, 4, 'PRINT', true); //stringifyObject(option)// JSON.stringify(option, null, 4);
      this.optionData = jsStr;
      return jsStr;
    },
    beforeOpen(done) {
      done();
    },
    open(type, title) {
      this.title = title;
      this.type = type;
      this.box = true;
    },
    sortableChange(oldindex) {
      const oldrow = this.list.splice(oldindex, 1)[0];
      this.list.splice(oldindex, 1, oldrow);
    },
    resetForm(row) {
      Object.keys(row).forEach(ele => {
        if (ele.includes('$')) delete row[ele];
      });
      return row;
    },
    rowDel(row, index) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list.splice(index, 1);
        })
        .catch(() => {});
    },
    rowUpdate(row, index, done) {
      this.list.splice(index, 1, row);
      done();
    },
    rowSave(row, done) {
      this.list.push(row);
      done();
    }
  }
};
</script>
<style lang="scss" scoped>
.crud {
  width: 100%;
  height: 100%;
  background: white;
  padding: 10px;
  box-sizing: border-box;
}
.drawer-foot {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
}
.drawer-foot .el-button {
  flex: 1;
}
</style>
