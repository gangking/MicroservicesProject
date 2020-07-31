<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      center
      append-to-body
      width="40%"
      @open="loadData()"
      @close="closeDialog"
      :close-on-click-modal="false"
      customClass="customWidth"
    >
      <div class="select-main">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="ruleForm"
        >
          <!-- <el-form-item label="序号" prop="number">
            <el-input v-model.number="ruleForm.sn"></el-input>
          </el-form-item>-->

          <el-form-item label="字段" prop="fieldName">
            <el-select
              v-model="ruleForm.fieldName"
              filterable
              placeholder="请选择"
              @change="fieldChange"
            >
              <el-option
                v-for="item in businessField"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段描述" prop="fieldDesc">
            <el-input v-model="ruleForm.fieldDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="el-dialog--center">
        <el-button type="primary" @click="handlerConfirm">确定</el-button>
        <el-button @click="handlerCacncel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataTable: {
      type: Array,
      default: () => []
    },
    selectList: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "编辑"
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectData: {},
      fieldSelect: [], //选择的字段名称
      ruleForm: {
        fieldDesc: "",
        fieldName: "",
        id: ""
      },
      rules: {
        // sn: [{ required: true, message: "请输入序号", trigger: "blur" }],
        fieldDesc: [
          { required: true, message: "请输入字段描述", trigger: "blur" }
        ],
        fieldName: [
          { required: true, message: "请选择字段", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    businessField() {
      return this.dataTable.map(item => {
        return { label: item.name, value: item.id, fieldName: item.key };
      });
    }
  },
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    title: {
      handler: function(val, oldVal) {
        console.log(val);
        if (val == "新增") {
         // this.$refs["ruleForm"].resetFields();
        }
      },
      immediate: true
    },
    selectList: {
      handler(val, oldVal) {
        if (val.length == 1) {
          console.log(this.selectList[0], "this.selectList[0]");
          // this.ruleForm.sn = this.selectList[0].sn;
          this.ruleForm.fieldDesc = this.selectList[0].fieldDesc;
          this.ruleForm.fieldName = this.selectList[0].fieldId;
          this.ruleForm.id = this.selectList[0].id;
        }
      },
      deep: true
    },
    ruleForm: {
      handler(val, oldVal) {
        console.log("rule表单变化F", val);
      },
      deep: true
    }
  },
  methods: {
    loadData() {
      console.log("加载数据");
      //this.$refs["ruleForm"].resetFields();
    },
    closeDialog() {
      this.$emit("close", false);
    },
    handlerConfirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          this.$emit("businesEdit", this.ruleForm, this.fieldSelect);
          setTimeout(() => {
            this.fieldSelect = [];
            // this.$set(this.ruleForm, "fieldName", "");
            // this.$set(this.ruleForm, "fieldDesc", "");
          });

          this.closeDialog();
          //this.$refs["ruleForm"].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handlerCacncel() {
      this.closeDialog();
    },
    fieldChange(val) {
      // console.log(this.businessField, "businessField9999", val);
      this.fieldSelect = this.businessField.find(item => {
        return item.value == val;
      });
      console.log("businessField9999", val,this.fieldSelect);
      this.ruleForm.fieldDesc = JSON.parse(JSON.stringify(this.fieldSelect)).label;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
// .customWidth {
//   width: 30%;
// }
/deep/ .el-form-item__content .el-select {
  width: 100%;
}
</style>
