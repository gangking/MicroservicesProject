<template>
  <div class="integrate">
    <el-dialog
      ref="dialog"
      title="新增/编辑"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="dialog"
      width="60%"
      @close="closeDialog"
      @open="getFormData"
      append-to-body
    >
      <div>
        <div class="header-input" ref="headerInput">
          <el-form
            :inline="true"
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            :rules="rules"
            label-width="125px"
          >
            <el-form-item label="接口编码" prop="apiCode">
              <el-input v-model="formInline.apiCode" placeholder="接口编码"></el-input>
            </el-form-item>
            <el-form-item label="接口描述" prop="apiDesc">
              <el-input v-model="formInline.apiDesc" placeholder="接口描述"></el-input>
            </el-form-item>
            <el-form-item label="所属系统" prop="sysCode">
              <el-select
                v-model="formInline.sysCode"
                clearable
                filterable
                @change="sysChange"
                placeholder="请选择所属系统"
              >
                <el-option
                  v-for="item in sysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" clearable placeholder="请选择状态">
                <el-option label="停用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="接口类型" prop="apiType">
              <el-select v-model="formInline.apiType" clearable placeholder="请选择接口类型">
                <el-option label="WebService" value="0"></el-option>
                <el-option label="RFC" value="1"></el-option>
                <el-option label="Rest" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="接口主业务对象" prop="boCode">
              <el-select v-model="formInline.boCode" clearable filterable placeholder="请选择接口主业务对象">
                <el-option
                  v-for="item in obOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="集成模式" prop="model">
              <el-select v-model="formInline.model" clearable placeholder="请选择集成模式">
                <el-option label="Inbound" value="0"></el-option>
                <el-option label="Outbound" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口说明" prop="apiComments">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="formInline.apiComments"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  integInterfaceAddEdit,
  boQuery,
  integSysSelect
} from "@/api/platform/integrate/interface";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    integrateData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      allSys: [],
      sysOptions: [],
      obOptions: [],
      dialogVisible: false,
      loading: false,

      formInline: {
        apiCode: "",
        apiDesc: "",
        sysCode: "",
        status: null,
        apiType: "",
        boCode: "",
        model: "",
        apiComments: " ",
        sysId: "" //系统主键id
      },
      rules: {
        sysCode: [
          { required: true, message: "请填写系统编码", trigger: "blur" }
        ],
        sysDesc: [
          { required: true, message: "请填写系统描述", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        sysCode: [
          { required: true, message: "请选择所属系统", trigger: "change" }
        ],
        apiType: [
          { required: true, message: "请选择接口类型", trigger: "change" }
        ],
        boCode: [
          { required: true, message: "请选择接口主业务对象", trigger: "change" }
        ],
        model: [
          { required: true, message: "请选择集成模式", trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    integrateData: {
      handler: function(val, oldVal) {
        this.changeData(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getFormData() {
      boQuery({
        parameters: [],
        requestPage: {
          pageNo: 1,
          limit: 10000,
          totalCount: null
        },
        sorts: []
      }).then(res => {
        this.obOptions = res.data.dataResult.map(item => {
          return {
            label: item.name,
            value: item.code
          };
        });

        console.log(res);
      });
      integSysSelect({}).then(res => {
        this.allSys = res.data.dataResult;
        this.sysOptions = res.data.dataResult.map(item => {
          return {
            label: item.name,
            value: item.sysCode
          };
        });
        console.log(res);
      });
    },
    //赋值sysId
    sysChange(value) {
      let index = this.allSys.findIndex(item => {
        return item.sysCode == value;
      });
      this.$set(this.formInline, "sysId", this.allSys[index].id);
    },
    //转换值
    changeData(changeObj) {
      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          const element = changeObj[key];
          this.$set(this.formInline, key, element);
        }
      }
    },
    clearForm() {
      this.$refs["ruleForm"].resetFields();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    confirm() {
      console.log(this.integrateData, "this.integrateData");
      //this.closeDialog();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.integrateData.id) {
            integInterfaceAddEdit({
              id: this.integrateData.id,
              ...this.formInline
            }).then(response => {
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            integInterfaceAddEdit({
              ...this.formInline
            }).then(response => {
              this.$emit("upTable");
              this.closeDialog();
            });
          }
        } else {
          return false;
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header-input {
  margin-top: 20px;
}
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
.integrate {
  min-height: 300px;
}
/deep/ .el-input__inner {
  width: 215px;
}
/deep/ .el-textarea{
   width: 215px;
}
</style>
