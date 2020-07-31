<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="24%" style="padding:10px;background: #9093994d;" append-to-body :modal="false" @close="handleClose">
    <div class="content">
      <div v-if="assetList.length > 0">
        <div v-for="(addInfos,key) in assetList" :key="key">
          <p>{{geteType(addInfos)}}</p>
          <p v-if="addInfos.ANLN1">资产编号：{{addInfos.ANLN1}}</p>
          <p v-if="addInfos.EMESSAGE">提示信息：{{addInfos.EMESSAGE}}</p>
          <p v-if="addInfos.PROCESSID">单据号码：{{addInfos.PROCESSID}}</p>
        </div>
      </div>
      <div v-if="msgInfo">

        <p>信息：{{msgInfo}}</p>
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
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';
import axios from 'axios';
import { BASE_GATEWAY_API } from '@/api/baseUrl';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeMultiline');

import ComponentProps from '../../../Invoice/mixins/components-props';

export default {
  name: 'form-asset',
  mixins: [ComponentProps],

  data() {
    return {
      assetList: [],
      msgInfo: '',
      dialogVisible: true
    };
  },

  computed: {
    resource() {
      console.log('this.itemVal.res', this.itemVal.res);
      return this.itemVal.res;
    }
  },

  watch: {
    itemVal: {
      handler(itemval) {
        const val = itemval.res;
        console.log('logsssss...', val);
        this.assetList = [];
        this.msgInfo = '';

        const { state, message, cause, data, hasList, hasDataMsg } = val;
        if (util.isArray(data) && data.length > 0) {
          this.assetList = data;
        } else if (util.isPlainObject(data)) {
          this.assetList = [data];
        } else {
          this.msgInfo = message || cause;
        }
      },
      immediate: true
    }
  },

  methods: {
    geteType(item) {
      console.log(`item--------`, item);
      if (item.ETYPE === 'S') {
        return '处理成功';
      } else if (item.ETYPE === 'E') {
        return '处理失败';
      }
    },

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
