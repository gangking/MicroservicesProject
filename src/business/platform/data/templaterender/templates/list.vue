<template>
  <div>
    <ibps-crud
      v-if="listConfig"
      ref="crud"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :pk-key="pkKey"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :show-pagination="showPagination"
      :height="height"
      :index-row="indexRow"
      :loading="loading"
      :selection-type="selectionType"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <!--自定义查询条件-->
      <template v-slot:searchForm>
        <search-form
          v-if="listConfig.searchForm"
          ref="searchForm"
          :forms="listConfig.searchForm.forms||[]"
          :size="listConfig.searchForm.size"
          :fuzzy="listConfig.searchForm.fuzzy"
          :inline="listConfig.searchForm.inline"
          :label-width="listConfig.searchForm.labelWidth"
          :item-width="listConfig.searchForm.itemWidth"
        />
      </template>

      <template v-slot:editor="{value}">
        <span v-html="value" />
      </template>
      <template v-slot:dictionary="{value,column,item}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-dictionary
            v-model="value"
            :type-key="column.field_options.dictionary"
            :multiple="column.field_options.multiple"
            :readonly="true"
          />
        </template>
      </template>
      <template v-slot:attachment="{value,column}">
        <ibps-attachment
          v-model="value"
          :download="column.field_options.download||true"
          :readonly="true"
        />
      </template>
      <template v-slot:selector="{value,column,item}">
        <template v-if="$utils.isNotEmpty(column)">
          <ibps-user-selector
            v-model="value"
            :type="column.field_options.selector_type||'user'"
            :multiple="column.field_options.multiple||true"
            :store="column.field_options.store||'id'"
            :disabled="true"
            placeholder
            readonly-text="text"
          />
        </template>
      </template>
    </ibps-crud>
    <data-template-formrender-dialog
      :visible="dialogFormVisible"
      :form-key="formKey"
      :pk-value="pkValue"
      :toolbars="editToolbars"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <file-upload
      :visible="uploadVisible"
      :parentData="listData"
      :dataTemplatField="dataTemplatField"
      :boKey="boKey"
      :allBoKey="allBoKey"
      :columns="listConfig.columns"
      @close="value => uploadVisible = value"
      @upTable="upTable"
    />
  </div>
