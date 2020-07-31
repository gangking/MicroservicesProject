<template>
  <div class="integrate">
    <el-dialog ref="dialog" title="凭证信息" center :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" class="dialog" width="50%" @close="closeDialog" append-to-body>
      <div>
        <div class="main" ref="main">
          <table style="border:1px solid #ccc" class="table-message">
            <tr>
              <td>会计凭证编号</td>
              <td>{{formInline.number}}</td>
              <td>消息文本</td>
              <td>{{formInline.msg}}</td>
            </tr>
            <tr>
              <td>公司代码</td>
              <td></td>
              <td>会计年度</td>
              <td></td>
            </tr>
            <tr>
              <td>消息类型</td>
              <td></td>
              <td>消息编号</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">冲销凭证编号</td>
              <td colspan="2">{{formInline.reNumber}}</td>
            </tr>
          </table>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="btnClick">冲销凭证</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 会计凭证注销弹窗 -->
    <write-off-certificate :isflag="dialogWriteOffCert" @closeWriteOffCertificate="closeWriteOffCertificate" />
  </div>
</template>

<script>
import { getVoucher } from '@/api/platform/data/dataset';
import writeOffCertificate from './write-off-certificate';
import ComponentProps from '../../../Invoice/mixins/components-props';
export default {
  mixins: [ComponentProps],
  data() {
    return {
      dialogVisible: true,
      loading: false,
      formInline: {
        msg: '',
        number: '',
        type: '',
        reNumber: ''
      },
      dialogWriteOffCert: false //冲销凭证弹框
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getFormData();
  },

  methods: {
    // 关闭注销凭证弹窗
    closeWriteOffCertificate(val) {
      console.log('666', val);
      this.dialogWriteOffCert = val;
      this.$emit('update:visible', false);
    },
    getFormData() {
      this.clearDefault();
      getVoucher({ instId: this.instId }).then(res => {
        if (res.state === 200) {
          this.formInline.msg = res.data.msg;
          this.formInline.number = res.data.number;
          this.formInline.type = 'S';
          this.formInline.reNumber = res.data.reNumber || '';
        } else if (res.state === 500) {
          this.formInline.msg = '未生成会计凭证';
          this.formInline.type = 'E';
          this.$message({
            message: '未生成会计凭证',
            type: 'error'
          });
          // this.closeDialog();
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
      //this.$emit('update:visible', false);
    },
    clearDefault() {
      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          this.$set(this.formInline, key, '');
        }
      }
    },
    btnClick() {
      // this.closeDialog();
      // 打开冲销凭证
      this.dialogWriteOffCert = true;
    }
  },
  components: {
    writeOffCertificate // 调用冲销凭证弹框组件
  }
};
</script>

<style scoped lang="scss">
/deep/.el-form-item__content {
  width: calc(100% - 125px);
}
.main {
  .table-message {
    width: 80%;
    margin: 20px auto;
    > tr td {
      text-indent: 10px;
      width: 25%;
      border: 1px solid #ccc;
      height: 40px;
    }
  }
}

.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
</style>
