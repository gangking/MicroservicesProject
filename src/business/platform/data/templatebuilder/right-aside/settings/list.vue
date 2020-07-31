<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">列表</div>
      <div class="panel-body">
        <list-attr :data="template" @input="handleAttrs" />
      </div>
    </div>
    <!--查询字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="queryDefaultValue"
      title="查询字段"
      prop="query_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <query-column :data="scope.data" />
      </div>
    </column>
    <!--显示字段-->
    <column
      :template="template"
      :fields="fields"
      :default-value="displayDefaultValue"
      title="显示字段"
      prop="display_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <display-column :data="scope.data" />
      </div>
    </column>
    <!--过滤条件-->
    <!-- <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      title="过滤条件"
      prop="filter_conditions"
      width="80%"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <filter-condition :data="scope.data" :fields="fields" />
      </div>
    </column>-->
    <!--排序字段-->
    <column
      :template="template"
      :fields="fields"
      title="排序字段"
      prop="sort_columns"
      @input="handleColumns"
    />
    <!--返回字段-->
    <!-- <column
      :template="template"
      :fields="fields"
      title="返回字段"
      :default-value="resultDefaultValue"
      prop="result_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <result-column :data="scope.data" />
      </div>
    </column>-->
    <!--列表-功能按钮-->
    <button-template
      :template="buttons"
      :types="functionButtonTypes"
      :default-value="fucntionButtonDefaultValue"
      title="列表-功能按钮"
      prop="function_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="function" />
      </div>
    </button-template>
    <!--编辑页-功能按钮-->
    <button-template
      :template="buttons"
      :types="editButtonTypes"
      title="编辑页-功能按钮"
      prop="edit_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="edit" />
      </div>
    </button-template>
    <!-- 扩展属性 -->
    <!-- <ext-attrs /> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import ListAttr from "../components/list-attr";
import Column from "../components/column";
import ButtonTemplate from "../components/button";
import QueryColumn from "../editors/query-column";
import DisplayColumn from "../editors/display-column";
// import FilterCondition from '../editors/filter-condition'
// import ResultColumn from '../editors/result-column'
import EditorButton from "../editors/editor-button";
// import ExtAttrs from '../components/ext-attrs'

export default {
  components: {
    ListAttr,
    Column,
    ButtonTemplate,
    QueryColumn,
    DisplayColumn,
    // FilterCondition,
    // ResultColumn,
    EditorButton
    // ExtAttrs
  },
  props: {
    template: {
      // 模版
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      dialogRightsVisible: false,
      queryDefaultValue: {
        rights: [{ type: "all" }],
        common: "Y",
        same: "Y",
        field_type: "input",
        field_options: {
          selector_type: "user",
          datefmt_type: "date",
          datefmt: "yyyy-MM-dd",
          options: [
            {
              value: "",
              label: ""
            }
          ],
          dictionary: "",
          dictionary_name: ""
        }
      },
      queryRules: {
        name: [{ required: true, message: this.$t("validate.required") }]
      },
      displayDefaultValue: {
        rights: [{ type: "all" }],
        noRightStyle: "",
        align: "left",
        sortable: false,
        same: "Y",
        fieldType: "input",
        field_options: {
          datefmt_type: "date",
          datefmt: "yyyy-MM-dd",
          selector_type: "user",
          number_type: "orig",
          options: [
            {
              value: "",
              label: ""
            }
          ],
          store: "id",
          store_mode: "json",
          dictionary: "",
          dictionary_name: ""
        }
      },
      resultDefaultValue: {
        rights: [{ type: "all" }],
        same: "Y",
        fieldType: "orig",
        field_options: {
          datefmt_type: "date",
          datefmt: "yyyy-MM-dd",
          selector_type: "user",
          options: [
            {
              value: "",
              label: ""
            }
          ],
          store: "json",
          dictionary: "",
          dictionary_name: ""
        }
      },
      filterConditionDefaultValue: {
        rights: [{ type: "all" }]
      },
      fucntionButtonDefaultValue: {
        rights: [{ type: "all" }],
        position: "all"
      },
      functionButtonTypes: [
        "search",
        "resetSearch",
        "add",
        "remove",
        "edit",
        "detail",
        "export",
        "import",
        "transfer",
        "createNew",
        "template"
      ],
      // ['search', 'resetSearch', 'moreSearch', 'add',	'remove', 'edit', 'detail', 'print', 'import', 'export', 'sefStartFlow', 'custom'],
      editButtonTypes: ["close", "save"]
      // ['close', 'save', 'print', 'sefStartFlow', 'custom']
    };
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    fields() {
      const fields = JSON.parse(JSON.stringify(this.datasets));
      return fields.filter(d => {
        return d.parentId !== "0";
      });
    },
    buttons() {
      return this.template.buttons || {};
    }
  },
  methods: {
    handleAttrs(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template));
      if (this.$utils.isEmpty(curTemplate.attrs)) {
        curTemplate.attrs = {};
      }
      curTemplate.attrs[key] = data;
      this.$emit("update", curTemplate);
    },
    handleColumns(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template));
      curTemplate[key] = data;
      this.$emit("update", curTemplate);
    },
    handleButtons(key, data) {
      const curTemplate = JSON.parse(JSON.stringify(this.template));
      if (!curTemplate.buttons) {
        curTemplate.buttons = {};
      }
      curTemplate.buttons[key] = data;
      this.$emit("update", curTemplate);
    },
    handleRights(key) {
      this.dialogRightsVisible = true;
    },
    handleRightsConfirm(data) {}
  }
};
</script>
