<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="42%" style="padding:10px;background: #9093994d;" append-to-body :modal="false" @close="handleClose">
    <div class="content">

      <el-table :data="gridData">
        <el-table-column property="contractName" label="合同字段" width="100"></el-table-column>
        <el-table-column property="changeBefore" label="变更前" width="132"></el-table-column>
        <el-table-column property="changeAfter" label="变更后" width="132"></el-table-column>
        <el-table-column property="changeTime" label="变更时间" width="145"></el-table-column>
      </el-table>

    </div>

  </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';

import ComponentProps from '../../../Invoice/mixins/components-props';
import flowBtnApi from '@/api/platform/invoice/flowBtn.js';
import axios from 'axios';
import { BASE_GATEWAY_API } from '@/api/baseUrl';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeSingle');
export default {
  name: 'form-invoice',
  mixins: [ComponentProps],
  data() {
    return {
      dialogVisible: true,
      tableData: [],
      message: null,
      currentRow: null,
      psfSrc: '',
      loading: false,
      contractMsg: {},
      zmsg: '',
      BELNR: '',
      DOCNR: '',
      ispayFlag: false,
      isReqData: false,
      isAgree: '',
      reqInfos: [],
      gridData: []
    };
  },

  mounted() {
    this.loadData();
  },

  watch: {
    contractMsg(val) {
      // var val ={"state":200,"request":null,"message":"","cause":"","variables":{},"data":[{"changeTime":"2019-12-21 11:20:09.0","changeAfter":"K","contractName":"客商类型","changeBefore":"D"},{"changeTime":"2019-12-21 11:20:09.0","changeAfter":"弋华蕾","contractName":"制单人姓名","changeBefore":"弋华"},{"changeTime":"2019-12-21 11:20:09.0","changeAfter":"FM20191221000120","contractName":"单据号码","changeBefore":"FM20191221000119"}]}
      if (val) {
        if (val.data != null) {
          var arr = val.data;
          var obj = {};
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].contractName === '单据号码') {
              obj = arr[i];
              arr.splice(i, 1);
              break;
            }
          }
          arr.unshift(obj);
          this.gridData = arr;
        } else {
          this.zmsg = val.msg;
        }
      } else {
        this.zmsg = val.msg;
      }
    }
  },

  methods: {
    ...mapActions(['changeContractSubmit']),
    loadData() {
      this.changeContractSubmit().then(res => {
        this.contractMsg = res;
      });
    },
    handleClose() {
      this.dialogVisible = false;
      // this.$emit('getIsFormContract', false)
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
