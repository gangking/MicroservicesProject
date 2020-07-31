<template>
  <div class="dialogDetailDerivation">
    <div class="title">
      <i class="el-icon-download"></i>
      请选择下载类型
    </div>
    <div class="typeItems">
      <el-radio-group v-model="bcDescribe" @change="typeItemClick" size="mini">
        <el-radio border :label="item.variantName" v-for="(item , index) in typeList" :key="index"></el-radio>
      </el-radio-group>
      <span v-if="isShow">暂无数据</span>
    </div>

    <span class="dialog-footer">
      <el-button type="primary" @click="download">下 载</el-button>
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ActionUtils from '@/utils/action';
import { searchBo } from '@/api/platform/invoice/multilineForm.js';
const { mapState } = createNamespacedHelpers('ibps/compositeMultiline');
const { mapState: mapStateTwo, mapGetters } = createNamespacedHelpers('ibps/compositeBase');

import { columnExport, transactionExport } from '@/api/platform/invoice/detailDerivation.js';
import fecha from '@/utils/fecha';

export default {
  name: 'detail-derivation',
  computed: {
    ...mapState(['tableData']),
    ...mapStateTwo(['appId']),
    ...mapGetters(['businessEventId'])
  },
  data() {
    return {
      downloadparams: {
        appId: '',
        btKey: '',
        ids: [], // 取得是全选的id
        variantKey: ''
      },
      bcDescribe: '', //业务类型
      typeList: [],
      activeStyle: 'background: #409eff; color: white;',
      activeType: {},
      isShow: false,
      ids: [] // 表格的id集合
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.ids = this.tableData;
      this.exportParams(this.appId, this.businessEventId);
    },
    typeItemClick(info) {
      this.typeList.forEach(item => {
        if (item.variantName == info) {
          this.activeType = item;
        }
      });
    },
    //下载
    exportParams(val1, val2) {
      // 行项目导出
      let paramers = {
        parameters: [
          {
            key: 'Q^lc.APP_ID^S',
            value: val1
          },
          {
            key: 'Q^lc.BT_KEY^S',
            value: val2
          }
        ]
      };

      columnExport(paramers).then(res => {
        console.log('行项目导出', res.data);
        this.typeList = res.data;
        if (this.typeList.length > 0) {
          this.isShow = false;
          this.downloadparams.appId = res.data[0].appId;
          this.downloadparams.btKey = res.data[0].btKey;
          // this.downloadparams.ids = this.downloadparams.ids.push(res.data[0].id);
          this.downloadparams.variantKey = res.data[0].variantKey;
          this.bcDescribe = res.data[0].variantName;
        } else {
          this.isShow = true;
        }
      });
    },
    download() {
      this.typeList.forEach(item => {
        if (item.variantName == this.bcDescribe) {
          this.activeType = item;
        }
      });
      if (!this.activeType.id) {
        this.$message.error('请选择要下载类型');
        return;
      }
      let _ids = [];
      if (this.ids.length) {
        this.ids.map(item => {
          if (item.id) {
            _ids.push(item.id);
          }
        });
      }
      this.downloadparams.ids = _ids;
      let params = this.downloadparams;
      transactionExport(params)
        .then(res => {
          console.log('业务事物导出', res);
          if (!res) {
            return;
          }
          ActionUtils.exportFile(
            res.data,
            this.bcDescribe + fecha.formatDate('yyyyMMddHHmmss') + '.xls'
          );
        })
        .catch(req => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.dialogDetailDerivation {
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
  .title {
    height: 20px;
    color: #e6a445;
    font-size: 13px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    i {
      color: #67c23a;
    }
  }
  .typeItems {
    height: calc(100% - 60px);
    padding-bottom: 5px;
    -webkit-box-sizing: border-box;
    // border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    text-align: left;
    box-sizing: border-box;
    overflow: auto;
    /deep/ .el-radio--mini.is-bordered {
      padding: 5px 15px 0 10px;
      border-radius: 3px;
      height: 28px;
    }
  }
  .dialog-footer {
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }
}
</style>