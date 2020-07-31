<template>
  <div class="tab">
    <div class="btn">
      <!-- <el-button size="mini" plain type="danger" class="elbtn" @click="revocation">
        <i class="iconfont icon-uniE1E0 iconbtn" />
        <span class="icontext">撤销</span>
      </el-button> -->

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
            <el-form-item label="冲销凭证:">
              <el-input v-model="selecForm.reNumber"></el-input>
            </el-form-item>
            <!-- <el-form-item label="冲销日期:">
              <el-date-picker
                v-model="writeoffTime"
                type="datetime"
                placeholder="选择日期时间"
                align="left"
                @change="pickwriteoffTime"
                value-format="yyyy-MM-dd"
                class="margin5"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="冲销日期:">
              <el-date-picker v-model="writeoffTime" type="datetimerange" align="left" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="pickwriteoffTime" value-format="yyyy-MM-dd" class="margin5"></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="confirm">保存</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-button @click="visiblebtn" plain class="elbtn filter">
          <el-badge :is-dot="dot">
            <i class="iconfont icon-uniE0561 iconbtn filbtn" />
          </el-badge>
        </el-button>
        <el-button is-dot class="elbtn filter othbtn" plain @click="reLoad">
          <i class="iconfont icon-uniE248 iconbtn filbtn" />
        </el-button>
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
        <el-table-column prop="reBudat" label="冲销日期" sortable width="85" />
        <el-table-column prop="reNumber" label="冲销凭证" sortable align="center" />
        <el-table-column prop="stgrd" label="冲销原因" sortable width="85" />

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
      <el-pagination :current-page.sync="currentpage" :page-size="10" layout="total, prev, pager, next, jumper" :total="pageAll.totalCount" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
import { COMP_URL, BASE_GATEWAY_API } from '@/api/baseUrl';
import detail from './detail';
export default {
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  components: {
    detail
  },
  props: {
    revocdata: {
      type: Array,
      default: () => {
        return [];
      }
    },
    revocnum: {
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
        reBudatStart: '',
        reBudatEnd: '',
        // reBudat:'',
        userId: '',
        bukrs: '',
        usnam: '',
        postNumber: '',
        reNumber: ''
      },
      select: [],
      postingTime: [],
      writeoffTime: [],
      pageAll: {},
      loading: false,
      dot: false
    };
  },
  watch: {
    revocdata: {
      handler: function(val, oldVal) {
        this.tableData = [];
        this.tableData = val;
      },
      immediate: true
    },
    revocnum: {
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
  methods: {
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
    // 冲销日期
    pickwriteoffTime(val) {
      console.log('pickwriteoffTime', val);
      this.selecForm.reBudatStart = val ? val[0] : '';
      this.selecForm.reBudatEnd = val ? val[1] : '';
      console.log('postingTime', this.selecForm.reBudatStart, this.selecForm.reBudatEnd);
    },
    // 重置
    reLoad() {
      this.dot = false;
      Object.keys(this.selecForm).forEach(key => (this.selecForm[key] = ''));
      this.postingTime = [];
      this.writeoffTime = [];
      this.currentpage = 1;
      console.log('selecForm', this.selecForm);
      this.$emit('reLoad');
    },
    // 搜索及刷新
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
    cancel() {
      this.visible = false;
    },
    // 进入表单列表
    detailvisible(row) {
      console.log('detailvisible333', row);
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
    handleClose() {
      this.dialogTableVisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.gettableData();
    },
    getRow(row) {
      this.taskIds = [];
      row.forEach(item => {
        this.taskIds.push(item.taskId);
      });
      this.taskIds = this.taskIds.toString();
    },
    gettableData() {
      this.loading = true;

      let docNumber = '';
      let postingTimeStart = '';
      let endTimeEnd = '';
      let userId = '';
      let bukrs = '';
      let usnam = '';
      let postNumber = '';
      let reBudatStart = '';
      let reBudatEnd = '';
      docNumber = this.selecForm.docNumber != '' ? '%' + this.selecForm.docNumber + '%' : '';
      postingTimeStart =
        this.selecForm.postingTimeStart != '' ? this.selecForm.postingTimeStart : '';
      endTimeEnd = this.selecForm.endTimeEnd != '' ? this.selecForm.endTimeEnd : '';

      reBudatStart = this.selecForm.reBudatStart != '' ? this.selecForm.reBudatStart : '';
      reBudatEnd = this.selecForm.reBudatEnd != '' ? this.selecForm.reBudatEnd : '';

      userId = this.selecForm.userId != '' ? '%' + this.selecForm.userId : '';
      bukrs = this.selecForm.bukrs != '' ? '%' + this.selecForm.bukrs + '%' : '';
      postNumber = this.selecForm.postNumber != '' ? '%' + this.selecForm.postNumber + '%' : '';

      return request({
        baseURL: BASE_GATEWAY_API,
        url: COMP_URL + '/scene/v3/bsAccdoc/queryProcessed',
        method: 'post',
        data: {
          extraParameters: {
            appIds: this.appId,
            docNumber: docNumber,
            postingTimeStart: postingTimeStart,
            endTimeEnd: endTimeEnd,
            userId: userId,
            bukrs: bukrs,
            postNumber: postNumber,
            reBudatStart: reBudatStart,
            reBudatEnd: reBudatEnd
          },
          parameters: [],
          requestPage: { pageNo: this.currentpage, limit: 10, totalCount: null },
          sorts: []
        }
      })
        .then(response => {
          console.log('计提已处理翻页', response);
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
      //   url: COMP_URL + '/bpm/v3/bpm/received/query/handled/revokable',
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
      //     console.log('可撤销翻页', response);
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
</style>
