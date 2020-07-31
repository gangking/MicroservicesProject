<template>
  <div>
    <el-dialog
      title="修改页签名字"
      :visible.sync="dialogVisibleCopy"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="30%"
      center
    >
      <div>
        <el-form :rules="rules" ref="ruleForm" :model="nameObj" label-width="80px">
          <el-form-item label="页签名" v-for="(val,key,index) in nameObj" :key="index" :prop="key">
            <el-input v-model="nameObj[key]"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerCancel">取 消</el-button>
        <el-button type="primary" @click="handlerDetermine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    noteNameDialog: {
      type: Boolean,
      default: () => false
    },
    allData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      nameObj: {}, //表单对象
      rules: {}, // 表单规则对象
      dialogVisibleCopy: false,
      rulesArr: [
        { required: true, message: "请输入新页签名字", trigger: "blur" },
        { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
      ]
    };
  },
  components: {},
  watch: {
    allData: {
      handler(n) {
        this.nameObj = {};
        this.allData.forEach(element => {
          //console.log(element.tabName)
          this.$set(this.nameObj, element.tabName, element.title);
          this.$set(this.rules, element.tabName, this.rulesArr);
        });
      },
      immediate: true
    },
    noteNameDialog: {
      handler(n) {
        this.dialogVisibleCopy = this.noteNameDialog;
      },
      immediate: true
    }
  },

  methods: {
    change($event) {
      console.log($event);
    },
    handlerDetermine() {
      this.submitForm("ruleForm");
    },
    handlerCancel() {
      this.handlerEmit();
    },
    handlerEmit() {
      this.$emit("closeNote", false);
    },
    closeDialog() {
      this.handlerEmit();
    },
    nameList() {
      this.allData.forEach(element => {
        this.nameObj[element.name] = element.title;
      });
    },
    // 提交表单验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("changeTab", this.nameObj);
          this.handlerEmit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {},
  mounted() {}
};
</script>

<style scoped lang="scss">
</style>
