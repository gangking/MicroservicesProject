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
      <el-form-item label="权限对象编码:" prop="auCode">
        <el-select
          v-if="!readonly"
          v-model="level.auCode"
          placeholder="请选择"
          style="width:100%;"
          @change="businessChange"
        >
          <el-option
            v-for="(option,index) in business"
            :key="option.value+index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <span v-else>{{ level.auCode }}</span>
      </el-form-item>

      <el-form-item label="权限对象描述:" prop="auName">
        <el-input v-if="!readonly" v-model="level.auName" />
        <span v-else>{{ level.auName }}</span>
      </el-form-item>
      <el-form-item label="权限对象字段:" prop="auField">
        <el-input v-if="!readonly" v-model="level.auField" />
        <span v-else>{{ level.auField }}</span>
      </el-form-item>
      <el-form-item label="是否全局对象:" prop="isAll">
        <el-switch v-model="level.isAll"></el-switch>
      </el-form-item>

      <el-form-item label="权限赋值:" prop="auValue">
        <el-select
          v-if="!readonly"
          v-model="level.auValue"
          multiple
          filterable
          remote
          :disabled="aureadonly"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            v-for="(option,index) in permissionSelect"
            :key="option.value+index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
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
  getPermissionSelect
} from "@/api/platform/data_authority/role_empower";
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
    role: {
      type: String,
      default: ""
    },
    title: String
  },
  data() {
    return {
      copyId: "",
      aureadonly: false,
      business: [], //业务对象下拉
      busSelectValue: "", //业务对象选择的值
      permissionSelect: [], //权限赋值对象字段
      formName: "levelForm",
      formLabelWidth: "120px",
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      level: {
        id: "",
        auCode: "",
        auName: "",
        auField: "",
        auValue: [],
        roleId: "",
        isAll: false
      },
      rules: {
        auCode: [
          { required: true, message: this.$t("validate.required") }
          // { validator: validateName, trigger: "blur" }
        ],
        auName: [{ required: true, message: this.$t("validate.required") }],
        auField: [{ required: true, message: this.$t("validate.required") }],
        auValue: [{ required: false, message: this.$t("validate.required") }]
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
    "level.isAll": {
      handler(val, oldVal) {
        if (val) {
          this.level.auValue = [];
          this.aureadonly = true;
        } else {
          this.aureadonly = false;
        }
      },
     // immediate: true
    },
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
    },
    "level.auCode": {
      handler(val, oldVal) {
        this.getAuthority(val);
      }
    },
    role: {
      handler(val, oldVal) {
        console.log(val);
        //this.level.roleId = val;
        this.$set(this.level, "roleId", val);
        this.copyId = val;
        console.log("level", this.level);
      },
      immediate: true
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
        if (valid) {
          this.saveData();
        } else {
          ActionUtils.saveErrorMessage();
        }
      });
    },
    // 提交保存数据
    saveData() {
      var params = JSON.parse(JSON.stringify(this.level));
      params.id = this.formId;
      params.auValue = this.level.auValue.join(",");
      params.roleId = this.copyId;    
      //this.level.id = this.formId;
      //this.level.auValue = this.level.auValue.join(",");
      //this.level.roleId = this.copyId;
      save(params)
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
      if (this.$utils.isEmpty(this.formId)) {
        // 获取权限对象查询 下拉数据
        this.getBussition();
        // 重置表单
        this.level = JSON.parse(JSON.stringify(this.defaultForm));
        //this.formValidate();
        return;
      }

      this.dialogLoading = true;
      get({
        id: this.formId
      })
        .then(response => {
          //this.level = response.data;

          this.level.auValue = response.data.auValue.split(",");
          this.level.auCode = response.data.auCode;
          this.level.isAll = JSON.parse(response.data.isAll);
          //console.log("this.level", this.level);
          // this.formValidate();
          this.dialogLoading = false;
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    /* 获取权限对象查询 下拉数据 */
    getBussition() {
      businesSelect().then(response => {
        let data = response.data;
        this.business = data.map(item => {
          return {
            label: item,
            value: item
          };
        });
      });
    },
    /* 权限对象查询下拉选择值 */
    businessChange(val) {
      // console.log(val);
      this.busSelectValue = val;
      //this.getAuthority(val);
    },
    /* 权限权限对象描述和权限对象字段 数据 */

    getAuthority(value) {
      if (!value) return;
      /* 权限权限对象描述和权限对象字段 数据 */
      authoritySelect({
        auCode: value
      }).then(response => {
        let data = response.data;
        this.level.auName = data.AU_NAME;
        this.level.auField = data.AU_FIELDS;
      });
      /* 权限赋值 */
      getPermissionSelect({ auCode: value }).then(res => {
        this.permissionSelect = res.data.map(item => {
          return {
            label: item,
            value: item
          };
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>