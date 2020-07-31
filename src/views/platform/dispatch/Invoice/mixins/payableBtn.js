import { showLoading, hideLoading } from "@/utils/loading";
import request from "@/utils/request";
import {
  BASE_GATEWAY_API,
  BASE_PHOTO_UPLOAD,
  BASE_PHOTO_PREVIEW,
  COMP_URL
} from "@/api/baseUrl";

export default () => {
  return {

    exitCompoundForm() {
      this.$confirm("您确定退出当前表单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.outerSkin.handleClose();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出提示"
          });
        });
    },
    // 显示例外
    showExceptions(val) {
      //console.log("显示列外按钮", val);
      this.addDynamicTags({
        describe: "显示例外",
        tabEnhance: "showException"
      });
    },
    // 表单预览
    formPreview(val) {
      //console.log("表单预览按钮", val);
      this.addDynamicTags({
        describe: "表单预览",
        tabEnhance: "formPreview"
      });
    },
    // 会计凭证
    createVoucher(val) {
      this.addDynamicTags({
        describe: "会计凭证",
        tabEnhance: "accountingVoucher"
      });
    },
    // 发票导入
    invoiceImport() {
      this.addDynamicTags({
        describe: "发票导入",
        tabEnhance: "invoiceImport",
        openTitle: "发票导入"
      });
    },
    // 申请关联
    invoiceCorrelation() {
      this.addDynamicTags({
        describe: "申请关联",
        tabEnhance: "invoiceImport",
        openTitle: "申请关联"
      });
    },
    // 发票查看
    invoicePreview(...arg) {
      console.log("发票查看", arg);
      this.addDynamicTags({
        describe: "发票查看",
        tabEnhance: "invoicePreview",
        invoiceImgUrl: arg[1].formData.URLFILE,
        invoiceNumer: arg[0].INVOICE_CODE
      });
    },
    // 保存按钮
    onSingleFormButtonSave(...arg) {
      console.log("点击保存按钮", arg);

      return this.$refs["comp"].onSaveFormData();
    },
    // 转办
    turnCheck({ buttonCode }) {
      console.log('buttonCode', buttonCode);
      this.openDialogFunc({
        actionName: "delegate",
        dialogType: "delegate",
        taskId: this.taskId,
        instId: this.instId,
        outerSkin: this.outerSkin,
        buttonCode
      });
    },
    // 确认提交
    pushCompoundForm(val) {
      this.$confirm("即将提交表单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          this.formSubmit(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 重新提交
    resetPushForm({ buttonCode }) {
      this.$confirm("即将重新提交表单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          this.resetNewPushForm(buttonCode);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 附件预览
    previewAccessoriesEvent() {
      if (this.docNumber) {
        this.addDynamicTags({
          describe: "附件预览",
          tabEnhance: "preview_accessories",
          tagVal:
            BASE_PHOTO_UPLOAD +
            "/open-api/image/showImages?billNo=" +
            this.docNumber
        });
      } else {
        this.$message.error("请先保存单据！");
      }
    },
    // 加签
    addTags({ buttonCode }) {
      this.openDialogFunc({
        actionName: "addtags",
        dialogType: "addtags",
        taskId: this.taskId,
        instId: this.instId,
        outerSkin: this.outerSkin,
        buttonCode
      });
    },
    // 回退
    rejectEvent({ buttonCode }) {
      this.openDialogFunc({
        actionName: "reject",
        dialogType: "reject",
        taskId: this.taskId,
        buttonCode
      });
    },
    // 同意
    agreeEvent({ buttonCode }) {
      this.openDialogFunc({
        actionName: "agree",
        dialogType: "agree",
        taskId: this.taskId,
        instId: this.instId,
        outerSkin: this.outerSkin,
        buttonCode
      });
    },
    // 影像回退
    fallbackAccessoriesEvent() {
      // console.log("影像撤销，", this);
      if (this.docNumber) {
        showLoading();
        return request({
          baseURL: BASE_GATEWAY_API,
          url: "/imageBillCancel/revocation?billNo=" + this.docNumber,
          method: "get"
        })
          .then(res => {
            hideLoading();
          })
          .catch(req => {
            hideLoading();
          });
      } else {
        this.$message.error("影像撤销失败，单据号为空。");
      }
    },
    // 同意-信用
    CRagreeEvent(val) {
      // console.log("同意-信用按钮", val);
      this.addDynamicTags({
        describe: "同意-信用",
        tabEnhance: "creditAgree",
        buttonCode: val.buttonCode
      });
    },
    // 驳回发起人
    rejectToStartEvent({ buttonCode }) {
      // console.log("点击驳回按钮");
      this.openDialogFunc({
        actionName: "rejectToStart",
        actionName2: "rejectToStart",
        dialogType: "reject",
        taskId: this.taskId,
        buttonCode
      });
    },

    // 添加附件
    addAccessoriesEvent() {
      if (this.docNumber) {
        this.addDynamicTags({
          describe: "添加附件",
          tabEnhance: "addAccessoriesEvent",
          tagVal:
            BASE_PHOTO_UPLOAD +
            "/#/files/imageCollect?userId=" +
            this.userId +
            "&billNo=" +
            this.docNumber
        });
      } else {
        this.$message.error("请先保存单据！");
      }
    },
    // 预览打印 方法名就是表单预览
    // 合同预览
    contractpreview(formData, formDefine, btnval) {
      //console.log("合同开始预览的参数", arguments)

      // console.log('按钮合同预览', arguments)
      let {
        CONTRACTNO = null,
        CONTRACT_NO = null,
        CONTRACTNUM,
        SOURCE_SYSTEM
      } = formData;
      var preConId =
        SOURCE_SYSTEM == "GSP" ? CONTRACTNUM : CONTRACTNO || CONTRACT_NO;

      // console.log('点击合同预览2', this., preConId, this.current_tag_form_data.formData)
      if (preConId) {
        this.addDynamicTags({
          describe: "合同预览",
          tabEnhance: "contractpreview",
          tagVal: BASE_PHOTO_PREVIEW + "/#/imageDetailOut?billNo=" + preConId
        });
      } else {
        this.$message.error("请先保存单据！");
        // this.$message.error('preConId为空，无法预览合同');
      }
    },
    // 资产新建
    assetCreation() {
      this.addDynamicTags({
        describe: "资产新建",
        tabEnhance: "assetCreation"
      });
    },
    // 前置表单 找不到方法
    // 获取价值 assectValue
    assectValue() {
      this.addDynamicTags({
        describe: "获取价值",
        tabEnhance: "assectValue"
      });
    },
    // 生成台账
    amoCreate() {
      if (this.docNumber) {
        return request({
          url:
            COMP_URL + `/scene/v3/outstandingaccount/create?docNumber=${this.docNumber}`,
          method: "get"
        })
          .then(res => {
            if (res.state == 200) {
              this.$message.success("新增成功!");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.$message.error(error.message);
          });
      }
    },
    // 审计线索
    auditClue() {
      console.log('审计线索');
      this.addDynamicTags({
        describe: "审计线索",
        tabEnhance: "auditClue"
      });
    },
    // 会议信息
    meetingInfo(info) {
      // console.log('会议信息',this.meetingTabInfo)
      this.meetingTabInfo.forEach(item => {
        this.addDynamicTags(item);
      });
    },
    // 商旅预订按钮方法
    lookSapVoucher() {
      // this.src: "https://163.177.112.28:44301/sap/bc/gui/sap/its/webgui/?~transaction=ZACCDOC&sap-client=800&sap-language=ZH&sap-user=p0017088&sap-password=asdf1234"
      this.addDynamicTags({
        describe: "商旅预订",
        tabEnhance: "lookDialogIframe",
        webUrl: "https://163.177.112.28:44301/sap/bc/gui/sap/its/webgui/?~transaction=ZACCDOC&sap-client=800&sap-language=ZH&sap-user=p0017088&sap-password=asdf1234"
      });
    },
    // 凭证预订按钮方法
    travelBooking() {
      this.addDynamicTags({
        describe: "商旅预订",
        tabEnhance: "lookDialogIframe",
        webUrl: "https://ct.ctrip.com/hotel-online/home/?reslang="
      });
    }
  };
};
