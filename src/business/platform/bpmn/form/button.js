import _ from 'lodash'
import Utils from '@/utils/util'
import FormrenderResponseButton from '@/business/platform/form/formrender/button'
import JForm from '@/business/platform/form/utils/JForm'// 自定义脚本

var BpmnButton
window.BpmnButton = BpmnButton = function(options) {
  this.response_buttons = []
  this.initButtons(options)
}

BpmnButton.prototype = {
  initButtons: function(options) {
    var buttons = options.buttons
    var params = options.params
    var suspendState = params.suspendState
    for (var i = 0; i < buttons.length; i++) {
      var rf = buttons[i]
      rf.alias = rf[BpmnButton.key.BUTTON_TYPE]
      rf.label = rf[BpmnButton.key.LABEL]

      if ((rf.alias === 'suspendProcess' && suspendState === '2') || // 挂起
      (rf.alias === 'recoverProcess' && suspendState === '1')) { // 恢复
        continue
      }

      if (
        rf.alias === 'startCommu' || // 屏蔽-沟通
         rf.alias === 'commu' || // 屏蔽-沟通
         rf.alias === 'startTrans' || // 屏蔽-流转
         rf.alias === 'agreeTrans' || // 屏蔽-同意流转
         rf.alias === 'opposeTrans') { // 屏蔽-反对流转
        continue
      }

      var button = new BpmnButton.Models['ResponseButton' + (_.upperFirst(rf.alias))](rf, params)

      // 初始化按钮事件
      this.response_buttons.push(button)
    }
  }
}

BpmnButton.Models = {}
BpmnButton.BUTTON_TYPES = ['close', 'startFlow', 'lock', 'unlock', 'forceUnlock', 'agree', 'oppose', 'abandon', 'saveDraft', 'reject', 'endProcess', 'delegate', 'addSign', 'startCommu', 'commu', 'startTrans', 'flowImage', 'approvalHistory', 'opposeTrans', 'agreeTrans', 'suspendProcess', 'recoverProcess', 'print', 'rejectToStart', 'revoke', 'custom']
BpmnButton.key = {
  BUTTON_TYPE: 'alias',
  LABEL: 'name'
}

BpmnButton.VERSION = '3.0.0'

/**
 * 流程表单按钮
 */
BpmnButton.Models.ResponseButton = FormrenderResponseButton.extend({
  style: 'primary',
  plain: true,
  aliasKey: BpmnButton.key.BUTTON_TYPE,
  getTitle: function() {
    return this.get('title') || ''
  },
  getProInstId: function() {
    return this.get('proInstId')
  },
  getDefId: function() {
    return this.get('defId')
  },
  // 版本号
  getVersion: function() {
    return this.get('version')
  },
  getFormKey: function() {
    return this.get('formKey')
  },
  getTaskId: function() {
    return this.get('taskId')
  },
  getNodeId: function() {
    return this.get('nodeId')
  },
  getLockUser: function() {
    return this.get('lockUser')
  },
  getUserAssign: function() {
    return this.get('userAssign')
  },
  isDraft: function() {
    return Utils.isNotEmpty(this.getProInstId())
  },
  isCreateInstance: function() {
    return Utils.isEmpty(this.getTaskId())
  },
  isHideOpinion: function() {
    return this.get('isHideOpinion') || false
  },
  isHidePath: function() {
    return this.get('isHidePath') || false
  },
  isCommonJumpType: function() {
    return this.get('isCommonJumpType') || false
  },
  isFirstNodeUserAssign: function() {
    return this.get('firstNodeUserAssign') || false
  },
  isEnd: function() {
    return this.get('isEnd') || false
  },
  isHide: function() {
    return (this.isCommonJumpType() && (this.isCommonJumpType() === true || this.isCommonJumpType() === 'true') &&
            this.isHideOpinion() && (this.isHideOpinion() === true || this.isHideOpinion() === 'true') &&
            this.isHidePath() && (this.isHidePath() === true || this.isHidePath() === 'true')) ||
          (this.isEnd() && (this.isEnd() === true || this.isEnd() === 'true') &&
            this.isHideOpinion() && (this.isHideOpinion() === true || this.isHideOpinion() === 'true')
          )
  },
  hasFormOpinion: function() {
    //  if($('[data-toggle="approval_opinion" ]').length > 0)
    //    return true;
    return false
  },
  getFormOpinionDataStr: function() {
    var formOpinion = this.get('formOpinion')
    var nodeId = this.getNodeId()
    var opinionData = this.getOpinionData()
    var data = ''
    var formOpinionData = {}
    if (Utils.isNotEmpty(formOpinion)) {
      for (var o in formOpinion) {
        formOpinionData[formOpinion[o]] = o
      }
    }

    if (formOpinionData[nodeId]) {
      data = opinionData[formOpinionData[nodeId]] || ''
    } else {
      // 1、如果只有一个，多个，取最后一个
      if (Utils.isEmpty(opinionData)) {
        for (var p in opinionData) {
          data = opinionData[p] || ''
        }
      }
    }

    return data
  },
  afterScript(btn, formData, hasScript) {
    if (!hasScript) return
    const afterSubmitResult = JForm._afterSubmit(this, btn.getAlias(), formData)
    if (typeof (afterSubmitResult) !== 'undefined' && !afterSubmitResult) {
      return
    }
  }
})

