<template>
  <div ref="ibpsTree" class="ibps-tree">
    <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar :actions="toolbars" type="icon" @action-event="handleActionEvent" />
    </div>
    <div v-if="$slots.searchForm" ref="searchForm" class="ibps-tree-search-form">
      <slot name="searchForm" />
    </div>
    <div :style="{ height:treeHeight+'px'}">
      <el-scrollbar style="height: 100%;" wrap-class="ibps-tree-wrapper">
        <el-tree v-if="multiple" ref="elTree" :data="treeData" v-bind="treeOptions" :check-strictly="checkStrictly||false" :node-key="nodeKey" :default-checked-keys="defaultCheckedKeys" :show-checkbox="showCheckbox||true" :check-on-click-node="true" @node-click="handleNodeClick" @check="handleCheck" />
        <!-- 单选-->
        <el-tree v-else ref="elTree" v-bind="treeOptions" :data="treeData" :check-strictly="checkStrictly||false" :node-key="nodeKey" v-loading="thisLoading" :default-checked-keys="defaultCheckedKeys" @node-click="handleNodeClick" @node-expand="nodeOpen">
          <span slot-scope="scope" class="custom-tree-node">
            <el-radio v-model="radio" :label="scope.data[pkKey]" :disabled="scope.data.id==='0'||scope.data.disabled!== null?scope.data.id==='0'||scope.data.id===0?true:scope.data.disabled:null" @change="changeRadio(scope.data)">{{ scope.node.label }}</el-radio>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import TreeUtils from '@/utils/tree';
