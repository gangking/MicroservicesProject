<template>
  <div style="height: 100%;padding-top: 18px;box-sizing: border-box;">
    <div class="pro-btn">
      <el-button type="text" plain class="btn-protu" title="流程图" @click="btnFlowPic"><i class="iconfont icon-workflowmonitoring " />
      </el-button>
      <el-button type="text" plain title="审批历史" class="btn-prolog" @click="btnFlowLog"><i class="iconfont icon-shenpilishi " />
      </el-button>
    </div>
    <div class="headeBox">
      <!-- 迁移container -->
      <!-- <div class="pro-title">审批流程的API</div> -->
      <div class="pro-gress"><i class="icon-uniE06D1" title="刷新" @click="update" />处理进度</div>
    </div>

    <el-timeline v-loading="loading" class="sanytimeline">
      <el-timeline-item v-for="(v, i) in StepInfo" :key="i" :icon="v.icon" :type="v.type" :color="v.status | filterColor" :size="v.size" :timestamp="v.timestamp" :message="v.message">
        <div class="nodeContent">
          <span :title="v.content">
            {{ v.content }}
          </span>
          <div v-if="v.langTime" class="langTime" v-html="v.langTime">
            <!-- 耗时<br>{{ v.langTime }} -->
          </div>
        </div>
        <div class="nodeStepTxt" :style="v.timestamp?'':'top:15px;'" v-html="v.auditorName+v.statusName">
          <!-- {{ v.auditorName+v.statusName }} -->
        </div>
        <div :class="isoption?'option optionShow':'option'" v-show="v.opinion" @click="isoption=isoption?false:true">
          审批意见: {{v.opinion}}
        </div>
        <div v-if="i != (StepInfo.length-1)" class="line" :style="v.line=='dashed'?'border-left: 3px dashed #E4E7ED;':''" />
      </el-timeline-item>
    </el-timeline>
    <!--流程图-->
    <flow-diagram-dialog :visible="flowDiagramVisible" :def-id="processDefId" class="btnProcess" :task-id="taskId" :inst-id="instId" @close="visible => flowDiagramVisible= visible" />
    <!--审批历史-->
    <approval-history-dialog :visible="approvalHistoryVisible" :task-id="taskId" class="btnProcess" :inst-id="instId" @close="visible => approvalHistoryVisible= visible" />
  </div>
</template>
<script>
// 导入流程数据模型
import flowHistoryModel from '@/js-model/invoice-flow-history.js';
import FlowDiagramDialog from '@/business/platform/bpmn/components/flow-diagram/dialog.vue';
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog.vue';
import flowBtnApi from '@/api/platform/invoice/flowBtn.js';
import axios from 'axios';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeBase');
export default {
  name: 'timeline',
  components: {
    FlowDiagramDialog,
    ApprovalHistoryDialog
  },
  data() {
    return {
      isoption: false,
      flowDiagramVisible: false,
      approvalHistoryVisible: false,
      loading: false,
      goTaskId: false
    };
  },
  computed: {
    ...mapState([
      'instId', // 流程实例ID
      'taskId', // 任务ID
      'processDefId',
      'processSteps'
    ]),
    StepInfo() {
      console.log('(this.processSteps', this.processSteps);
      var data = this.setData(this.processSteps);
      return data;
    }
  },
  filters: {
    filterColor(status) {
      console.log('状态值', status);
      var color = '#D9D9D9';
      switch (status) {
        case 'oppose':
        case 'reject':
        case 'rejectToStart':
        case 'revoke':
        case 'recoverToStart':
        case 'sign_no_pass':
        case 'abandon':
        case 'manual_end':
        case 'suspend':
        case 'signRecoverCancel':
        case 'passCancel':
        case 'notPassCancel':
        case 'signBackCancel':
        case 'rejectToPrevious':
          color = '#F56C6C';
          break;
        case 'kip':
        case 'transAgree':
        case 'complete':
        case 'submit':
        case 'resubmit':
        case 'agree':
        case 'sign_pass':
        case 'shift':
        case 'addSign':
          color = '#7FCC59';
          break;
        case 'pending':
        case 'transforming':
          color = '#1890FF';
          break;
        case 'notApproved':
          color = '#D9D9D9';
          break;
        default:
          color = '#D9D9D9';
      }
      return color;
    }
  },
  created() {
    this.loading = true;
    this.getProcessStep();
  },
  methods: {
    ...mapActions(['getProcessStep']),
    update() {
      this.loading = true;
      this.getProcessStep();
    },
    setData(data) {
      console.log('获取流程进度信息', data);
      this.loading = true;
      // 使用this.$options.filters[]方式获取本地过滤器
      const temp = this.$options.filters['filterColor'];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        item.content = item.taskName;
        item.timestamp = this.timestampToTime(item.completeTime);
        item.icon = ''; // icon-uniE11C,icon-uniE270,icon-uniE271,icon-yuan2
        item.size = 'large';
        if (i < data.length - 1) {
          var color = temp(data[i + 1].status);
          console.log('下一个节点颜色', color, i);
          if (color == '#D9D9D9') {
            item.line = 'dashed';
          } else {
            item.line = '';
          }
        }
        if (item.completeTime && i < data.length - 1) {
          item.langTime = this.getTimeHoursLang(data[i].createTime, data[i + 1].completeTime);
        }

        if (item.status == 'notApproved' || item.status == 'pending') {
          if (!item.qualifiedExecutor) {
            item.auditorName = '';
          } else {
            console.log('审批详情', item.qualifiedExecutor);
            var auditorName = '';
            for (var j = 0; j < item.qualifiedExecutor.length; j++) {
              var a = item.qualifiedExecutor[j];
              //   item.auditorName += a.executor + '、'
              if (j == item.qualifiedExecutor.length - 1) {
                auditorName += a.executor + '<br/>';
              } else {
                auditorName += a.executor + '、';
              }
            }
            item.auditorName = auditorName;
            console.log('最终详情', item.auditorName);
          }
        } else {
          // item.auditorName = ''
        }
      }
      this.loading = false;
      return data;
    },
    // 求两个时间戳时长间隔
    getTimeHoursLang(startTime, endTime) {
      if (!startTime || !endTime) {
        return;
      }
      // var utc = endTime - startTime
      // var langTime = (utc / (60 * 60 * 1000)).toFixed(2) // 求时长，并且保留两位小数
      // return langTime
      var date3 = endTime - startTime; //时间差秒
      //计算出相差天数
      var days =
        Math.floor(date3 / (24 * 3600 * 1000)) == 0
          ? ''
          : Math.floor(date3 / (24 * 3600 * 1000)) + '天' + '<br/>';

      //计算出小时数
      var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours =
        Math.floor(leave1 / (3600 * 1000)) == 0
          ? ''
          : Math.floor(leave1 / (3600 * 1000)) + '时' + '<br/>';

      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes =
        Math.floor(leave2 / (60 * 1000)) == 0 ? '' : Math.floor(leave2 / (60 * 1000)) + '分';

      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      return '耗时<br>' + days + hours + minutes;
    },
    // 时间戳转化
    timestampToTime(timestamp) {
      if (!timestamp) {
        return;
      }
      var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes();
      return Y + M + D + h + m;
    },
    // 流程图组件调用
    btnFlowPic() {
      this.flowDiagramVisible = true;
      // this.$emit('onBtnFlowPic', true)
    },
    // 审批历史
    btnFlowLog() {
      this.approvalHistoryVisible = true;
      // this.$emit('onBtnFlowLog', false)
    }
  }
};
</script>
<style lang="scss">
.headeBox {
  //   height: 96px;
  //   padding: 52px 0 20px 0; // 实际高度96+60+20=176px
  //   padding: 0; // 实际高度96+60+20=176px'
  //   margin-top: 56.8px;

  padding: 0;
  // margin-top: 49px;
  border-top: 1px solid white;
  padding-top: 7px;
}