// 关闭
BpmnButton.Models.ResponseButtonClose = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-close',
  style: 'default',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

/**
 * 启动流程
 */
BpmnButton.Models.ResponseButtonStartFlow = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-send',
  action(btn) {
    // 验证表单是否正确
    this.validate(valid => {
      if (valid) {
        // 表单提交校验
        const formSubmitVerify = this.getFormSubmitVerify()
        if (this.$utils.isNotEmpty(formSubmitVerify)) {
          this.$message.closeAll()
          return this.$message.warning(formSubmitVerify.message)
        }
        this.handleActionEvent(btn.getAlias())
      } else {
        this.formErrorToast()
      }
    })
  }

})
// 保存草稿
BpmnButton.Models.ResponseButtonSaveDraft = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-save',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 锁定
BpmnButton.Models.ResponseButtonLock = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lock',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 解锁
BpmnButton.Models.ResponseButtonUnlock = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-unlock-alt',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 强制解锁
BpmnButton.Models.ResponseButtonForceUnlock = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-unlock',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 同意
BpmnButton.Models.ResponseButtonAgree = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-check-square-o',
  action(btn) {
    // 验证表单是否正确
    this.validate(valid => {
      if (valid) {
        // 表单提交校验
        const formSubmitVerify = this.getFormSubmitVerify()
        if (this.$utils.isNotEmpty(formSubmitVerify)) {
          this.$message.closeAll()
          return this.$message.warning(formSubmitVerify.message)
        }
        this.handleActionEvent(btn.getAlias())
      } else {
        this.formErrorToast()
      }
    })
  }
})

// 反对
BpmnButton.Models.ResponseButtonOppose = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-close',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 弃权
BpmnButton.Models.ResponseButtonAbandon = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-hand-o-up',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 驳回
BpmnButton.Models.ResponseButtonReject = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lastfm',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 驳回发起人
BpmnButton.Models.ResponseButtonRejectToStart = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-send',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 驳回上一步
BpmnButton.Models.ResponseButtonRejectToPrevious = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-backward',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 终止流程
BpmnButton.Models.ResponseButtonEndProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 转办
BpmnButton.Models.ResponseButtonDelegate = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-share',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 补签
BpmnButton.Models.ResponseButtonAddSign = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-group',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 开始沟通
BpmnButton.Models.ResponseButtonStartCommu = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-comment-o',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 开始流转
BpmnButton.Models.ResponseButtonStartTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 沟通
BpmnButton.Models.ResponseButtonCommu = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-comment-o',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 流程图
BpmnButton.Models.ResponseButtonFlowImage = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-image',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 审批历史
BpmnButton.Models.ResponseButtonApprovalHistory = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-bars',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 反对流转
BpmnButton.Models.ResponseButtonOpposeTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 同意流转
BpmnButton.Models.ResponseButtonAgreeTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 挂起
BpmnButton.Models.ResponseButtonSuspendProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 恢复
BpmnButton.Models.ResponseButtonRecoverProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-ioxhost',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 打印
BpmnButton.Models.ResponseButtonPrint = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-print',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 撤销
BpmnButton.Models.ResponseButtonRevoke = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lock',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

// 流程实例明细
BpmnButton.Models.ResponseButtonInstanceDetail = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-detail',
  action: function(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 自定义
BpmnButton.Models.ResponseButtonCustom = BpmnButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-cog',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})

export default BpmnButton
