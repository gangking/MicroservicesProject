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
            <el-form-item label="集成策略编码" prop="sttCode">
              <el-input v-model="formInline.sttCode" placeholder="接口编码"></el-input>
            </el-form-item>
            <el-form-item label="集成策略描述" prop="sttDesc">
              <el-input v-model="formInline.sttDesc" placeholder="接口描述"></el-input>
            </el-form-item>
            <el-form-item label="策略主业务对象" prop="boCode">
              <el-select v-model="formInline.boCode" clearable filterable placeholder="请选择策略主业务对象">
                <el-option
                  v-for="item in obOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="集成接口" prop="apiCode">
              <el-select
                v-model="formInline.apiCode"
                clearable
                filterable
                @change="sysChange"
                placeholder="请选择集成接口"
              >
                <el-option
                  v-for="item in sysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="集成策略类型" prop="sttType">
              <el-input v-model="formInline.sttType" placeholder="集成策略类型"></el-input>
            </el-form-item>

            <el-form-item label="主动调用规则" prop="invokeRule">
              <el-input v-model="formInline.invokeRule" placeholder="主动调用规则"></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" clearable placeholder="请选择状态">
                <el-option label="停用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="集成策略说明" prop="sttComments">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="formInline.sttComments"
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
  integSysAddEdit,
  boQuery,
  integSysSelect,
  integInterfaceQuery
} from "@/api/platform/integrate/strategy";
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
        sttCode: "",
        sttDesc: "",
        boCode: "",
        apiCode: "",
        sttType: "",
        invokeRule: "",
        sttComments: "",
        status: null,
        apiId: "" //系统主键id
      },
      rules: {
        sttCode: [
          { required: true, message: "请填写集成策略编码", trigger: "blur" }
        ],
        sttDesc: [
          { required: true, message: "请填写集成策略描述", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        boCode: [
          { required: true, message: "请选择策略主业务对象", trigger: "change" }
        ],
        apiCode: [
          { required: true, message: "请选择集成接口", trigger: "change" }
        ],
        sttType: [
          { required: true, message: "请填写集成策略类型", trigger: "blur" }
        ],
        invokeRule: [
          { required: true, message: "请填写主动调用规则", trigger: "blur" }
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
      integInterfaceQuery({}).then(res => {
        this.allSys = res.data.dataResult;
        this.sysOptions = res.data.dataResult.map(item => {
          return {
            label: item.apiDesc,
            value: item.apiCode
          };
        });
        console.log(res);
      });
    },
    //赋值sysId
    sysChange(value) {
      let index = this.allSys.findIndex(item => {
        return item.apiCode == value;
      });
      this.$set(this.formInline, "apiId", this.allSys[index].id);
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
            integSysAddEdit({
              id: this.integrateData.id,
              ...this.formInline
            }).then(response => {
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            integSysAddEdit({
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
/deep/ .el-textarea {
  width: 215px;
}
</style>
