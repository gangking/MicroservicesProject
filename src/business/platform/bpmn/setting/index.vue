<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bpm-def-setting-dialog"
    fullscreen
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <div slot="title" style="padding-left: 10px;">
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
    </div>
    <ibps-layout
      v-if="dialogVisible"
      ref="layout"
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="ibps-bpm-layout"
    >
      <el-alert type="warning">
        <i class="ibps-icon-lightbulb-o" />点击空白处进行全局配置，点击对应的节点进行节点配置
        <el-button
          type="primary"
          plain
          icon="ibps-icon-file-code-o"
          size="mini"
          @click="onXmlClick('bpmn')"
        >BPMNXML</el-button>
        <el-button
          type="primary"
          plain
          icon="ibps-icon-file-code-o"
          size="mini"
          @click="onXmlClick('design')"
        >DesignXML</el-button>
      </el-alert>
      <bpmn-image ref="bpmnImage" @loading="loading=>dialogLoading =loading" @on-node="onNode" />
      <div slot="east">
        <bpmn-setting
          v-if="formData"
          :data="formData"
          :node-id="nodeId"
          :node-type="nodeType"
          :def-id="defId"
          :def-key="defKey"
          @getselectorValue="getselectorValue"
        />
      </div>
    </ibps-layout>
  </el-dialog>
</template>

<script>
import {
  saveSetting,
  saveRelation,
  getActiveRelation,
  setting,
  getXml
} from "@/api/platform/bpmn/bpmDefinition";
import { saveConfig } from "@/api/platform/bpmn/bpmConfigChain";
import { mapActions } from "vuex";
import ActionUtils from "@/utils/action";
import BpmnImage from "./bpmn-image";
import BpmnSetting from "./bpmn-setting";
import { getToken } from "@/utils/auth";