import { newFindTreeData } from '@/api/platform/org/org';
export default {
  props: {
    title: String,
    nodeKey: {
      type: String,
      default: 'id'
    },
    showCheckbox: Boolean,
    checkOnClickNode: {
      type: Boolean,
      default: true
    },
    checkStrictly: Boolean,
    height: {
      type: Number,
      default: 400
    },
    dataType: {
      // 数据类型，tree：树形，list:列表
      type: String,
      default: 'list'
    },
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    defaultCheckedKeys: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: true
    },
    toolbars: {
      type: Array,
      default: () => {
        return [
          {
            key: 'refresh'
          },
          {
            key: 'expand'
          },
          {
            key: 'compress'
          }
        ];
      }
    },
    contextmenus: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      checkedId: '',
      treeHeight: this.height,
      isExpand: true,
      radio: '',
      check: true,
      thisLoading: false
    };
  },
  computed: {
    treeData() {
      if (!this.data || this.data.length === 0) return [];
      for (var i = 0; i < this.data.length; i++) {
        var item = this.data[i];
        item.children = JSON.parse(item.children);
      }
      if (this.dataType === 'list') {
        var data = TreeUtils.transformToArrayFormat(JSON.parse(JSON.stringify(this.data)), {
          idKey: this.treeOptions['node-key'],
          pIdKey: this.pidKey,
          childrenKey: this.treeOptions['props']['children']
        });
        return data;
      } else {
        return JSON.parse(JSON.stringify(this.data));
      }
    },
    treeOptions() {
      const defaultOptions = {
        'node-key': 'id',
        'pid-key': 'parentId',
        rootPId: null,
        'default-expand-all': false,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name'
        }
      };
      return Object.assign(defaultOptions, this.options);
    },
    pkKey() {
      return this.treeOptions['node-key'] || 'id';
    },
    pidKey() {
      return this.treeOptions['pid-key'];
    },
    rootPId() {
      return this.treeOptions['rootPId'] || null;
    }
  },
  watch: {
    height() {
      this.handleTreeHeight();
    },
    treeData() {
      this.$emit('getorgloadingflag', false);
    }
  },
  mounted() {
    this.handleTreeHeight();
  },
  methods: {
    nodeOpen(data) {
      var id = data.id;
      var activeInfo = JSON.parse(JSON.stringify(data));
      // 如果当前节点下已经有了数据，则不需要再请求数据赋值了
      localStorage.setItem('activeChild', JSON.stringify(activeInfo.children[0]));
      var content = localStorage.getItem('activeChild');
      if (content != '{}') {
        return;
      }
      if (id != 0 && data.count > 0) {
        // 1、先获取选中节点的下级数据
        this.thisLoading = true;
        newFindTreeData(
          {
            type: 1
          },
          {
            parentId: id
          }
        )
          .then(res => {
            // 获取对应节点数据，并将chuildren值转换成jason格式
            console.log('获取对应节点数据', res);
            this.selected = this.transFromArr(res.data);
            //   console.log('获取对应节点数据', this.selected)
            // 2、然后根据id递归到treeData指定节点数据
            this.parseJson(this.treeData, id);
            this.thisLoading = false;
          })
          .catch(() => {
            this.thisLoading = false;
          });
      }
    },
    // 转换字符串数组
    transFromArr(arr) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.children = JSON.parse(item.children);
      }
      return arr;
    },
    // 递归出数据指定节点
    parseJson(jsonObj, id) {
      // 循环所有键
      for (var v in jsonObj) {
        var element = jsonObj[v];
        // 1.判断是对象或者数组
        if (typeof element == 'object') {
          this.parseJson(element, id);
        } else {
          if (element == id) {
            if (jsonObj.id == id) {
              console.log('当前所点击节点', jsonObj);
              var info = JSON.parse(JSON.stringify(jsonObj));
              // 3、将获取到的下级数据赋值给在指定节点的children属性即可
              // 如果当前节点下已经有了数据，则不需要再赋值了
              localStorage.setItem('oneContent', JSON.stringify(info.children[0]));
              var content = localStorage.getItem('oneContent');
              if (content == '{}') {
                jsonObj.children = JSON.parse(JSON.stringify(this.selected));
              }
            }
          }
        }
      }
    },
    getCheckedId() {
      return this.radio;
    },
    // 返回目前被选中的节点所组成的数组
    getCheckedNodes() {
      return this.$refs.elTree.getCheckedNodes();
    },
    // 返回目前半选中的节点所组成的数组
    getHalfCheckedNodes() {
      return this.$refs.elTree.getHalfCheckedNodes();
    },
    // 返回目前被选中的节点父节点
    getNode(id) {
      return this.$refs.elTree.getNode(id);
    },
    setCheckedNodes(data) {
      this.$refs.elTree.setCheckedNodes(data);
    },
    setCheckedKeys(data, boolean) {
      this.$refs.elTree.setCheckedKeys(data, boolean);
    },
    /**
     * 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
     */
    getCheckedKeys() {
      return this.$refs.elTree.getCheckedKeys();
    },
    handleTreeHeight() {
      this.treeHeight = this.height - 5;
      if (this.$refs.header) {
        this.treeHeight -= this.$refs.header.clientHeight;
      }
      if (this.$refs.toolbar) {
        this.treeHeight -= this.$refs.toolbar.clientHeight;
      }
      if (this.$refs.searchForm) {
        this.treeHeight -= this.$refs.searchForm.clientHeight;
      }
    },
    handleActionEvent(action, position, data) {
      const command = action.key;
      if (command === 'expand') {
        this.expandCompressTree(true);
      } else if (command === 'compress') {
        this.expandCompressTree(false);
      }
      this.$emit('action-event', command, position, data);
    },
    expandCompressTree(expanded) {
      for (var i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded;
      }
    },
    handleCheck(data, state) {
      this.$emit('check', data, state);
    },
    handleNodeClick(data, node, tree) {
      if (data.id === 0 || data.id === '0') return;
      this.radio = data[this.pkKey];
      this.$emit('node-click', data);
    },
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') {
        this.radio = '';
        return;
      }
      this.$emit('selected', data);
    },
    handleExpandCollapse() {
      this.isExpand = !this.isExpand;
      this.$emit('expand-collapse', this.isExpand);
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header {
  background: #e7eaec;
  border-bottom: 1px solid #e5e6e7;
  font-weight: bold;
  text-align: center;
  padding: 4px;
  position: relative;
  overflow: hidden;
  .layout-header-title {
    float: left;
    font-size: 14px;
    margin: 5px;
    padding: 0;
  }
  .layout-header-tools {
    float: right;
    margin-top: 0;
    position: relative;
    padding: 0;
    .pinBtn {
      cursor: pointer;
      margin-left: 5px;
      color: #c4c4c4;
      font-size: 25px;
    }
  }
}

.ibps-tree-toolbar {
  background: #ffffff;
  border-top: 1px solid #e5e6e7;
  border-bottom: 1px solid #e5e6e7;
  height: 30px;
  padding: 5px;
}
.ibps-tree-search-form {
  background: #ffffff;
  padding-left: 5px;
  padding-right: 5px;
}

.ibps-tree-wrapper {
  background: #ffffff;
  border: 1px solid #ebeef5;
  .el-tree > .el-tree-node {
    display: inline-block;
  }
}
</style>

