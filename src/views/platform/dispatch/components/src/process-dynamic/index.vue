<template>
  <div class="processBox">
    <!--同意-->
    <agree-dialog :visible="isAgreeVisible" :action="actionName" :task-id="taskId" :version="version" @close="dialogClose" @action-event="handleActionEvent" />
    <!-- @close="visible => agreeDialogVisible= visible" -->
    <!--驳回-->
    <reject-dialog :visible="isRejectVisible" :action="actionName" :task-id="taskId" @close="dialogClose" @action-event="handleActionEvent" />
    <!--  @close="visible => rejectDialogVisible= visible" -->
    <addacc :visible="isPeviewAccVisible" :action="actionName" :task-id="taskId" @close="dialogClose" @action-event="handleActionEvent" />
    <!--  @close="visible => rejectDialogVisible= visible" -->
    <!-- 转办 -->
    <delegate-dialog :visible="isDelegateVisible" :action="actionName" :task-id="taskId" :inst-id="instId" :outerSkin="outerSkin" @close="dialogClose" @action-event="handleActionEvent" />
    <!-- 加签 -->
    <addtags :visible="isAddtagsVisible" :action="actionName" :task-id="taskId" :inst-id="instId" :outerSkin="outerSkin" @close="dialogClose" @action-event="handleActionEvent" />
  </div>

</template>

<script>
import AgreeDialog from '@/business/platform/bpmn/form-ext/agree';
import RejectDialog from '@/business/platform/bpmn/form-ext/reject';
import addacc from '@/business/platform/bpmn/form-ext/addacc';
import DelegateDialog from '@/business/platform/bpmn/task-change/delegate';
import addtags from '@/business/platform/bpmn/task-change/addtags';

const processEventMap = {
  oppose: 'pushOpposeEvent',
  agree: 'pushAgreeEvent',
  paySend: 'pushPayEvent',
  reject: 'pushRejectEvent',
  addacc: 'pushAddAccEvent',
  rejectToStart: 'pushrejectToStartEvent',
  delegate: 'pushdelegateEvent',
  addtags: 'pushAddtagsEvent'
};
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapGetters } = createNamespacedHelpers(
  "ibps/compositeDolog"
);
export default {
  name: 'process-dynamic',
  components: {
    AgreeDialog,
    RejectDialog,
    addacc,
    DelegateDialog,
    addtags
  },
  inject: ['payable'],

  props: {
    itemVal: {
      type: Object,
      default() {
        return {
          taskId: null,
          instId: null,
          outerSkin: null,
          actionName: null,
          dialogType: null
        };
      }
    },
    dialogData: {
      type: Object,
      default() {
        return {
          taskId: null,
          instId: null,
          outerSkin: null,
          actionName: null,
          dialogType: null
        };
      }
    }
  },

  data() {
    return {
      agreeDialogVisible: false, // 同意,反对
      rejectDialogVisible: false, // 驳回，驳回发起人
      version: ''
    };
  },
  mounted() {
    console.log('dialogData', this.itemVal);
  },
  computed: {
    ...mapGetters(["isHasFormExceptions"]),
    taskId() {
      // 流程任务ID
      return this.itemVal.taskId;
    },
    instId() {
      return this.itemVal.instId;
    },
    outerSkin() {
      return this.itemVal.outerSkin;
    },
    actionName() {
      return this.itemVal.actionName;
    },
    dialogType() {
      console.log('this.dialogData.dialogType', this.itemVal);

      return this.itemVal.dialogType;
    },
    isRejectVisible() {
      return this.dialogType == 'reject';
    },
    isAgreeVisible() {
      return this.dialogType == 'agree';
    },
    isPeviewAccVisible() {
      return this.dialogType == 'addacc';
    },
    isDelegateVisible() {
      return this.dialogType == 'delegate';
    },
    isAddtagsVisible() {
      return this.dialogType == 'addtags';
    },
    buttonCode() {
      return this.itemVal.buttonCode;
    }
  },

  methods: {
    dialogClose() {
      this.itemVal.dialogType = '';
      this.$emit('close', false);
    },
    /**
     *
     */
    handleActionEvent(action, processParams) {
      if (this.isHasFormExceptions) {
        this.$message.error("您仍有未处理的例外消息，请前往例外区处理。");
        return;
      }
      console.log('handleActionEvent', action, processParams);
      processParams.actionName = this.actionName;

      processEventMap[action] &&
        this.payable.onActionEvent(
          processEventMap[action],
          { bindFunction: processEventMap[action] },
          this.payable.$refs['comp'],
          {
            buttonCode: this.buttonCode,
            processParams
          }
        );
    }
  }
};
</script>

<style scoped>
</style>
