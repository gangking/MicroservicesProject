<template>
  <div class="dialogflexibleBox">
    <div v-loading="loading" class="typeList">
      <div class="typeItems" v-for="(value, key) in typeList" :key="key">
        <h5>{{key}}</h5>
        <p>
          <span v-for="(item,index) in typeList[key]" :key="index" class="typeItem" :style="activeType.id==item.id?activeStyle:''" @click="typeItemClick(item)">
            {{item.bcDescribe}}
          </span>
        </p>
        <!-- <el-radio v-model="radio"
                label="1">备选项</el-radio> -->
      </div>
    </div>
    <span class="dialog-footer">
      <el-button type="primary" @click="download">下 载</el-button>
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
// import { searchBo } from '@/api/platform/invoice/multilineForm.js'
// import { showLoading } from '@/utils/loading'
import ComponentProps from '../../../Invoice/mixins/components-props';
export default {
  name: 'flexible-download',
  mixins: [ComponentProps],
  mounted() {
    this.loading = true;
    this.getBusinessTypeList({ businessEventId: this.stepVal.btKey }).then(data => {
      this.loading = false;
      this.typeList = data;
    });
  },

  data() {
    return {
      typeList: {},
      activeStyle: 'background: #409eff; color: white;',
      activeType: {},
      loading: false
    };
  },
  methods: {
    ...mapActions(['getBusinessTypeList','downloadExcelFunc']),
    typeItemClick(info) {
      this.activeType = info;
    },
    download() {
      if (!this.activeType.id) {
        this.$message.error('请选择要下载类型');
        return;
      }
      // 开始下载
      this.downloadExcelFunc(this.activeType);
      // showLoading();
      // this.payable.confirmDownload(this.activeType);
      // this.$emit('confirmDownload', this.activeType);
    }
  }
};
</script>

<style lang="scss" scoped>
// /deep/ .el-dialog__body {
.dialogflexibleBox {
  padding: 20px;
  // min-height: 110px;
  // max-height: 420px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  .typeList {
    text-align: left;
    border-bottom: 1px solid #ccc;
    height: calc(100% - 40px);
    box-sizing: border-box;
    .typeItems {
      margin-bottom: 5px;
      > h5 {
        padding: 0;
        margin: 0;
        margin-bottom: 5px;
        font-size: 14px;
      }
      > p {
        // padding: 0;
        width: 100%;
        padding-left: 20px;
        margin: 0;
        box-sizing: border-box;
        .typeItem {
          padding: 5px;
          margin: 5px 5px 0 0;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background: #409eff;
            color: white;
          }
        }
      }
    }
  }
  .dialog-footer {
    height: 40px;
    line-height: 40px;
  }
}
</style>