export default {
  name: "bpm-definition-setting",
  components: {
    BpmnImage,
    BpmnSetting
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defId: {
      type: String
    },
    defKey: {
      type: String
    },
    data: {
      type: Object
    },
    title: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      nodeType: "global",
      nodeId: "",
      formData: {},
      selectorValue: {},
      userTaskData: {}, //获取的全部的用户节点的数据
      configChainSave: [
        // {
        //   id: "",
        //   defId: "",
        //   nodeId: "",
        //   bsId: "",
        //   bsCode: "",
        //   disProfCode: "",
        //   btnProfCode: ""
        // }
      ]
    };
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        console.log("流程整个formData", val);
      },
      immediate: true
    }
  },
  methods: {
    splicingForm(id, formData) {
      formData.forEach((item, index) => {
        this.configChainSave.forEach((i, curIndex) => {
          if (i.markIndex == item.markIndex) {
            console.log("更新");
            this.$set(this.configChainSave[curIndex], "id", item.id);
            this.$set(this.configChainSave[curIndex], "defId", item.defId);
            //     this.$set(this.configChainSave[curIndex], "nodeId", item.nodeId);
            this.$set(this.configChainSave[curIndex], "bsId", item.bsId);
            this.$set(this.configChainSave[curIndex], "bsCode", item.bsCode);
            this.$set(
              this.configChainSave[curIndex],
              "disProfCode",
              item.disProfCode
            );
            this.$set(
              this.configChainSave[curIndex],
              "btnProfCode",
              item.btnProfCode
            );

            // this.configChainSave[curIndex].id = item.id;
            // this.configChainSave[curIndex].defId = item.defId;
            // this.configChainSave[curIndex].nodeId = item.nodeId;
            // this.configChainSave[curIndex].bsId = item.bsId;
            // this.configChainSave[curIndex].bsCode = item.bsCode;
            // this.configChainSave[curIndex].disProfCode = item.disProfCode;
            // this.configChainSave[curIndex].btnProfCode = item.btnProfCode;
          } else {
            // this.configChainSave.push({
            //   id: item.id,
            //   defId: item.defId,
            //   nodeId: item.nodeId,
            //   bsId: item.bsId,
            //   bsCode: item.bsCode,
            //   disProfCode: item.disProfCode,
            //   btnProfCode: item.btnProfCode
            // });
          }
        });
      });

      console.log(" this.configChainSave", this.configChainSave);
    },
    getselectorValue(val) {
      this.selectorValue = val;
    },
    ...mapActions({
      setMessageTypes: "ibps/bpmn/setMessageTypes",
      setNodeList: "ibps/bpmn/setNodeList",
      setCurNode: "ibps/bpmn/setCurNode",
      setDefId: "ibps/bpmn/setDefId"
    }),
    onNode(node) {
      this.nodeType = node.nodeType;
      this.nodeId = node.nodeId;
      // TODO: 滚动到表头
      window.scrollTo(0, 0);
      this.setCurNode(node);
    },
    onXmlClick(type) {
      const defId = this.defId;
      const access_token = getToken();
      this.$utils.open(getXml({ defId, type, access_token }));
    },
    // 保存数据
    handleSave() {
      this.saveData();
    },
    // 提交保存数据
    saveData() {
      // console.info("数组长度", this.configChainSave.length);

      // let filArr = this.configChainSave.filter(item => {
      //   return item.nodeId != null;
      // });
      // console.log("filArr", filArr);
      // saveConfig(filArr).then(response => {
      //   console.log(response, "保存流程");
      // });
      const loading = this.$loading({
        lock: true,
        text: this.$t("common.saving")
      });
      saveSetting({
        data: JSON.stringify(this.formData),
        defId: this.defId
      })
        .then(response => {
          loading.close();
          this.$emit("callback", this);
          ActionUtils.saveSuccessMessage(response.message, rtn => {
            if (rtn) {
              this.closeDialog();
            }
          });
          // if (this.selectorValue.bsKey) {
          // saveRelation({
          //   defId: this.defId,
          //   id: this.selectorValue.id,
          //   bsKey: this.selectorValue.bsKey,
          //   bsCode: this.selectorValue.bsCode
          // }).then(response => {
          //   this.$emit('callback', this)
          //   ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          //     if (rtn) {
          //       this.closeDialog()
          //     }
          //   })
          // }).catch((err) => {
          //   console.warn(err)
          // })
          // } else {
          //   this.$message({
          //     message: '请选择业务场景，否则后续无法正常工作',
          //     type: 'warning'
          //   });
          // }
        })
        .catch(err => {
          loading.close();
          console.warn(err);
        });
    },
    relationSave() {
      saveRelation({
        defId: this.defId,
        id: this.selectorValue.id,
        bsKey: this.selectorValue.bsKey,
        bsCode: this.selectorValue.bsCode
      })
        .then(response => {})
        .catch(err => {
          console.warn(err);
        });
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit("close", false);
    },

    // 获取表单数据
    getFormData() {
      this.nodeType = "global";
      this.nodeId = "";
      this.dialogLoading = true;
      if (this.$utils.isNotEmpty(this.data)) {
        this.formData = JSON.parse(JSON.stringify(this.data));
        this.initParameters();
        return;
      }
      setting({
        defId: this.defId,
        defKey: this.defKey
      })
        .then(response => {
          const responseData = response.data;
          // this.configChainSave = [];

          // console.log("bpmDefLayout表单数据", responseData.bpmDefLayout);
          // this.userTaskData = responseData.bpmDefLayout;
          // //  this.configChainSave;

          // responseData.bpmDefLayout.listLayout.forEach(item => {
          //   if (item.nodeType.key == "userTask") {
          //     let assignPoList = item.assignPoList;
          //     let commonNodeId = item.nodeId;
          //     assignPoList.forEach((i, index) => {
          //       this.configChainSave.push({
          //         id: i.id,
          //         defId: i.defId,
          //         nodeId: commonNodeId,
          //         bsDescribe: i.bsDescribe,
          //         configDescribe: i.configDescribe,
          //         profDesc: i.profDesc,
          //         bsId: i.bsId,
          //         bsCode: i.bsCode,
          //         disProfCode: i.disProfCode,
          //         btnProfCode: i.btnProfCode,
          //         markIndex: index
          //       });
          //     });
          //   }
          // });
          // console.log(" this.configChainSave", this.configChainSave);
          getActiveRelation({
            defId: this.defId
          })
            .then(res => {
              this.dialogLoading = false;
              this.formData = this.$utils.parseData(responseData.data);
              this.formData.global.business = res.data;
              this.initParameters({
                messageTypes: this.$utils.parseData(responseData.messageTypes)
              });
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    initParameters(parms = {}) {
      console.info(this.formData);
      this.loadFlowDiagram(this.defId);
      this.setDefId(this.defId);
      this.setNodeList(this.handlerNodeList(this.formData.nodes));
      if (this.$utils.isNotEmpty(parms.messageTypes)) {
        this.setMessageTypes(parms.messageTypes);
      } else {
        this.loadMessageTypes();
      }
    },
    loadFlowDiagram(defId) {
      this.$refs.bpmnImage.loadFlowDiagram(defId);
    },
    handlerNodeList(nodes) {
      if (this.$utils.isEmpty(nodes)) {
        return [];
      }
      const nodeList = [];
      nodes.forEach(node => {
        nodeList.push({
          value: node.id,
          label: node.node_name,
          nodeType: node.node_type
        });
      });
      return nodeList;
    },
    loadMessageTypes() {
      // TODO: 消息类型
      this.setMessageTypes();
    }
  }
};
</script>
<style lang="scss">
.bpm-def-setting-dialog {
  .el-dialog__body {
    overflow: hidden;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    width: "100%-500px";
    padding: 5px;
    background-color: #f5f5f7;
  }
}
</style>
