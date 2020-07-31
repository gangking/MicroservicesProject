<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="'启动流程'"
    class="bpmn-agree-dialog"
    append-to-body
    top="5vh"
    width="50%"
    height="50%"
    @close="closeDialog"
    @open="getFormData"
  >
    <table v-loading="dialogLoading" class="table table-bordered table-striped">
      <thead>
        <tr>
          <td width="50%"><el-checkbox v-model="selectPath">选择路径
            <el-tooltip>
              <div slot="content">
                1、指定路径只支持一条; <br>
                2、同步网关、分支同步网关不支持指定路径；
              </div>
              <i class="ibps-icon-help red" /></el-tooltip>
          </el-checkbox></td>
          <td width="50%"><el-checkbox v-model="selectUser">指定执行人</el-checkbox></td>
        </tr>
      </thead>
      <tbody v-if="outgoingNodes&& outgoingNodes.length >0">
        <tr v-for="({nodeId,name}) in outgoingNodes" :key="nodeId">
          <td>
            <el-radio
              v-if="selectPath"
              v-model="selectPathLine"
              :label="nodeId"
              :disabled="!nodeSupportSelectPath[nodeId]"
            >{{ name }}</el-radio>
            <span v-else>{{ name }}</span>
          </td>
          <td>

            <!---选择用户:--->
            <el-checkbox
              v-if="selectUser"
              v-model="checkAll[nodeId]"
              :indeterminate="isIndeterminate[nodeId]"
              @change="(val)=>handleCheckAllChange(val,nodeId)"
            >全选</el-checkbox>

            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="selectNodeUser1[nodeId]"
              :disabled="!selectUser"
            >
              <!-- @change="(data)=> handleCheckedUsersChange(data,nodeId)" -->
              <el-checkbox
                v-for="nodeUser in outgoingNodesUsersMap[nodeId]"
                :key="nodeUser.id"
                :label="nodeUser.id+''"
                @change="handleCheckedUsersChange(nodeUser.id,nodeId)"
              >{{ nodeUser.name }}
              </el-checkbox>
            </el-checkbox-group>
            <!--TODO: 人员选择器-->
            <el-button v-if="selectUser" type="primary">选择</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-send" @click="handleSave()">启动</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { startOutgoing } from '@/api/platform/bpmn/bpmInst'
export default {
  props: {
    visible: Boolean,
    defId: String,
    data: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,

      selectPath: false,
      selectUser: false,

      selectPathLine: '',
      selectNodeUser: { },
      isIndeterminate: { },
      checkAll: { },
      nodeSupportSelectPath: {}, // 节点支持选择路径
      outgoingNodes: [],
      outgoingNodesUsersMap: {}
    }
  },
  computed: {
    selectNodeUser1: {
      get() {
        return JSON.parse(JSON.stringify(this.selectNodeUser))
      },
      set(val) {
        this.selectNodeUser = JSON.parse(JSON.stringify(val))
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    getFormData() {
      this.dialogLoading = true
      this.selectPath = false
      this.selectUser = false
      startOutgoing({
        defId: this.defId,
        data: JSON.stringify(this.data)
      }).then(response => {
        this.dialogLoading = false
        const variables = response.variables
        this.outgoingNodes = variables.outgoingNodes
        this.outgoingNodesUsersMap = variables.outgoingNodesUsersMap
        this.nodeSupportSelectPath = variables.nodeSupportSelectPath

        if (this.outgoingNodes && this.outgoingNodes.length > 0) {
          for (let i = 0; i < this.outgoingNodes.length; i++) {
            const node = this.outgoingNodes[i]
            const nodeId = node.nodeId
            const nodeUsers = this.outgoingNodesUsersMap[nodeId] || []
            const selectUser = []
            nodeUsers.forEach(user => {
              selectUser.push(user.id)
            })
            this.selectNodeUser[ nodeId] = selectUser
            this.isIndeterminate[nodeId] = false
            this.checkAll[nodeId] = this.$utils.isNotEmpty(nodeUsers)
          }
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {
      const nodeUsers = []
      const destination = this.selectPath ? this.selectPathLine : ''

      if (this.selectUser) {
        for (let i = 0; i < this.outgoingNodes.length; i++) {
          const nodeId = this.outgoingNodes[i].nodeId
          const outgoingNodesUsers = this.outgoingNodesUsersMap[nodeId] || []
          const selectNodeUser = this.selectNodeUser[nodeId]
          const executors = []
          outgoingNodesUsers.forEach(user => {
            if (selectNodeUser.indexOf(user.id) > -1) {
              user.groupType = ''
              executors.push(user)
            }
          })

          nodeUsers.push({
            nodeId: nodeId,
            executors: executors
          })
        }
      }

      this.$emit('action-event', {
        destination,
        nodeUsers: JSON.stringify(nodeUsers)
      })
    },
    handleCheckAllChange(val, nodeId) {
      const allValue = []
      this.outgoingNodesUsersMap[nodeId].forEach(user => {
        allValue.push(user.id)
      })
      this.selectNodeUser[nodeId] = val ? allValue : []
      this.isIndeterminate[nodeId] = false
    },
    handleCheckedUsersChange(value, nodeId) {
      const data = JSON.parse(JSON.stringify(this.selectNodeUser[nodeId]))
      const index = data.findIndex((v) => {
        return v === value
      })
      if (index > -1) {
        data.splice(index, 1)
      } else {
        data.push(value)
      }
      const updateData = JSON.parse(JSON.stringify(this.selectNodeUser))
      updateData[nodeId] = data
      this.selectNodeUser1 = updateData

      const checkedCount = data.length
      const allCount = this.outgoingNodesUsersMap[nodeId].length
      this.checkAll[nodeId] = checkedCount === allCount
      this.isIndeterminate[nodeId] = checkedCount > 0 && checkedCount < allCount
    }
  }
}
</script>
