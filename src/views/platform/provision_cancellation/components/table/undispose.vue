<template>
  <div class="tab">
    <div class="btn">
      <el-button size="mini" plain type="primary" class="elbtn" @click="writeOff">冲销</el-button>
      <div class="rightbtn">
        <el-dialog placement="left-start" :visible.sync="visible" class="selectBox" :close-on-click-modal="false" :show-close="false" :modal="false" :append-to-body="true" width="40%" top="15vh">
          <el-form ref="form" :model="selecForm" label-width="100px">
            <el-form-item label="公司代码:">
              <el-input v-model="selecForm.bukrs"></el-input>
            </el-form-item>
            <el-form-item label="单据号码:">
              <el-input v-model="selecForm.docNumber"></el-input>
            </el-form-item>
            <el-form-item label="记账人:">
              <el-input v-model="selecForm.usnam"></el-input>
            </el-form-item>

            <el-form-item label="记账期间:">
              <el-date-picker v-model="postingTime" type="datetimerange" align="left" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="pickTime" value-format="yyyy-MM-dd" class="margin5"></el-date-picker>
            </el-form-item>
            <el-form-item label="记账凭证:">
              <el-input v-model="selecForm.postNumber"></el-input>
            </el-form-item>
            <el-form-item label="提单人:">
              <el-input v-model="selecForm.userId"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm">保存</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 点击打开搜索表单 -->
        <el-button @click="visiblebtn" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <!-- 重置搜索表单 -->
        <el-button is-dot class="elbtn filter othbtn" plain @click="reLoad">
          <i class="iconfont icon-uniE248 iconbtn filbtn" />
        </el-button>
        <!-- 刷新列表 -->
        <el-button class="elbtn filter othbtn" plain @click="confirm">
          <i class="iconfont icon-uniE00A1 iconbtn filbtn" />
        </el-button>
      </div>
    </div>
    <div class="datatable">
      <el-table :data="tableData" height="100%" v-loading="loading" element-loading-background="rgba(250, 250, 250, 0.5)" :header-cell-style="{color:'#000'}" style="width: 100%" :default-sort="{prop: 'startTime', order: 'descending'}" @selection-change="getRow">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="bukrs" label="公司代码" sortable align="center" />
        <el-table-column label="单据号" prop="docNumber" sortable width="180" align="center">
          <template slot-scope="scope">
            <p class="subject" @click="detailvisible(scope.row)">{{ scope.row.docNumber }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="usnam" label="记账人" sortable align="center" />
        <el-table-column prop="perio" label="记账期间" sortable width="85" align="center" />
        <el-table-column prop="postNumber" label="记账凭证" sortable align="center" />
        <el-table-column label="冲销日期" sortable width="160">
          <template slot-scope="scope">
            <!-- <span>{{scope.row.reBudat}}</span> -->
            <el-date-picker v-model="scope.row.reBudat" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="冲销原因" sortable width="85">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stgrd" placeholder="请输入内容"></el-input>
            <!-- <span>{{scope.row.stgrd}}</span> -->
          </template>
        </el-table-column>

        <!-- 折叠框 -->
        <el-table-column type="expand" label="更多" width="45">
          <template slot-scope="props">
            <el-form label-position="center" inline class="demo-table-expand">
              <el-form-item label="提单人">
                <span>{{ props.row.userId }}</span>
              </el-form-item>
              <el-form-item label="消息文本">
                <span>{{ props.row.postMessage }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="foot">
      <el-pagination :current-page.sync="currentpage" :page-size="10" layout="total, prev, pager, next, jumper" :total="pageAll.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import { COMP_URL, BASE_GATEWAY_API } from '@/api/baseUrl';
import detail from './detail';
export default {
  components: {
    // detail
  },
  props: {
    undisdata: {
      type: Array,
      default: () => {
        return [];
      }
    },
    undisnum: {
      type: Object,
      default: () => {
        return {};
      }
    },
    appId: {
      type: String
    },
    load: {
      type: Boolean
    }
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  data() {
    return {
      tableData: [],
      taskIds: [],
      currentpage: 1,
      dialogTableVisible: false,
      params: {},
      visible: false,
      delIds: [],
      selecForm: {
        docNumber: '',
        postingTimeStart: '',
        endTimeEnd: '',
        userId: '',
        bukrs: '',
        usnam: '',
        postNumber: ''
      },
      select: [],
      postingTime: [],
      pageAll: {},
      loading: false,
      dot: false
    };
  },

  watch: {
    undisdata: {
      handler: function(val, oldVal) {
        this.tableData = [];
        this.tableData = val;
      },
      immediate: true
    },
    undisnum: {
      handler: function(val, oldVal) {
        this.pageAll = val;
      },
      immediate: true,
      deep: true
    },
    load: {
      handler: function(val, oldVal) {
        this.loading = val;
      },
      immediate: true
    }
  },
  mounted() {
    this.ibpsPayable.$on('exit-multi-form', this.onEvenReload);
  },
  destroyed() {
    this.ibpsPayable.$off('exit-multi-form', this.onEvenReload);
  },
  methods: {
    // 打开表单搜索框
    visiblebtn() {
      this.visible = true;
    },
    // 记账期间
    pickTime(val) {
      console.log('pickTime', val);
      this.selecForm.postingTimeStart = val ? val[0].split('-')[0] + val[0].split('-')[1] : '';
      this.selecForm.endTimeEnd = val ? val[1].split('-')[0] + val[1].split('-')[1] : '';
      console.log('postingTime', this.selecForm.postingTimeStart, this.selecForm.endTimeEnd);
    },
    // 重置表单
    reLoad() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ''));
      this.postingTime = [];
      this.currentpage = 1;
      console.log('selecForm', this.selecForm);
      this.$emit('reLoad');
    },
    // 刷新
    confirm() {
      let selForm = Object.values(this.selecForm);
      selForm.forEach(i => {
        if (i != '') {
          this.dot = true;
        }
      });
      this.currentpage = 1;
      this.gettableData();
      this.visible = false;
    },
    // 取消
    cancel() {
      this.visible = false;
    },
    onEvenReload(type) {
      if (type != null) {
        this.currentpage = 1;
        this.reLoadData();
      }
      console.log('exit-multi-form:', type);
    },
    reLoadData() {
      this.$emit('getunddata');
    },
    // 点击单据号，进入表单
    detailvisible(row) {
      console.log('detailvisible2222', row);
      const { appId, instId, taskId } = row;
      this.ibpsPayable.setPayableParams({
        appId,
        instId,
        taskId,
        status: 'accountingQuery'
      });
      this.dialogTableVisible = true;
      console.log('params', this.params);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.gettableData();
    },
    // 选中行保存
    getRow(row) {
      this.taskIds = row;
      console.log('选择中', row);
    },
    // 冲销
    writeOff() {
      if (this.taskIds.length < 1) {
        this.$message.error('请先选择要操作的数据。');
        return;
      }
      console.log('选中的', this.taskIds);

      this.loading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + '/scene/v3/bsAccdoc/writeOff?type=A',
        method: 'post',
        data: this.taskIds
      })
        .then(response => {
          this.$message({
            message: '冲销成功',
            type: 'success'
          });
          this.confirm();// 刷新
          this.loading = false;
        })
        .catch(res => {
          this.$message.error('冲销失败');
          this.loading = false;
        });
    },
    // 表单搜索
    gettableData() {
      this.loading = true;

      let docNumber = '';
      let postingTimeStart = '';
      let endTimeEnd = '';
      let userId = '';
      let bukrs = '';
      let usnam = '';
      let postNumber = '';
      docNumber = this.selecForm.docNumber != '' ? '%' + this.selecForm.docNumber + '%' : '';
      postingTimeStart =
        this.selecForm.postingTimeStart != '' ? this.selecForm.postingTimeStart : '';
      endTimeEnd = this.selecForm.endTimeEnd != '' ? this.selecForm.endTimeEnd : '';
      userId = this.selecForm.userId != '' ? '%' + this.selecForm.userId + '%' : '';
      bukrs = this.selecForm.bukrs != '' ? '%' + this.selecForm.bukrs + '%' : '';
      postNumber = this.selecForm.postNumber != '' ? '%' + this.selecForm.postNumber + '%' : '';

      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + '/scene/v3/bsAccdoc/queryPending',
        method: 'post',
        data: {
          extraParameters: {
            appIds: this.appId,
            docNumber: docNumber,
            postingTimeStart: postingTimeStart,
            endTimeEnd: endTimeEnd,
            userId: userId,
            bukrs: bukrs,
            postNumber: postNumber
          },
          parameters: [],
          requestPage: { pageNo: this.currentpage, limit: 10, totalCount: null },
          sorts: []
        }
      })
        .then(response => {
          console.log('计提待处理翻页', response);
          this.tableData = response.data.dataResult;
          this.pageAll = response.data.pageResult;
          this.$emit('changenum', this.pageAll);
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });

      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: COMP_URL + '/bpm/v3/bpm/received/query/pending',
      //   method: 'post',
      //   data: {
      //     extraParameters: {
      //       appIds: this.appId,
      //       docNumber: docNumber,
      //       bukrs: bukrs,
      //       originator: originator,
      //       startTime: this.selecForm.startTime,
      //       endTime: this.selecForm.endTime,
      //       doStatus: this.selecForm.doStatus,
      //       markDepatMent: markDepatMent
      //     },
      //     parameters: [],
      //     requestPage: {
      //       pageNo: this.currentpage,
      //       limit: 10,
      //       totalCount: null
      //     },
      //     sorts: []
      //   }
      // })
      //   .then(response => {
      //     console.log('待处理翻页', response);
      //     this.tableData = response.data.dataResult;
      //     this.tableData.forEach(item => {
      //       item.subject = item.subject.slice(3, -4);
      //     });
      //     this.pageAll = response.data.pageResult;
      //     this.$emit('changenum', this.pageAll);
      //     this.loading = false;
      //   })
      //   .catch(res => {
      //     this.loading = false;
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/views/platform/processmanage/components/table/table.scss';
/deep/ .el-date-editor {
  width: 150px;
}
</style>
