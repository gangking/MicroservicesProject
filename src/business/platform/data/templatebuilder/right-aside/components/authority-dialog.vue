<template>
  <div>
    <el-dialog
      title="关联权限对象"
      :visible.sync="dialogVisible"
      width="70%"
      append-to-body
      @open="authOpen"
      @close="closeDialog"
      center
    >
      <div>
        <el-form ref="levelForm" :model="level" :rules="rules" label-width="130px">
          <el-form-item label="权限对象编码:" prop="aucode">
            <el-select
              v-model="level.aucode"
              placeholder="请选择"
              style="width:100%;"
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

          <el-form-item label="权限对象描述:" prop="auname">
            <!-- <span>{{ level.auname }}</span> -->
            <el-input readonly v-model="level.auname" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  get,
  businesSelect,
  authoritySelect
} from "@/api/platform/data_authority/role_empower";
import { save, editAuth } from "@/api/platform/data_authority/data_template";
export default {
  name: "fssc-menu-select",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    authField: {
      type: Object,
      default: () => {}
    },
    dataTemplateId: String
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    "level.aucode": {
      handler(val, oldVal) {
        this.getAuthority(val);
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      business: [], //业务对象下拉
      level: {
        aucode: "",
        auname: ""
      },
      rules: {
        aucode: [
          { required: true, message: this.$t("validate.required") },
          { trigger: "blur" }
        ],
        auname: [{ required: true, message: this.$t("validate.required") }]
      }
    };
  },
  mounted() {
    //this.getBussition(); //changed by dingdx 2020.03.06 权限过滤
    this.level.aucode = "";
    this.level.auname = "";
  },
  methods: {
    /* 获取权限对象查询 下拉数据 */
    getBussition() {
      businesSelect({}).then(response => {
        let data = response.data;
        this.business = data.map(item => {
          return {
            label: item,
            value: item
          };
        });
      });
    },
    getAuthority(value) {
      if (!value) return;
      /* 权限权限对象描述和权限对象字段 数据 */
      authoritySelect({
        auCode: value
      }).then(response => {
        let data = response.data;
        this.level.auname = data.AU_NAME;
      });
    },
    /*保存  */
    handleSave() {
      this.$refs["levelForm"].validate(valid => {
        if (valid) {
          this.saveData();
        } else {
          ActionUtils.saveErrorMessage();
        }
      });
    },
    /* 提交保存数据 */
    saveData() {
      //changed by dingdx 2020.03.06 权限过滤
      this.authField.aucode = this.level.aucode;
      this.authField.auname = this.level.auname;
      this.diologEmit(); 

/*       let form = {
        aucode: this.level.aucode,
        auname: this.level.auname,
        filterFields: this.authField.name,
        bdFields: this.authField.name,
        id: this.authField.id,
        tenantId: this.dataTemplateId,
        updateBy: this.authField.label
      };
      console.log(form);    
      save(form)
        .then(response => {
          this.diologEmit();
          // this.$emit("callback", this);
          // ActionUtils.saveSuccessMessage(response.message, rtn => {
          //   if (this.$utils.isEmpty(this.formId)) {
          //     this.$refs[this.formName].resetFields();
          //   }
          //   if (rtn) {
          //     this.closeDialog();
          //   }
          // });
        })
        .catch(err => {
          console.info(err);
        }); */
    },
    /* 取消 */
    handleCancel() {
      this.diologEmit();
    },
    closeDialog() {
      this.diologEmit();
    },
    /* 关闭dialog */
    diologEmit() {
      this.$emit("close", false);
    },
    businessChange(val) {
      console.log(val);
    },
    /* 打开dialog */
    authOpen() {
      //changed by dingdx 2020.03.06 权限过滤
      if (this.business.length === 0) {
        this.getBussition();
      }
      this.level.aucode = this.authField.aucode;
      this.level.auname = this.authField.auname;

/*       editAuth({ id: this.authField.id || "" }).then(response => {
        console.log("编辑接口", response);
        this.level.aucode = response.data.aucode;
        this.level.auname = response.data.auname;
      }); */
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