.pro-title {
  font-weight: 500;
  font-size: 16px;
  /* margin-top: 15px; */
  margin-bottom: 10px;
  color: #ef071d;
  opacity: 0;
}

.pro-gress {
  margin-bottom: 10px;
  text-align: left;
  padding-left: 36px;
  font-weight: bold;

  i {
    margin-right: 10px;
    color: #2b7d2b;
    font-size: 18px;
  }
}

.btn-protu {
  /* width: 70px; */
  padding-left: 1px;
  padding-right: 1px;
  height: 32px;
}

.btn-protu i {
  margin-right: 2px;
  vertical-align: text-bottom;
}

.btn-prolog {
  /*  width: 80px; */
  padding-left: 1px;
  padding-right: 1px;
  height: 32px;
}

.btn-prolog i {
  margin-right: 2px;
  vertical-align: text-bottom;
}

.sanytimeline {
  overflow: auto;
  padding-top: 2px;
  height: calc(100% - 76px); //  - 176 - 2px
  position: relative;
  z-index: 100000;
  /deep/ .el-timeline-item {
    &:last-child {
      .line {
        display: none;
      }
    }
    .el-timeline-item__node--large {
      padding: 1px;
      //   left: -3px;
      left: 0;
      width: 10px;
      height: 10px;
      .el-timeline-item__icon {
        font-size: 0px;
        display: none;
      }
    }
    .el-timeline-item__timestamp {
      font-size: 12px;
    }
  }
  .nodeContent {
    position: relative;
    font-size: 12px;
    white-space: nowrap;
    //   overflow: hidden;
    text-overflow: ellipsis;

    .langTime {
      width: 38px;
      position: absolute;
      // text-align: center;
      left: -57px;
      top: 30px;
      font-size: 11px;
      overflow-wrap: break-word;
      white-space: normal;
    }
  }
  .nodeStepTxt {
    font-size: 12px;
    // position: absolute;
    // top: 42px;
    margin-top: 37px;
  }
  .option {
    font-size: 12px;
    margin-top: 10px;
    overflow: hidden;
    cursor: pointer;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 3;
    // word-break:break-all;
    // -webkit-box-orient: vertical;
  }
  .optionShow {
    display: block;
  }
  .el-timeline-item__wrapper {
    position: relative;
    padding-left: 20px;
    top: 0px;
    text-align: left;
    // height: 70px;
    padding-bottom: 35px;
  }
  .el-timeline-item__content {
    width: 95%;
    .line {
      height: 100%;
      position: absolute;
      border-left: 3px solid #e4e7ed;
      top: 16px;
      //   left: 1.3px;
      left: 4px;
    }
  }
  .el-timeline-item__tail {
    border-left: 2px dashed #e4e7ed;
    opacity: 0;
  }
}

.pro-btn {
  .el-button {
    width: 50px;
    height: 24px;
    position: relative;
    text-align: center;
    line-height: 7px;
    border: none;
    font-size: 21px;
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: 21px;
      left: 50%;
      top: 0;
      -webkit-transform: translate(-50%);
      transform: translate(-50%);
      //   display: flex;
      //   justify-content: space-around;
      .txt {
        position: absolute;
        top: 0;
        left: 60%;
        transform: translateX(-50%);
      }
      i {
        line-height: 21px;
        position: absolute;
        left: 6px;
      }
    }
  }
}
</style>