</template>
<script>
import {
  queryDataTable,
  removeFormData
} from "@/api/platform/data/dataTemplate";
import ActionUtils from "@/utils/action";
import {
  hasButton,
  hasSearchPermission
} from "@/business/platform/data/constants/buttons";
import buttonsConstants from "@/business/platform/data/constants/buttons";
import SearchForm from "../../components/search-form/index.vue";
import DataTemplateFormrenderDialog from "../form/index.vue";
import IbpsDictionary from "@/business/platform/cat/dictionary/select";
import IbpsAttachment from "@/business/platform/file/attachment/selector";
import IbpsUserSelector from "@/business/platform/org/selector";
import FileUpload from "./upload/dialog";
import {
  downSelect,
  templateDown,
  cardCreation
} from "@/api/platform/data/upload";
import fecha from "@/utils/fecha";
import { mapState } from "vuex";
var DATE_FORMATS = {
  date: "yyyy-MM-dd",
  datetime: "yyyy-MM-dd HH:mm:ss",
  time: "HH:mm:ss"
};
export default {
  components: {
    DataTemplateFormrenderDialog,
    SearchForm,
    IbpsDictionary,
    IbpsAttachment,
    IbpsUserSelector,
    FileUpload
  },
  props: {
    dataTemplate: Object,
    template: Object,
    value: [String, Number, Array, Object],
    multiple: Boolean,
    fields: Object
  },
  data() {
    return {
      dataTemplatField: [],
      boKey: "",
      allBoKey: "",
      uploadVisible: false, //上传弹窗
      height: document.body.clientHeight,
      listData: [],
      indexRow: false,
      listConfig: {
        // 工具栏
        toolbars: [],
        columns: [],
        searchForm: null,
        rowHandle: null
      },
      pagination: {
        page: 1,
        limit: 20
      },
      showPagination: false,
      sorts: {},
      loading: false,

      pkValue: "",
      readonly: false,
      dialogFormVisible: false,
      editButtons: [], // 表单按钮
      editToolbars: []
    };
  },
  inject: ["getDataTemplate", "getHeadInfo"],

  computed: {
    // ...mapState("ibps/form", {
    //   boKey: state => state.boKey,
    //   allBoKey: state => state.allBoKey
    // }),
    selectionType() {
      return this.multiple ? "checkbox" : "radio";
    },
    pkKey() {
      return this.dataTemplate.unique || "id_";
    },
    formKey() {
      return this.dataTemplate.attrs
        ? this.dataTemplate.attrs.form_key || ""
        : "";
    },
    allDataTemplate() {
      return this.getDataTemplate();
    },
    headInfo() {
      return this.getHeadInfo();
    }
  },
  watch: {
    '$route': {
      handler(val, oldVal){
        this.loadData();
      },
      deep: true,
      immediate: true
    },
    allDataTemplate: {
      handler(val, oldVal) {
        this.dataTemplatField = val.datasets.map(item => {
          return {
            alias: item.label + "-" + item.name,
            label: item.label,
            name: item.name
          };
        });
        this.boKey = val.datasets[0].objName.slice(2);
        this.allBoKey = val.datasets[0].objName;
      },
      immediate: true
    },
    template: {
      handler(val, oldVal) {
        if (!this.template) {
          return;
        }
        this.listConfig = null;
        this.initParameter();
      },
      immediate: true
    },
    value(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        this.$refs["crud"].clearSelection();
      } else {
        if (!this.multiple) {
          const selectedValue = this.listData.find(data => {
            return data[this.pkKey] === val[this.pkKey];
          });
          this.$refs["crud"].toggleRowSelection(selectedValue);
        } else {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => {
                return item[this.pkKey] === row[this.pkKey];
              });
              if (!index) {
                this.$refs["crud"].toggleRowSelection(row, false);
              }
            });
          } else {
            val.forEach(row => {
              const index = this.listData.find(item => {
                return item[this.pkKey] === row[this.pkKey];
              });
              if (index) {
                this.$refs["crud"].toggleRowSelection(row, true);
              }
            });
          }
        }
      }
    }
  },
  created() {
    // 是否初始化查询数据
    if (
      this.template &&
      this.template.attrs &&
      this.template.attrs.init_query === "N"
    )
      return;
    this.loadData();
  },
  mounted() {
    this.$nextTick(() => {
      this.height = document.body.clientHeight;
    });
    //this.loadData();
  },
  methods: {
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = [];
        if (this.$utils.isNotEmpty(this.value)) {
          this.value.forEach(item => {
            const index = this.listData.find(data => {
              return data[this.pkKey] === item[this.pkKey];
            });
            if (!index) {
              noListData.push(item);
            }
          });
        }
        this.$emit("selected", noListData.concat(selection));
      } else {
        this.$emit("selected", selection);
      }
    },
    upTable() {
      this.loadData();
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true;
      console.log('表格数据获取1')
      queryDataTable(this.getFormatParams())
        .then(response => {
          this.loading = false;
          ActionUtils.handleListData(this, response.data);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {};
      if (this.$refs["searchForm"]) {
        formParams = this.$refs["searchForm"].getSearcFormData() || {};
      }
      const responseData = JSON.parse(JSON.stringify(this.template));
      responseData.datasetKey = this.dataTemplate.datasetKey;
      responseData.unique = this.pkKey;
      formParams["response_data"] = JSON.stringify(responseData);
      // 和分页数据合并
      return ActionUtils.formatParams(formParams, this.pagination, this.sorts);
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
    search() {
      ActionUtils.setPagination(this.pagination);
      ActionUtils.setSorts(this.sorts);
      this.loadData();
    },
    toHump(name) {
      if (name === "id_") return "id";
      let lowStr = name.toLowerCase();
      return lowStr.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    getUrlKey(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    exchangeData(data) {
      let newArr = [];
      let obj = {
        ANLHTXT: "anlhtxt",
        ANLKL: "anlkl",
        ANLN1: "anln1",
        BUKRS: "bukrs",
        CAUFN: "caufn",
        CFBM: "cfbm",
        CFMS: "cfms",
        CFWZ: "cfwz",
        GDLGRP: "gdlgrp",
        GSBER: "gsber",
        id_: "id",
        INVNR: "invnr",
        INVZU: "invzu",
        IP: "ip",
        KFZKZ: "kfzkz",
        KOSTL: "kostl",
        KOSTLV: "kostlv",
        LIEFE: "liefe",
        LIFNR: "lifnr",
        MEINS: "meins",
        MENGE: "menge",
        NAME: "name",
        ORD42: "ord42",
        ORD43: "ord43",
        ORD44: "ord44",
        PK: "pk",
        PROCESS_ID: "processId",
        QUERY_SIGNS: "querySigns",
        RAUMN: "raumn",
        SERNR: "sernr",
        SIGNS: "signs",
        STORT: "stort",
        TENANT_ID: "tenantId",
        TXA50: "txa50",
        TXT50: "txt50",
        UPDATE_BY: "updateBy",
        UPDATE_TIME: "updateTime",
        WERKS: "werks",
        XGBR_AM: "xgbrAm",
        XNEU_AM: "xneuAm",
        ZYLZD1: "zylzd1",
        ZYLZD2: "zylzd2",
        ZYLZD3: "zylzd3",
        ZYLZD4: "zylzd4",
        ZYLZD5: "zylzd5",
        ZZNAME1: "zzname1",
        ZZNAME2: "zzname2",
        ZZRID1: "zzrid1",
        ZZRID2: "zzrid2"
      };
      data.forEach(item => {
        let newList = {};
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element = item[key];
            newList[obj[key]] = element;
            // newList[this.toHump(key)] = element;
          }
        }
        console.log(this.headInfo.docNumber);
        newList.processId = this.headInfo.docNumber;
        newArr.push(newList);
      });
      return newArr;
    },
    handleAction(command, position, selection, data) {
      this.readonly = false;
      switch (command) {
        case "search": // 查询
          this.search();
          break;
        case "resetSearch": // 重置
          this.$refs["searchForm"].resetSearchForm();
          break;
        case "add": // 添加
          this.handleEdit(null, "edit");
          break;
        case "edit": // 编辑
        case "detail": // 明细
          ActionUtils.selectedRecord(selection)
            .then(id => {
              this.handleEdit(id, command);
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

        case "import": // 导入
          this.uploadVisible = true;
          break;

        case "export": // 导出
          let excelObj = {},
            exportArr = [],
            columnKey = [],
            columnVal = [],
            selectData = [];
          columnVal = this.listConfig.columns.map(item => {
            return item.label;
          });
          columnKey = this.listConfig.columns.map(item => {
            return item.prop;
          });
          let boCodeData = this.boKey
            ? this.boKey
            : this.getUrlKey("tableName").slice(2);

          let tableNameData = this.allBoKey
            ? this.allBoKey
            : this.getUrlKey("tableName");

          excelObj.headList = columnVal;
          excelObj.headCodeList = columnKey;
          //excelObj.ids = selection;
          excelObj.boCode = boCodeData;
          excelObj.tableName = tableNameData;
          downSelect(excelObj)
            .then(response => {
              console.log(response);
              if (response) {
                ActionUtils.exportFile(
                  response.data,
                  fecha.formatDate("yyyyMMddHHmmss") + ".xls"
                );
              }
            })
            .catch(req => {
              // this.$message({
              //   showClose: true,
              //   message: "下载失败，请重试",
              //   type: "error"
              // });
              console.log("下载失败");
            });
          break;
        case "template": // 模板下载功能
          let excelObjDown = {};
          excelObjDown.headList = this.listConfig.columns.map(item => {
            return item.label;
          });
          excelObjDown.headCodeList = this.listConfig.columns.map(item => {
            return item.prop;
          });
          excelObjDown.formwork = "1";
          excelObjDown.boCode = boCodeData;
          excelObjDown.tableName = tableNameData;
          downSelect(excelObjDown)
            .then(response => {
              console.log(response);
              if (response) {
                ActionUtils.exportFile(
                  response.data,
                  fecha.formatDate("yyyyMMddHHmmss") + ".xls"
                );
              }
            })
            .catch(req => {
              this.$message({
                showClose: true,
                message: "下载失败，请重试",
                type: "error"
              });
              console.log("下载失败");
            });
          break;
        case "createNew":
          let createData = this.$refs.crud.$refs.elTable.selection;
          if (!selection || selection.length == 0) {
            this.$message({
              message: "请选择记录!",
              type: "warning"
            });
            return;
          }
          console.log(createData, "createDatacreateDat数据");
          let exchange = this.exchangeData(createData);
          cardCreation(exchange).then(res => {
            if (res.state === 200) {
              this.$message({
                message: "资产创建成功!",
                type: "success"
              });
              this.loadData();
            } else if (res.state === 500) {
              this.$message({
                message: res.date.msg,
                type: "error"
              });
            }
          });

          break;
        case "custom": // 自定义按钮
          // TODO:
          break;
        default:
          break;
      }
    },
    initParameter() {
      const functionButtons = this.template.buttons
        ? this.template.buttons.function_buttons || []
        : [];
      // 工具栏
      const toolbarButtons = [];
      // 管理列
      const manageButtons = [];

      // 功能按钮
      functionButtons.forEach(rf => {
        const btn = this.buildButton(rf);
        // 查询列默认是顶部
        if (hasSearchPermission(rf.button_type) && !rf.position) {
          rf.position = "toolbar";
        }
        // if (rf.button_type === 'search') { isHasSeach = true }
        // 顶部按钮
        if (hasButton(rf.button_type, "toolbar", rf.position)) {
          toolbarButtons.push(btn);
        }
        // // 查询按钮
        // if (hasButton(rf.button_type, 'search', rf.position)) {
        //   this.response_search_buttons.add(this.getButtonModel(rf))
        // }

        // 管理列按钮
        if (hasButton(rf.button_type, "manage", rf.position)) {
          manageButtons.push(btn);
        }
      });
      let rowHandle = null;

      if (this.$utils.isNotEmpty(manageButtons)) {
        rowHandle = {
          actions: manageButtons
        };
      }

      // 查询字段
      const searchForms = [];
      const queryColumns = this.template.query_columns || [];
      queryColumns.forEach(column => {
        if (column.common === "N") return;
        searchForms.push(this.buildSearchForm(column));
      });

      // 显示字段
      const columns = [];

      this.setDisplayColumns(this.template.display_columns || [], columns);

      this.listConfig = {
        toolbars: toolbarButtons,
        columns: columns,
        rowHandle: rowHandle,
        searchForm:
          searchForms.length > 0
            ? {
                forms: searchForms
              }
            : null
      };
      // 分页
      this.showPagination = this.template.attrs
        ? this.template.attrs.need_page === "Y"
        : true;
      this.pagination.limit = this.template.attrs
        ? parseInt(this.template.attrs.page_size, 10) || 20
        : 20;

      this.indexRow = this.template.attrs
        ? this.template.attrs.indexRow || false
        : false;
      this.editButtons = this.template.buttons
        ? this.template.buttons.edit_buttons || []
        : [];
    },
    /**
     * 显示字段
     */
    setDisplayColumns(displayColumns, columns) {
      displayColumns.forEach(column => {
        columns.push(this.buildDisplayColumn(column));
      });
      return columns;
    },

    /**
     * 判断参数是否是其中之一
     */
    oneOf: function(obj, validList, key, key1) {
      for (let i = 0; i < validList.length; i++) {
        if (obj[key] === validList[i][key1]) {
          return true;
        }
      }
      return false;
    },
    /**
     * 构建按钮
     */
    buildButton(rf) {
      const defaultButton = buttonsConstants[rf.button_type] || {};
      return {
        key: rf.button_type,
        label: rf.label || defaultButton.style,
        icon: rf.icon ? "ibps-icon-" + rf.icon : defaultButton.icon,
        type: rf.style || defaultButton.type
      };
    },
    /**
     * 转换字段
     */
    convertField: function(column) {
      const field = this.fields[column.name] || null;
      const same = !(column["same"] && column["same"] === "N");
      let fieldType = same
        ? field
          ? field["field_type"] || "text"
          : "text"
        : column["field_type"] || "text";
      const fieldOptions = same
        ? field
          ? field["field_options"] || {}
          : {}
        : column["field_options"] || {};
      const dataType = field ? field["type"] || "varchar" : "varchar";
      // 字段是日期类型
      if (
        (dataType === "date" ||
          dataType === "timestamp" ||
          dataType === "datetime" ||
          dataType === "currentTime" ||
          dataType === "currentDate") &&
        fieldType !== "datePicker" &&
        fieldType !== "dateRange"
      ) {
        fieldType = "datePicker";
      }
      if (fieldType === "datePicker" || fieldType === "dateRange") {
        var datefmtType = fieldOptions["datefmt_type"];
        if (datefmtType !== "custom") {
          fieldOptions["datefmt"] =
            DATE_FORMATS[datefmtType] || "yyyy-MM-dd HH:mm:ss";
        }
      }

      // 处理当前用户，当前组织控件
      if (fieldType === "currentUser" || fieldType === "currentOrg") {
        fieldType = "selector";
      }

      column["field_type"] = fieldType;
      column["field_options"] = fieldOptions;
      column["data_type"] = dataType;
      return column;
    },
    buildOptions(options = []) {
      const rtn = [];
      options.forEach(option => {
        rtn.push({
          value: option.val,
          label: option.label
        });
      });
      return rtn;
    },
    /**
     * 构建查询条件
     */
    buildSearchForm(column) {
      const field = this.convertField(column);
      let querySuffix = "SL";
      if (field["data_type"] === "number") {
        querySuffix = "N";
      }
      let searchColumn = {
        label: field.label
      };
      // 控件类型
      const fieldType = field["field_type"];
      const fieldOptions = field["field_options"];

      if (
        fieldType === "radio" ||
        fieldType === "checkbox" ||
        fieldType === "select"
      ) {
        querySuffix = fieldType !== "checkbox" ? "S" : "SL";
        const prop = `Q^${field.name}^${querySuffix}`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: "select",
          options: this.buildOptions(
            fieldOptions && fieldOptions.options ? fieldOptions.options : []
          )
        });
      } else if (fieldType === "date") {
        const prop = `Q^${field.name}^D`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: "date",
          dateType: fieldOptions.datefmt_type
            ? fieldOptions.datefmt_type
            : "date"
        });
      } else if (fieldType === "datePicker" || fieldType === "dateRange") {
        searchColumn = Object.assign(searchColumn, {
          prop: [`Q^${field.name}^DL`, `Q^${field.name}^DG`],
          modelValue: `Q^${field.name}^${querySuffix}`,
          fieldType: "daterange"
        });
      } else if (fieldType === "dictionary") {
        const prop = `Q^${field.name}^SL`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          fieldType: fieldType,
          modelValue: prop,
          placeholder: fieldOptions.placeholder || "请选择",
          field_options: fieldOptions
        });
      } else if (fieldType === "selector") {
        const prop = `Q^${field.name}^SL`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          fieldType: fieldType,
          modelValue: prop,
          placeholder: fieldOptions.placeholder || "请选择",
          selectorType: fieldOptions.selector_type || "user",
          field_options: fieldOptions
        });
      } else if (fieldType === "customDialog") {
        const prop = `Q^${field.name}^S`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        });
      } else if (fieldType === "linkdata") {
        const prop = `Q^${field.name}^S`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          modelValue: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        });
      } else if (fieldType === "address") {
        const prop = `Q^${field.name}^S`;
        searchColumn = Object.assign(searchColumn, {
          prop: prop,
          fieldType: fieldType,
          field_options: fieldOptions
        });
      } else {
        searchColumn = Object.assign(searchColumn, {
          prop: `Q^${field.name}^${querySuffix}`,
          modelValue: `Q^${field.name}^${querySuffix}`
        });
      }

      return searchColumn;
    },
    buildDisplayColumn(column) {
      const field = this.convertField(column);
      const displayColumn = {
        prop: field.name,
        label: field.label,
        align: field.align,
        sortable: field.sortable
      };
      // 控件类型
      const fieldType = field["field_type"];
      const fieldOptions = field["field_options"];
      if (
        fieldType === "radio" ||
        fieldType === "checkbox" ||
        fieldType === "select"
      ) {
        displayColumn.options = this.buildOptions(
          fieldOptions && fieldOptions.options ? fieldOptions.options : []
        );
      } else if (fieldType === "datePicker" || fieldType === "dateRange") {
        displayColumn.dateFormat = fieldOptions["datefmt"]
          ? fieldOptions["datefmt"]
          : "yyyy-MM-dd HH:mm:ss";
        displayColumn.origDateFormat = fieldOptions["datefmt"]
          ? fieldOptions["datefmt"]
          : "yyyy-MM-dd HH:mm:ss";
      } else if (
        fieldType === "editor" ||
        fieldType === "attachment" ||
        fieldType === "dictionary" ||
        fieldType === "selector"
      ) {
        displayColumn.slotName = fieldType;
        displayColumn.field_options = fieldOptions;
      }

      return displayColumn;
    },

    /**
     * 添加、编辑表单
     */
    handleEdit(pkValue, action) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning("请绑定表单");
        return;
      }
      this.readonly = action === "detail";
      const editToolbars = [];
      this.editButtons.forEach(rf => {
        const btn = this.buildButton(rf);
        // 编辑页顶部按钮
        if (hasButton(rf.button_type, action, rf.position)) {
          editToolbars.push(btn);
        }
      });
      this.editToolbars = editToolbars;
      this.pkValue = pkValue || "";
      this.dialogFormVisible = true;
    },
    /**
     * 删除表单
     */
    handleRemove(ids) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning("请绑定表单");
        return;
      }
      removeFormData({
        formKey: this.formKey,
        ids: ids
      })
        .then(response => {
          ActionUtils.removeSuccessMessage();
          this.search();
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped lang="scss" >
/deep/.el-form-item__content .el-input__inner {
  width: 215px;
}
</style>

