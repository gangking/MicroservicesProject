<template>
  <el-select
    v-model="selectData"
    style="width:100%;"
    filterable
    remote
    clearable
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :disabled="isRead"
    :loading="loading"
    @change="selectValue"
    @focus="selectFocus"
  >
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { mapMutations } from "vuex";
import _ from "lodash";
import {
  queryRemoteData,
  getRemoteParameter
} from "@/api/platform/data/dataset";
import { queryDataTable } from "@/api/platform/data/dataTemplate";
import ActionUtils from "@/utils/action";
export default {
  props: {
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
      chianRequired: [], //必填关联表单的字段
      isParameter: false,
      formField: "", // 远程搜索 关联的表单字段名
      formFieldValue: "", // 表单的值
      requiredText: "", // 必填字段
      placeholder: "请输入关键词", // 输入关键词
      isRead: false, // 是否只读
      allOptions: [], // 第一次搜索的全部数据
      count: 0, // 计数
      options: [],
      // value: [],
      selectData: "",
      listData: [],
      loading: false,
      parameters: {
        parameters: [{ key: "dataTemplateId", value: "" }],
        requestPage: { pageNo: 1, limit: 100, totalCount: null },
        sorts: []
      },
      copyParameters: {},
      condition: [] // 关联的查询条件
    };
  },
  inject: ["dynamic"],
  computed: {},
  watch: {
    remote: {
      handler(obj, oldVal) {
        // console.log(obj, "表单所有数据更新");
        if (this.model) {
          // setTimeout(() => {
          //   this.requiredText = this.isRequired();

          //   // console.log(this.requiredText);
          // }, 10);

          this.requiredText = this.isRequired();
        }
        this.getFixvalue();
      },
      immediate: true,
      deep: true
    },
    value: {
      handler(val, oldVal) {
        this.selectData = val;
        let emptyText = "";
        if (this.model.isAuto && this.model.isUpdate) {
          setTimeout(() => {
            this.remoteMethod(emptyText, false);
          }, 20);
        }
      },
      immediate: true
    },
    fieldOptions: {
      handler(val, oldVal) {
        console.log("fieldOptions", val);
      },
      immediate: true
    },
    requiredText: {
      handler(val, oldVal) {
        if (val == "可以搜索") {
          const emptyText = "";
          this.options = []; //先清空值
          this.remoteMethod(emptyText, false);
        }
      },
      deep: true
      // immediate: true
    },
    model: {
      handler(val, oldVal) {
        if (val) {
          // console.log('this.model', val)
          //this.$set(this.parameters, "dataTemplateId", val.search_url); //changed by dingdx 2020-04-11
          this.parameters.parameters[0].value = val.search_url;
          // this.isRead = val.read_rights;
          this.placeholder = val.placeholder;
          if (this.model.data_condition.length > 0) {
            this.parameters.parameters.splice(1);
            const parame = this.getParameters(this.model.data_condition);
            if (parame.length > 0) {
              parame.forEach((i, index) => {
                this.parameters.parameters.push({
                  key: "Q^" + i.name + "^S",
                  value: i.value
                });
              });
            }
          } else {
            this.parameters.parameters.splice(1);
            this.parameters.parameters.push({
              key: "Q^" + this.model.remote_name + "^S",
              value: ""
            });
          }
          const emptyText = "";
          this.remoteMethod(emptyText, false);
        }
      },
      deep: true
      // immediate: true
    },
    readonly: {
      handler(val, oldVal) {
        this.isRead = val;
        if (val) {
          this.placeholder = "";
        }
      },
      immediate: true
    },
    isParameter: {
      handler(val, oldVal) {
        if (val) {
          // console.log("参数加载完成");
        }
      }
    }
  },
  mounted() {
    // this.loadParameter()
    this.dynamic.$on("init-response", this.loadParameter);
  },
  destroyed() {
    this.dynamic.$off("init-response", this.loadParameter);
  },
  methods: {
    selectFocus(event) {
      if (!this.isParameter) return;
      //  if (this.readonly) return;
      const emptyText = "";

      this.options = []; //先清空值
      this.remoteMethod(emptyText, true);
    },
    /* 根据值来源选择id  获取参数 */
    loadParameter() {
      if (!this.model) return;
      //this.$set(this.parameters, "dataTemplateId", this.model.search_url); //changed by dingdx 2020-04-11
      this.parameters.parameters[0].value = this.model.search_url;
      if (!this.isParameter) {
        if (this.model.data_condition.length > 0) {
          this.parameters.parameters.splice(1);
          const parame = this.getParameters(this.model.data_condition);
          if (parame.length > 0) {
            parame.forEach((i, index) => {
              this.parameters.parameters.push({
                key: "Q^" + i.name + "^S",
                value: i.value
              });
            });
          }
        } else {
          this.parameters.parameters.splice(1);
          this.parameters.parameters.push({
            key: "Q^" + this.model.remote_name + "^S",
            value: ""
          });
        }
      }
      // 添加字段，固定值
      this.getFixvalue();
      // 获取表单默认值
      this.getFormChian();
      // console.log(this.parameters);
      // 获取参数完成
      this.isParameter = true;
      // });
    },
    /* 获取联动条件查询参数 */
    getParameters(data) {
      const list = data.map(item => {
        if (item.select) {
          return {
            selectKey: item["select"],
            value: item["fix_value"],
            name: item["name"]
          };
        } else {
          if (item.fix_value != "") {
            return {
              selectKey: item["select"],
              value: item["fix_value"],
              name: item["name"]
            };
          }
        }
      });
      return list.filter(item => item);
    },
    /* 远程搜索方法 */
    remoteMethod(queryValue, isUpdate) {
      // console.log(this.requiredText, "this.requiredText搜索");
      if (this.requiredText == "搜索为空") {
        this.options = [];
        return;
      }
      //固定参数
      var parmas = "";
      for (const list of this.model.data_chain) {
        if (list.status) {
          var item = list.name;
          parmas += item + ",";
        }
      }
      parmas = parmas.substr(0, parmas.length - 1);
      this.parameters.extraParameters = {
        inputValue: queryValue,
        fuzzyFields: parmas
      };
      //修正模糊查询参数
      if (parmas.length != 0 && queryValue.length != 0) {
        let deleteNum = this.parameters.parameters.findIndex(item => {
          return item.key == `Q^${this.model.remote_name}^S`;
        });
        if (deleteNum > -1) {
          this.parameters.parameters.splice(deleteNum, 1);
        }
      }
      // 给参数赋值
      this.parameters.parameters.forEach((item, index) => {
        const exchangeKey = `Q^${this.model.remote_name}^S`;
        if (exchangeKey == item.key) {
          item["value"] = queryValue;
        }
      });
      this.count++;
      if (_.isEqual(this.parameters, this.copyParameters) && !isUpdate) {
        return;
      } else {
        this.copyParameters = JSON.parse(JSON.stringify(this.parameters));
      }
      queryDataTable(this.parameters)
        .then(response => {
          this.listData = response.data.dataResult;
          this.options = this.listData.map(item => {
            //console.log(this.model.remote_name);
            let splicingText = "";
            for (const a in item) {
              for (const list of this.model.data_chain) {
                if (list.status) {
                  splicingText += item[list.name] + " ";
                }
              }
              const showRes = splicingText.slice(0, splicingText.length - 1);
              return {
                value: item[this.model.remote_name],
                label: showRes
              };
              splicingText = "";
            }
          });

          if (this.formFieldValue) {
            // console.log(this.formFieldValue, "this.formFieldValue");
            const chain = this.exchangeChain();
            const currentObj = this.listData[0];
            //  console.log(currentObj, "currentObj");
            const newObj = {};
            for (const key in currentObj) {
              if (currentObj.hasOwnProperty(key)) {
                const element = currentObj[key];
                for (const a in chain) {
                  if (key == a) {
                    newObj[chain[a]] = element;
                  }
                }
              }
            }
            this.$emit("input", this.formFieldValue);
            // console.log(newObj, "newObj");
            this.chainForm(newObj);
          } else {
            if (
              (this.model.isAuto && !this.value) ||
              (this.model.isAuto && this.model.isUpdate)
            ) {
              const chain = this.exchangeChain();
              const currentObj = this.listData[0];
              console.log(currentObj, "currentObj");
              const newObj = {};
              for (const key in currentObj) {
                if (currentObj.hasOwnProperty(key)) {
                  const element = currentObj[key];
                  for (const a in chain) {
                    if (key == a) {
                      newObj[chain[a]] = element;
                    }
                  }
                }
              }
              console.log(newObj, "要改变的值newObj");
              this.chainForm(newObj);
            }
          }
          // console.log("allOptions", this.allOptions);
        })
        .catch(() => {});
    },

    selectValue(val) {
      // if (this.readonly) return;
      // console.log(val);
      // console.log(this.listData);
      // this.selectData = val;
      const currentVal = this.listData.filter(item => {
        return item[this.model.remote_name] == val;
      });
      const chain = this.exchangeChain();
      const currentObj = currentVal[0];
      const newObj = {};
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          const element = currentObj[key];
          for (const a in chain) {
            if (key == a) {
              newObj[chain[a]] = element;
            }
          }
        }
      }
      //清除表单不需要的值
      // this.clearDefault();
      let clearObj = this.clearDefault();
      for (const list in clearObj) {
        const element = clearObj[list];
        newObj[list] = element;
      }

      this.$emit("input", val);
      // console.log(newObj, "下拉联动的值88888888");
      this.chainForm(newObj);
    },
    // 获取固定值值
    getFixvalue() {
      for (const objKey in this.remote) {
        this.model.data_condition.forEach(item => {
          if (item.select == objKey) {
            const selectValue = this.remote[objKey];

            this.parameters.parameters.forEach((i, index) => {
              const exchangeKey = `Q^${item.name}^S`;
              // console.log(exchangeKey);
              if (exchangeKey == i.key) {
                // console.log("进来赋值", selectValue);
                //  i["value"] = selectValue;

                this.parameters.parameters[index]["value"] = selectValue;
              }
            });
            // console.log(this.parameters.parameters);
          }
        });
      }
    },
    // 必有值判断
    isRequired() {
      if (this.model.data_condition.length > 0) {
        const fieldArr = [];
        // console.log(this.model.data_condition, "this.model.data_condition");
        this.model.data_condition.forEach(item => {
          if (item.required && item.required == true) {
            fieldArr.push(item.select);
          }
        });
        // console.log(fieldArr);
        const filterArr = fieldArr.filter(item => item);
        this.chianRequired = filterArr;
        if (filterArr.length > 0) {
          for (const i of filterArr) {
            for (const key in this.remote) {
              if (this.remote.hasOwnProperty(key)) {
                if (i == key) {
                  if (this.remote[key] == "") {
                    return "搜索为空";
                  }
                }
              }
            }
          }
        } else if (filterArr.length == 0) {
          return "可以搜索";
        }
        return "可以搜索";
      }
      return "可以搜索";
    },
    // 表单的默认值，带动联动搜索
    getFormChian() {
      this.model.data_condition.forEach(item => {
        if (item.name == this.model.remote_name) {
          this.formField = item.select;
        }
      });
      this.formFieldValue = this.remote[this.formField];
      if (this.formFieldValue) {
        this.remoteMethod(this.formFieldValue, false);
      } else if (this.selectData) {
        this.remoteMethod(this.selectData, false);
      } else {
        if (this.model.isAuto) {
          const emptyText = "";
          this.remoteMethod(emptyText, false);
        }
      }
    },

    // 转换值
    exchangeChain(data) {
      const hasFormValue = [];
      for (const key in this.remote) {
        if (this.remote.hasOwnProperty(key)) {
          const element = this.remote[key];
          if (element) {
            hasFormValue.push(key);
          }
        }
      }
      // console.log("所有有值的", hasFormValue);
      const deletefield = [];
      for (const list of this.model.data_chain) {
        if (!list.update) {
          if (hasFormValue.length > 0) {
            hasFormValue.forEach(i => {
              if (i == list.select) {
                deletefield.push(i);
              }
            });
          }
        }
      }

      const chainObj = {};
      this.model.data_chain.forEach(item => {
        chainObj[item["name"]] = item["select"];
      });
      if (deletefield.length > 0) {
        for (const a in chainObj) {
          const chainField = chainObj[a];
          deletefield.forEach(item => {
            if (item == chainField) {
              delete chainObj[a];
            }
          });
        }
      }
      return chainObj;
    },
    clearDefault() {
      console.log(this.chianRequired, "this.chianRequired");
      //if (this.chianRequired.length == 0) return;
      if (!this.model.clearFields) return;
      if (this.model.clearFields.length == 0) return;
      let clearObj = {};
      this.model.clearFields.forEach(item => {
        //  console.log(item, "需要清空的值");
        clearObj[item] = "";
      });

      //   console.log(clearObj, "clearObj8888");
      return clearObj;
    },
    ...mapMutations("ibps/form", ["chainForm"])
  }
};
</script>