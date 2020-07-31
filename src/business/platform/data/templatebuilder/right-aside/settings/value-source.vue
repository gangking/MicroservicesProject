<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">值来源</div>
      <div class="panel-body" />
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
        <query-column :scope="scope" />
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
        <filter-condition :scope="scope" :fields="fields" />
      </div>
    </column>-->
    <!--权限过滤-->
    <column
      :template="template"
      :fields="fields"
      :default-value="filterConditionDefaultValue"
      title="权限过滤"
      prop="authority_filters"
      width="80%"
      @input="handleColumns"
    >
      <!-- <div slot="edit" slot-scope="scope">
        <authority-filter :scope="scope" :fields="fields"/>
      
      </div>-->
    </column>

    <!--排序字段-->
    <column
      :template="template"
      :fields="fields"
      title="排序字段"
      prop="sort_columns"
      @input="handleColumns"
    />
    <!--返回字段-->
    <column
      :template="template"
      :fields="fields"
      title="返回字段"
      :default-value="resultDefaultValue"
      prop="result_columns"
      @input="handleColumns"
    >
      <div slot="edit" slot-scope="scope">
        <result-column :scope="scope" />
      </div>
    </column>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Column from "../components/column";
import QueryColumn from "../editors/query-column";
import FilterCondition from "../editors/filter-condition";
import authorityFilter from "../editors/filter-condition";

import ResultColumn from "../editors/result-column";

export default {
  components: {
    Column,
    QueryColumn,
    FilterCondition,
    ResultColumn,
    authorityFilter
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
      pageSizeOptions: [10, 20, 50, 100],
      queryDefaultValue: {
        rights: [{ type: "all" }],
        common: "Y",
        same: "Y",
        field_options: {
          fieldType: "text",
          selectType: "user",
          datefmtType: "data",
          enumGroup: [
            {
              date: "",
              name: ""
            }
          ],
          datafmt: "",
          dicName: ""
        }
      },
      queryRules: {
        name: [{ required: true, message: this.$t("validate.required") }]
      },
      resultDefaultValue: {
        rights: [{ type: "all" }],
        same: "Y",
        field_options: {
          fieldType: "orig",
          datefmtType: "data",
          selectType: "user",
          enumGroup: [
            {
              date: "",
              name: ""
            }
          ],
          datafmt: "",
          store: "json",
          dicName: ""
        }
      },
      filterConditionDefaultValue: {
        rights: [{ type: "all" }]
      }
    };
  },
  watch: {
    fields: {
      handler: function(val, oldVal) {
        console.log(val);
      },
      immediate: true
    },
    template: {
      handler: function(val, oldVal) {
        if (!val.authority_filters) {
          let arr = [];
       //  .authority_filters = arr;
       //   this.$set(this.template,'authority_filters',arr)
        }
      },
      immediate: true
    }
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
    attrs: {
      get() {
        return this.template.attrs || {};
      },
      set(value) {
        console.info(value);
      }
    },
    buttons() {
      return this.template.buttons || {};
    }
  },
  methods: {
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
