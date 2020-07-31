<template>
  <div>
    <!-- <ibps-selector
      v-bind="$props"
      :items="items"
      @click="handleSelectorClick"
      @remove="handleSelectorRemove"
    />-->
    <div class="customDialog" @click="handleSelectorClick">
      <el-input :placeholder="placeholder" ref="custom" :disabled="isRead" v-model="selectData">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <data-template-dialog
      :visibleCustom.sync="selectorVisible"
      :remote="remote"
      :model="model"
      :fieldOptions="fieldOptions"
      @close="visible=>selectorVisible =visible"
    />
  </div>
</template>
<script>
import { getByKey } from "@/api/platform/data/dataTemplate";
import { valueEquals } from "element-ui/src/utils/util";
import emitter from "element-ui/src/mixins/emitter";
import DataTemplateDialog from "./preview/dialog";
import IbpsSelector from "@/components/ibps-selector/selector";

export default {
  components: {
    DataTemplateDialog,
    IbpsSelector
  },
  mixins: [emitter],
  props: {
    // value: {
    //   // value
    //   type: [String, Number, Object, Array],
    //   default: ""
    // },
    // // 存储类型 ,
    // // ①、id:只存储id 字符串，
    // // ②、json： json字符串,
    // store: {
    //   type: String,
    //   default: 'id',
    //   validator: function(value) {
    //     return ['id', 'json'].indexOf(value) !== -1
    //   }
    // },
    // storeSeparator: {// 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
    //   type: String,
    //   default: ','
    // },
    // placeholder: {// 输入框占位文本
    //   type: String,
    //   default: '请选择'
    // },
    // multiple: { // 是否多选
    //   type: Boolean,
    //   default: false
    // },
    // disabled: { // 禁用
    //   type: Boolean,
    //   default: false
    // },
    // icon: {
    //   type: String,
    //   default: 'search-plus'
    // },
    // templateKey: {
    //   type: String,
    //   require: true
    // }

    remote: Object,
    isDisabled: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number, Array, Object],
      default: ""
    },
    model: {
      type: Object,
      default: () => {}
    },
    fieldOptions: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      placeholder: "请选择",
      selectData: "",
      isRead: false, //只读状态
      dataTemplate: {},
      labelKey: "",
      valueKey: "",
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      cacheData: {},
      bindIdValue: ""
    };
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) return [];
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data[this.labelKey];
        });
      } else {
        return [this.selectorValue[this.labelKey]];
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectData = val;
      },
      immediate: true
    },
    model: {
      handler(val, oldVal) {
        if (val) {
          this.placeholder = val.placeholder;
        }
      },
      immediate: true
    },
    readonly: {
      handler(val, oldVal) {
        this.isRead = val;
        if (val) {
          this.placeholder = "";
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      if (this.temhis.templateKey) {
        getByKey({
          dataTemplateKey: this.temhis.templateKey
        })
          .then(response => {
            this.dataTemplate = this.$utils.parseData(response.data);
            this.initDataTemplate();
          })
          .catch(() => {});
      }
    },
    initDataTemplate() {
      this.valueKey = this.dataTemplate.unique;
      const template = this.dataTemplate.templates[0];
      // TODO: 根据设置的作为标题
      this.labelKey = template.result_columns
        ? template.result_columns[0].name
        : "";
    },
    /**
     * 初始化数据
     */
    initData() {
      const data = this.getArrayValue(this.value);
      this.selectorValue = this.multiple ? [] : {};
      if (this.$utils.isEmpty(data)) {
        return;
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.setSelectorValue(v);
        } else {
          this.getDataInfo(v);
        }
      });
    },
    setCacheData() {
      if (this.$utils.isEmpty(this.selectorValue)) return;
      const data = this.multiple ? this.selectorValue : [this.selectorValue];
      data.forEach(v => {
        this.cacheData[v[this.valueKey]] = v;
      });
    },
    setSelectorValue(v) {
      if (this.multiple) {
        this.selectorValue.push(this.cacheData[v]);
      } else {
        this.selectorValue = JSON.parse(JSON.stringify(this.cacheData[v]));
      }
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value, bindId) {
      if (this.$utils.isEmpty(value)) {
        return [];
      }
      if (this.store === "json") {
        // json
        try {
          const data = this.$utils.parseData(value);
          return data.map(d => {
            return d[this.valueKey];
          });
        } catch (error) {
          console.warn(error);
          return [];
        }
      } else if (this.store === "id") {
        // id
        return value.split(this.storeSeparator);
      } else if (this.store === "bind") {
        // 绑定id
        if (this.$utils.isEmpty(bindId)) {
          return [];
        }
        return bindId.split(this.storeSeparator);
      } else {
        // array
        return value.map(d => {
          return d[this.valueKey];
        });
      }
    },
    getStoreValue(value) {
      const res = [];
      if (this.store === "json") {
        // json
        if (this.$utils.isEmpty(value)) {
          return "";
        }
        if (this.multiple) {
          value.forEach(v => {
            const o = {};
            o[this.valueKey] = v[this.valueKey];
            o[this.labelKey] = v[this.labelKey];
            res.push(o);
          });
          return JSON.stringify(res);
        } else {
          const o = {};
          o[this.valueKey] = value[this.valueKey];
          o[this.labelKey] = value[this.labelKey];
          return JSON.stringify(o);
        }
      } else if (this.store === "id") {
        // id
        if (this.$utils.isEmpty(value)) {
          return "";
        }
        if (this.multiple) {
          value.forEach(v => {
            res.push(v[this.valueKey]);
          });
        } else {
          res.push(value[this.valueKey]);
        }
        return res.join(this.storeSeparator);
      } else if (this.store === "bind") {
        // 绑定id
        const res = [];
        const bindIdValue = [];
        value.forEach(v => {
          bindIdValue.push(v[this.valueKey]);
          res.push(v[this.labelKey]);
        });
        this.bindIdValue = bindIdValue.join(this.storeSeparator);

        return res.join(this.storeSeparator);
      } else {
        // 数组 array
        return value || [];
      }
    },
    getValue() {
      return this.getStoreValue(this.selectorValue);
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      // TODO:
    },
    // ===================事件处理=========

    handleSelectorClick() {
      if (this.isRead) return;
      this.selectorVisible = true;
      this.$refs.custom.blur();
      // this.initData()
    },
    handleSelectorRemove(index) {
      if (this.multiple) {
        this.selectorValue.splice(index, 1);
      } else {
        this.selectorValue = {};
      }
      this.handleInput();
    },

    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case "confirm": // 确定
          this.selectorVisible = false;
          this.selectorValue = data;
          this.setCacheData(); // 设置缓存数据
          this.handleInput();
          break;
        // TODO:自定义
      }
    },
    handleInput() {
      this.$emit("input", this.getValue());
    }
  }
};
</script>
<style scoped>
.customDialog {
  cursor: pointer;
}
</style>
