<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="levelForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="level"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="权限对象编码:" prop="aucode">
        <el-input v-if="!readonly" :disabled="formId!==''" v-model="level.aucode" />
        <span v-else>{{ level.aucode }}</span>
      </el-form-item>

      <el-form-item label="权限对象描述:" prop="auname">
        <el-input v-if="!readonly" v-model="level.auname" />
        <span v-else>{{ level.auname }}</span>
      </el-form-item>

      <el-form-item label="权限表:" prop="table">
        <el-select
          v-if="!readonly"
          v-model="level.table"
          filterable
          remote
          clearable
          :disabled="formId!==''"
          placeholder="请选择"
          style="width:100%;"
          :remote-method="remoteMethod"
          @change="businessChange"
        >
          <el-option
            v-for="option in business"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="权限字段:" prop="auFields">
        <el-select
          v-if="!readonly"
          v-model="level.auFields"
          :disabled="formId!==''"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            v-for="option in objectAuth"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="权限字段描述:" prop="auFieldsDescribe">
        <el-input v-if="!readonly" v-model="level.auFieldsDescribe" />
        <span v-else>{{ level.auFieldsDescribe }}</span>
      </el-form-item>
      <el-form-item label="权限对象状态:" prop="status">
        <el-switch v-if="!readonly" v-model="level.status" active-text="启用" inactive-text="未启用"></el-switch>

        <span v-else>{{ level.status }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
  </el-dialog>
</template>

<script>
import {
  save,
  get,
  businesSelect,
  authoritySelect,
  checkAucode
} from "@/api/platform/data_authority/object_definition";
import ActionUtils from "@/utils/action";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      if (!this.id) {
        checkAucode({ auCode: value }).then(response => {
          console.log(response);
          if (response.cause !== "0") {
            callback(new Error("数据库已有该字段"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    return {
      enabledEdit: false, //是否可以编辑
      allBusiness: [],
      business: [], //业务对象下拉
      busSelectValue: "", //业务对象选择的值
      objectAuth: [], //权限对象字段
      formName: "levelForm",
      formLabelWidth: "162px",
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      level: {
        aucode: "",
        auname: "",
        table: "",
        auFields: "",
        auFieldsDescribe: "",
        status: true
      },
      rules: {
        aucode: [
          { required: true, message: this.$t("validate.required") },
          { validator: validateName }
        ],
        auname: [{ required: true, message: this.$t("validate.required") }],
        table: [{ required: true, message: this.$t("validate.required") }],
        auFields: [{ required: false, message: this.$t("validate.required") }],
        auFieldsDescribe: [
          { required: true, message: this.$t("validate.required") }
        ],
        status: [{ required: true, message: this.$t("validate.required") }]
      },
      toolbars: [
        {
          key: "save",
          hidden: () => {
            return this.readonly;
          }
        },
        { key: "cancel" }
      ]
    };
  },
  computed: {
    formId() {
      return this.id;
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    busSelectValue: {
      handler: function(val, oldVal) {
        this.getAuthority(val);
      }
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.level));
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case "save":
          this.handleSave();
          break;
        case "cancel":
          this.closeDialog();
          break;
        default:
          break;
      }
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        console.log("保存");
        if (valid) {
          console.log("保存");
          this.saveData();
        } else {
          ActionUtils.saveErrorMessage();
        }
      });
    },
    // 提交保存数据
    saveData() {
      save(this.level)
        .then(response => {
          this.$emit("callback", this);
          ActionUtils.saveSuccessMessage(response.message, rtn => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields();
            }
            if (rtn) {
              this.closeDialog();
            }
          });
        })
        .catch(err => {
          console.info(err);
        });
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit("close", false);
      this.$refs[this.formName].resetFields();
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return;
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {});
      });
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      console.log("formId", this.formId);
      this.getBussition();
      let emptyText = "";
      this.remoteMethod(emptyText);
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.enabledEdit = true;
        this.level = JSON.parse(JSON.stringify(this.defaultForm));
        // this.formValidate();
        return;
      }
      this.dialogLoading = true;
      get({
        id: this.formId
      })
        .then(response => {
          console.log(response.data);
          let resData = response.data;
          this.level.aucode = resData.aucode;
          this.level.auname = resData.auname;
          this.level.table = resData.table;
          this.level.auFields = resData.auFields;
          this.level.auFieldsDescribe = resData.auFieldsDescribe;
          this.level.status = JSON.parse(resData.status);
          this.level.id = this.id;

          this.dialogLoading = false;
          this.formValidate();
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    /* 获取业务对象下拉数据 */
    getBussition() {
      businesSelect({
        from: "",
        external: "N",
        dsAlias: "dataSource_default",
        type: "table"
      }).then(response => {
        let data = response.data;
        this.business = data.map(item => {
          return {
            label: item.id + " " + "【" + item.comment + "】",
            value: item.id
          };
        });
        this.allBusiness = this.business;
      });
    },
    /* 业务对象下拉选择值 */
    businessChange(val) {
      console.log(val);
      this.busSelectValue = val;
    },
    /* 获取权限对象下拉数据 */
    getAuthority(value) {
      console.log(typeof value);
      authoritySelect({
        tableName: value
      }).then(response => {
        let data = response.data;
        this.objectAuth = data.map(item => {
          for (let a in item) {
            console.log(item[a]);
            return {
              label: item[a],
              value: item[a]
            };
          }
        });
      });
    },
    /* 搜索方法 */
    remoteMethod(query) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.business = this.allBusiness.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      }, 10);
    }
  }
};
</script>
