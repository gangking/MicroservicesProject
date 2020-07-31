<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="24%" style="padding:10px;background: #9093994d;" append-to-body :modal="false" @close="handleClose">

    <div class="content">
      <div v-if="!isSuccess">
        <p>{{msg}}</p>
      </div>

      <div class="content" v-else>
        <p>消息文本：{{invoiceData.emessage}}</p>
        <p v-if="invoiceData.belnr">发票凭证编号：{{invoiceData.belnr}}</p>
        <p v-if="invoiceData.docnr">会计凭证编号：{{invoiceData.docnr}}</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <template>
        <el-button type="primary" plain @click="handleClose">确定</el-button>
      </template>

    </div>
  </el-dialog>
</template>

<script>
import ComponentProps from '../../../Invoice/mixins/components-props';
export default {
  name: 'form-invoice',
  mixins: [ComponentProps],

  data() {
    return {
      dialogVisible: true
    };
  },

  computed: {
    res() {
      return this.itemVal.res;
    },
    isSuccess() {
      const { state, data } = this.res;
      return state == '200';
    },
    msg() {
      const { state, message, cause } = this.res;
      return message || cause;
    },
    invoiceData() {
      const { data } = this.res;
      return data;
    }
  },

  methods: {
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  // height: 60%;
  // display: flex;
  //   background: pink;
  .con-left {
    margin-left: 4px;
  }
  .left {
    height: 100%;
    width: 300px;
    padding-right: 10px;
    .leftTitle {
      h2 {
        margin-top: 0;
      }

      /deep/ .el-button {
        float: right;
      }
    }
  }
}
/deep/ .el-dialog {
  height: 45%;
  .el-dialog__header {
    height: 21px;
  }
  .el-dialog__footer {
    height: 56px;
  }
  .el-dialog__body {
    padding-bottom: 10px;
    padding-top: 10px;
    height: calc(100% - 66px);
  }
}
</style>
