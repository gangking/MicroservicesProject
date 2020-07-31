<template>
  <div class="box">
    <div class="title">
      <span class="shu"></span>
      组织树
    </div>
    <el-tree :default-expand-all="true" :data="treeDataList" :props="defaultProps" @node-click="handleNodeClick" @node-contextmenu="handleNodeContextmenu"></el-tree>

    <div class="ibps-contentmenu-list" v-if="isShow" :style="positionStyle">
      <div class="ibps-contentmenu-item" v-for="(item,index) in contentmenuList" :key="index" @click="itemClick(item)">
        <i :class="item.icon"></i>
        <div class="ibps-contentmenu-item-label">
          {{item.label}}
        </div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="业务组编号" prop="groupNo">
          <el-input v-model="form.groupNo"></el-input>
        </el-form-item>
        <el-form-item label="业务组名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="最大在手单量" prop="maxBillNumber">
          <el-input v-model="form.maxBillNumber"></el-input>
        </el-form-item>
        <el-form-item label="基准工作量" prop="baseBillNumber">
          <el-input v-model="form.baseBillNumber"></el-input>
        </el-form-item>
        <el-form-item label="触发自动派单" prop="autoTriggerNumber">
          <el-input v-model="form.autoTriggerNumber"></el-input>
        </el-form-item>
        <el-form-item label="单次手动提单" prop="onceManPullNumber">
          <el-input v-model="form.onceManPullNumber"></el-input>
        </el-form-item>
        <el-form-item label="单次自动派单" prop="onceAutoPullNumber">
          <el-input v-model="form.onceAutoPullNumber"></el-input>
        </el-form-item>
        <el-form-item label="触发手动派单" prop="manTriggerNumber">
          <el-input v-model="form.manTriggerNumber"></el-input>
        </el-form-item>
        <el-form-item label="规则序号" prop="ruleSnNo">
          <el-input v-model="form.ruleSnNo"></el-input>
        </el-form-item>
        <el-form-item label="主副岗派单阀值" prop="deliverThreshold">
          <el-input v-model="form.deliverThreshold"></el-input>
        </el-form-item>
        <el-form-item label="组织状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择组织状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  props: {
    updateTreeFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    updateTreeFlag(val) {
      this.onload();
    }
  },
  data() {
    return {
      treeDataList: [],
      treeData: [],
      defaultProps: {
        children: 'next',
        label: 'name'
      },
      rankType: 'organization',
      positionStyle: {
        top: '10px',
        left: '5px'
      },
      isShow: false,
      activeInfo: {},
      dialogTitle: '新增业务组',
      dialogFormVisible: false,
      form: {
        groupNo: '',
        name: '',
        maxBillNumber: '',
        baseBillNumber: '',
        autoTriggerNumber: '',
        onceManPullNumber: '',
        onceAutoPullNumber: '',
        manTriggerNumber: '',
        ruleSnNo: '',
        status: '',
        deliverThreshold:''
      },
      rules: {
        groupNo: [{ required: true, message: '请输入业务组编码', trigger: 'blur' }],
        deliverThreshold: [{ required: true, message: '请输入主副岗派单阀值', trigger: 'blur' }],
        name: [{ required: true, message: '请输入业务组名称', trigger: 'blur' }],
        maxBillNumber: [{ required: true, message: '请输入最大在手单量', trigger: 'blur' }],
        baseBillNumber: [{ required: true, message: '请输入基准工作量', trigger: 'blur' }],
        autoTriggerNumber: [{ required: true, message: '请输入自动触发提取量', trigger: 'blur' }],
        onceManPullNumber: [{ required: true, message: '请输入单次手动提取量', trigger: 'blur' }],
        onceAutoPullNumber: [{ required: true, message: '请输入单次自动提取量', trigger: 'blur' }],
        manTriggerNumber: [{ required: true, message: '请输入手动触发提取量', trigger: 'blur' }],
        ruleSnNo: [{ required: true, message: '请输入规则序号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      contentmenuList: [
        {
          icon: 'el-icon-plus',
          label: '添加下级业务组'
        },
        {
          icon: 'el-icon-minus',
          label: '删除当前业务组'
        },
        {
          icon: 'el-icon-close',
          label: '关闭'
        }
      ]
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['groupTree', 'busGroupAddEdit', 'busGroupDeleteStop']),
    // 关闭添加框
    itemClick(info) {
      switch (info.label) {
        case '添加下级业务组':
          // 打开新增弹窗
          this.dialogFormVisible = true;
          break;
        case '删除当前业务组':
          console.log('删除当前业务组', this.activeInfo);
          if (this.activeInfo.next == null) {
            this.busGroupDeleteStop({
              ids: this.activeInfo.id,
              type: 'deleted'
            }).then(res => {
              this.refreshTree();
            });
          } else {
            this.$message.error('已存在下级，请先删除下级业务组。');
          }

          break;
      }
      // 关闭添加块
      this.isShow = false;
    },
    close() {
      this.form = {
        groupNo: '',
        name: '',
        maxBillNumber: '',
        baseBillNumber: '',
        autoTriggerNumber: '',
        onceManPullNumber: '',
        onceAutoPullNumber: '',
        manTriggerNumber: '',
        ruleSnNo: '',
        status: '',
        deliverThreshold:''
      };
      this.dialogFormVisible = false;
    },
    refreshTree() {
      // 刷新树
      this.groupTree().then(res => {
        for (var i = 0; i < res.length; i++) {
          this.setGroupId(res[i], res[i].id);
        }
        this.treeData = res;
        this.treeDataList = [
          {
            name: '组织管理',
            type: 'organization',
            next: JSON.parse(JSON.stringify(res))
          }
        ];
        var data = this.treeDataList[0];
        this.$emit('handleNodeClick', { type: 'organization', data });
        // console.log('整理好的树形数据', this.treeDataList);
      });
    },
    // 新增下级业务组
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.busGroupAddEdit(this.form).then(res => {
            if (res.state == 200) {
              this.dialogFormVisible = false;
              this.refreshTree();
            } else {
              this.$message.error('保存失败！注意业务组编码不可重复！');
            }
          });
        } else {
          return false;
        }
      });
    },
    // 鼠标右键
    handleNodeContextmenu(event, data, Node, component) {
      console.log('鼠标右键4', data);
      console.log('鼠标右键5', Node);
      this.activeInfo = data;
      // console.log('点在节点坐标', component.$el.offsetTop, component.$el.offsetLeft);
      switch (data.type) {
        case 'G':
          // 新增二级业务组
          this.contentmenuList = [
            {
              icon: 'el-icon-plus',
              label: '添加下级业务组'
            },
            {
              icon: 'el-icon-minus',
              label: '删除当前业务组'
            },
            {
              icon: 'el-icon-close',
              label: '关闭'
            }
          ];
          this.isShow = true;
          this.positionStyle = {
            top: component.$el.offsetTop + 60 + 'px',
            left: component.$el.offsetLeft + 150 + 'px'
          };
          this.openAdd(2);
          break;
        case 'NG':
          // 新增三级业务组
          if (Node.parent.data.type == 'G') {
            this.contentmenuList = [
              {
                icon: 'el-icon-plus',
                label: '添加下级业务组'
              },
              {
                icon: 'el-icon-minus',
                label: '删除当前业务组'
              },
              {
                icon: 'el-icon-close',
                label: '关闭'
              }
            ];
            this.isShow = true;
            this.positionStyle = {
              top: component.$el.offsetTop + 60 + 'px',
              left: component.$el.offsetLeft + 150 + 'px'
            };
            this.openAdd(3);
          } else if (Node.parent.data.type == 'NG') {
            // 删除三级
            this.contentmenuList = [
              {
                icon: 'el-icon-minus',
                label: '删除当前业务组'
              },
              {
                icon: 'el-icon-close',
                label: '关闭'
              }
            ];
            this.isShow = true;
            this.positionStyle = {
              top: component.$el.offsetTop + 60 + 'px',
              left: component.$el.offsetLeft + 150 + 'px'
            };
          } else {
            this.isShow = false;
          }
          break;
        default:
          this.isShow = false;
      }
    },
    // 设置新增参数
    openAdd(level) {
      this.dialogTitle = '新增下级';
      this.form = {
        groupNo: '',
        name: '',
        maxBillNumber: '',
        baseBillNumber: '',
        autoTriggerNumber: '',
        onceManPullNumber: '',
        onceAutoPullNumber: '',
        manTriggerNumber: '',
        ruleSnNo: '',
        status: ''
      };
      // this.dialogFormVisible = true;
      this.form['parentId'] = this.activeInfo.id;
      this.form['orgGroupId'] = this.activeInfo.groupId;
      this.form['level'] = level;
      console.log('新增下级参数', this.form);
    },
    onload() {
      this.groupTree().then(res => {
        for (var i = 0; i < res.length; i++) {
          this.setGroupId(res[i], res[i].id);
        }
        this.treeData = res;
        this.treeDataList = [
          {
            name: '组织管理',
            type: 'organization',
            next: JSON.parse(JSON.stringify(res))
          }
        ];

        console.log('整理好的树形数据', this.treeDataList);
      });
    },
    //
    setGroupId(datas, groupId) {
      for (var i in datas) {
        // console.log(datas['name']);
        datas['groupId'] = groupId;
        if (datas['next'] && datas['next'].length > 0) {
          for (var a = 0; a < datas['next'].length; a++) {
            this.setGroupId(datas['next'][a], groupId);
          }
        }
      }
    },
    handleNodeClick(data, Node, component) {
      var rankType = 'organization';
      // console.log('点击树节点', data, Node, component);
      switch (data.type) {
        case 'O':
          rankType = 'sharedPool'; // 点击组织要看共享池
          break;
        case 'P':
          rankType = 'businessGroup'; // 点击共享池要看业务组
          break;
        case 'G':
          rankType = 'oneBusinessGroup'; // 点击一级业务组看一级业务组成员
          break;
        case 'NG':
          rankType = 'twoBusinessGroup'; // 点击二级业务组看二级业务组成员
          break;
        case 'organization':
          rankType = 'organization';
          break;
      }
      this.$emit('handleNodeClick', { type: rankType, data });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  height: 100%;
.title {
  width: 250px;
  height: 50px;
  //   background: yellow;
  line-height: 50px;
  font-weight: 600;
  position: relative;
  padding-left: 10px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 16px;
  .shu {
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -9px;
    width: 4px;
    height: 18px;
    background: #e61a23;
  }
}
  /deep/ .el-tree{
    height: calc(100% - 50px);
    overflow: auto;
  }
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 120px !important;
        text-align: right;
      }
    }
  }
}

.ibps-contentmenu-list {
  position: absolute;
  width: 160px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  z-index: 1000;
  .ibps-contentmenu-item {
    padding: 8px 20px 8px 15px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
    .ibps-contentmenu-item-label {
      display: inline-block;
      margin-left: 5px;
    }
  }
}

/deep/ .el-tree {
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #409eff !important;
    color: white;
  }
}
</style>