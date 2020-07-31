<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="24%" style="padding:10px;background: #9093994d;" append-to-body :modal="false" @close="handleClose">

    <div class="content" v-if="isSuccess">
      <!-- <p>{{this.zmsg}}</p>
        <p>{{this.BELNR}}</p>
        <p>{{this.DOCNR}}</p>-->
      <div v-for="(item,key) in slistMsg" :key="key">

        <P v-if="item.BWART">移动类型：{{ item.BWART }}</P>
        <P>消息文本：{{item.ZMESSAGE}}</P>
        <P v-if="item.MBLNR">物料凭证编号：{{ item.MBLNR }}</P>
        <P v-if="item.DOCNR">会计凭证编号：{{ item.DOCNR }}</P>

      </div>
      <div v-for="(item,key) in nlistMsg" :key="key">
        <P v-if="item.BWART">移动类型：{{ item.BWART }}</P>
        <P>消息文本：{{item.ZMESSAGE}}</P>
        <P v-if="item.MBLNR">物料凭证编号：{{ item.MBLNR }}</P>
        <P v-if="item.DOCNR">会计凭证编号：{{ item.DOCNR }}</P>

      </div>
    </div>
    <div class="content" v-else>
      <div>
        <p>{{msg}}</p>
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
      return state == '200' && data != null;
    },
    slistMsg() {
      const { data } = this.res;
      return data.sList;
    },
    nlistMsg() {
      const { data } = this.res;
      return data.nList;
    },
    msg() {
      const { state, message, cause, data } = this.res;
      return this.isSuccess ? data.EMESSAGE : message || cause;
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
