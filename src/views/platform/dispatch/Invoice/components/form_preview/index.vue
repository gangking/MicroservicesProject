<template>
  <div class="form_preview">
    <div class="content">
      <el-scrollbar style="height: 100%">
        <div class="left">
          <div class="leftTitle"></div>
          <el-table ref="singleTable" v-loading="loading" :data="formPrintingList" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column property="name" label="预览模板" />
          </el-table>
        </div>
      </el-scrollbar>
      <div class="right" :style="psfSrc ? '' : 'background: #ccc;'">
        <iframe v-show="psfSrc" width="100%" height="98%" scrolling="yes" frameborder="0" type="application/pdf" :src="psfSrc">
          This browser does not support PDFs. Please download</iframe>
      </div>
    </div>
    <div class="btnbox">
      <el-button type="success" plain @click="formPrinting"><i class="el-icon-printer" />下载</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';
import { BASE_GATEWAY_API } from '@/api/baseUrl';
const { mapState: baseMapState,mapGetters } = createNamespacedHelpers('ibps/compositeBase');
const { mapState: dilogMapState, mapActions } = createNamespacedHelpers('ibps/compositeDolog');
export default {
  name: 'form-preview',
  props: {},
  data() {
    return {
      tableData: [],
      currentRow: null,
      psfSrc: '',
      loading: false,
      //   pdf
      address: BASE_GATEWAY_API + '',
      apiname: '/page/v3/form/print/template/pdf/preview',
      downapiname: '/page/v3/form/print/template/pdf/print',
      clickDwonBtn: false
    };
  },
  computed: {
    ...mapGetters(['processDefId']),
    ...baseMapState([
      'tableHeaderId',
      'instId'
    ]),
    ...dilogMapState(['formPrintingList'])
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.loading = true;
      this.getFormPrintingList().then(res => {
        // console.log('打印列表返回值', res);
        this.loading = false;
        this.tableData = res;
        if (res.length < 1) {
          this.$message({
            message: '暂无打印信息 。',
            type: 'error'
          });
          return;
        }
        // 默认选中第一个
        this.$refs.singleTable.setCurrentRow(res[0]);
        this.psfSrc =
          this.address +
          this.apiname +
          `?formPrintTemplateId=${res[0].id}&pk=${this.tableHeaderId}&defId=${this.processDefId}&instId=${this.instId}`;
      });
    },
    // 表单确认提交事件
    pushCompoundForm() {
      //console.log("点击确认提交按钮");
      this.$emit('pushCompoundForm');
    },
    ...mapActions(['getFormPrintingList']),
    // 表格单选
    handleCurrentChange(val) {
      //console.log("选中行", val);
      this.currentRow = val;
      this.psfSrc =
        this.address +
        this.apiname +
        `?formPrintTemplateId=${val.id}&pk=${this.tableHeaderId}&defId=${this.processDefId}&instId=${this.instId}`;
    },
    // 表单打印
    formPrinting() {
      //console.log("打印下载");
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: '请选择要打印的表单。',
          type: 'error'
        });
        return;
      }
      var params = {
        pk: this.tableHeaderId,
        formPrintTemplateId: this.currentRow.id
      };
      var url =
        this.address +
        this.downapiname +
        `?formPrintTemplateId=${params.formPrintTemplateId}&pk=${params.pk}&defId=${this.processDefId}&instId=${this.instId}`;
      // 打印下载
      const downloadRes = async (url, name) => {
        const response = await fetch(url);
        // 内容转变成blob地址
        const blob = await response.blob();
        // 创建隐藏的可下载链接
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        // 地址
        a.href = objectUrl;
        // 修改文件名
        a.download = name;
        // 触发点击
        document.body.appendChild(a);
        a.click();
        // 移除
        setTimeout(() => document.body.removeChild(a), 1000);
      };
      downloadRes(url, this.currentRow.name);
    }
  }
};
</script>

<style lang="scss" scoped>
// pdf样式
.pdf-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.form_preview {
  height: 100%;
  .content {
    height: calc(100% - 40px);
    padding-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    //   background: pink;
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
    .right {
      flex: 1;
      height: 100%;
      position: relative;
      background: url('../../../../../../assets/images/loading/02.gif') no-repeat center center;
    }
  }
  .btnbox {
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
/deep/ .el-dialog {
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
