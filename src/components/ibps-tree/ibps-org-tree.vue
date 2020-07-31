<template>
  <div ref="ibpsTree"
       :style="{width:width+'px'}"
       class="ibps-tree">
    <div v-if="title"
         ref="header"
         :class="['layout-header--' +$ELEMENT.size]"
         class="layout-header">
      <div v-show="isExpand"
           :style="{width:width-55+'px'}"
           class="layout-header-title ibps-ellipsis">{{ title }}</div>
      <div v-if="angleDouble"
           class="layout-header-tools">
        <el-tooltip :content="isExpand?'收缩':'展开'"
                    placement="bottom-start">
          <a herf="javascript:void(0);"
             class="pinBtn"
             @click="handleExpandCollapse">
            <ibps-icon :name="expandCollapseIcon" />
          </a>
        </el-tooltip>
      </div>
    </div>
    <div v-if="toolbars"
         class="ibps-show">
      <div v-if="toolbars"
           v-show="isExpand"
           ref="toolbar"
           class="ibps-tree-toolbar">
        <ibps-toolbar :actions="toolbars"
                      type="icon"
                      @action-event="handleActionEvent" />
      </div>
    </div>
    <div v-if="$slots.searchForm "
         v-show="isExpand"
         ref="searchForm"
         class="ibps-tree-search-form">
      <slot name="searchForm" />
    </div>
    <div :style="{ height:treeHeight+'px'}"
         class="ibps-show">
      <div v-show="isExpand"
           :style="{ height:treeHeight+'px'}"
           class="ibps-tree-main">
        <el-scrollbar style="height: 100%;width:100%;"
                      wrap-class="ibps-tree-wrapper">
          <el-tree ref="elTree"
                   v-loading="thisLoading"
                   :data="treeData"
                   v-bind="treeOptions"
                   @node-click="handleNodeClick"
                   @node-contextmenu="handleNodeContextmenu"
                   @node-expand="nodeOpen">
            <span slot-scope="scope"
                  class="ibps-custom-tree-node">
              <ibps-icon v-if="showIcon"
                         :name="getIcon(scope.data)" />
              <span>{{ scope.node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <!--右键菜单-->
    <ibps-contextmenu v-if="contextmenus"
                      ref="contextmenu"
                      :visible.sync="contextmenuFlag"
                      :menulist="contextmenuList"
                      :x="contentmenuX"
                      :y="contentmenuY"
                      :z-index="zIndex">
      <ibps-contextmenu-list :menulist="contextmenuList"
                             @row-click="handleContextmenuClick" />
    </ibps-contextmenu>
  </div>
</template>
<script>
import { newFindTreeData } from '@/api/platform/org/org'
import TreeUtils from '@/utils/tree'
import IbpsContextmenu from '@/components/ibps-contextmenu'
import IbpsContextmenuList from '@/components/ibps-contextmenu/components/contentmenu-list'

export default {
  components: {
    IbpsContextmenu,
    IbpsContextmenuList
  },
  props: {
    title: String,
    angleDouble: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 400
    },
    position: {
      type: String,
      default: 'west'
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true
    },
    dataType: {// 数据类型，tree：树形，list:列表
      type: String,
      default: 'list'
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    toolbars: {
      type: [Array, Boolean],
      default: () => {
        return [{
          key: 'refresh'
        }, {
          key: 'expand'
        }, {
          key: 'compress'
        }]
      }
    },
    contextmenus: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      treeHeight: this.height,
      isExpand: true,
      autoPlacement: true,
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuData: {},
      contextmenuList: [],
      zIndex: 2003,
      treeDataList: [],
      selected: [],
      thisLoading: this.loading
    }
  },
  computed: {
    treeData () {
      if (!this.data || this.data.length === 0) return []
      for (var i = 0; i < this.data.length; i++) {
        var item = this.data[i];
        item.children = JSON.parse(item.children);
      }
      if (this.dataType === 'list') {
        var data = TreeUtils.transformToArrayFormat(JSON.parse(JSON.stringify(this.data)), {
          idKey: this.treeOptions['node-key'],
          pIdKey: this.pidKey,
          childrenKey: this.treeOptions['props']['children']
        })
        return data
      } else {
        return JSON.parse(JSON.stringify(this.data))
      }
    },
    treeOptions () {
      const defaultOptions = {
        'rootPId': null,
        'node-key': 'id',
        'pid-key': 'parentId',
        'default-expand-all': false,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name'
        }
      }
      return Object.assign(defaultOptions, this.options)
    },
    pidKey () {
      return this.treeOptions['pid-key']
    },
    rootPId () {
      return this.treeOptions['rootPId'] || null
    },
    showIcon () {
      return this.treeOptions['showIcon'] || false
    },
    expandCollapseIcon () {
      if (this.position === 'west') {
        return this.isExpand ? 'angle-double-left' : 'angle-double-right'
      } else {
        return this.isExpand ? 'angle-double-right' : 'angle-double-left'
      }
    }
  },
  watch: {
    height () {
      this.handleTreeHeight()
    },
    loading (val) {
      this.thisLoading = val;
    }
  },
  mounted () {
    this.handleTreeHeight()
    if (this.contextmenus && this.contextmenus.length > 0) {
      this.fixZIndex()
    }
  },
  methods: {
    getNewTreeDataList () {
      this.treeDataList = TreeUtils.transformToArrayFormat(JSON.parse(JSON.stringify(this.treeDataList
      )), {
        idKey: this.treeOptions['node-key'],
        pIdKey: this.pidKey,
        childrenKey: this.treeOptions['props']['children']
      })
      this.transFromArr(this.treeDataList[0].children);
      this.treeData = this.treeDataList;
    },
    // 转换字符串数组
    transFromArr (arr) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.children = JSON.parse(item.children);
      }
      return arr;
    },
    nodeOpen (data) {
      var id = data.id;
      var activeInfo = JSON.parse(JSON.stringify(data));
      // 如果当前节点下已经有了数据，则不需要再请求数据赋值了
      localStorage.setItem('activeChild', JSON.stringify(activeInfo.children[0]))
      var content = localStorage.getItem('activeChild')
      if (content != '{}') {
          return
      }
      if (id != 0 && data.count > 0) {
        // 1、先获取选中节点的下级数据
        this.thisLoading = true;
        newFindTreeData({
          type: 1
        }, {
          parentId: id,
        }).then(res => {
          // 获取对应节点数据，并将chuildren值转换成jason格式
        //   console.log('获取对应节点数据', res)
          this.selected = this.transFromArr(res.data);
        //   console.log('获取对应节点数据', this.selected)
          // 2、然后根据id递归到treeData指定节点数据
          this.parseJson(this.treeData, id)
          this.thisLoading = false;
        }).catch(() => {
          this.thisLoading = false;
        })
      }
    },
    // 递归出数据指定节点
    parseJson (jsonObj, id) {
      // 循环所有键 
      for (var v in jsonObj) {
        var element = jsonObj[v]
        // 1.判断是对象或者数组 
        if (typeof (element) == 'object') {
          this.parseJson(element, id)
        } else {
          if (element == id) {
            if (jsonObj.id == id) {
              console.log('当前所点击节点', jsonObj)
              var info = JSON.parse(JSON.stringify(jsonObj));
              // 3、将获取到的下级数据赋值给在指定节点的children属性即可
              // 如果当前节点下已经有了数据，则不需要再赋值了
              localStorage.setItem('oneContent', JSON.stringify(info.children[0]))
              var content = localStorage.getItem('oneContent')
              if (content == '{}') {
                jsonObj.children = JSON.parse(JSON.stringify(this.selected));
              }
            }
          }
        }
      }
    },
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex () {
      const allEl = [...document.all]
      let zIndex = 0
      allEl.forEach((el) => {
        const z = Number(window.getComputedStyle(el).zIndex) || 0
        if (z > zIndex) { zIndex = z }
      })

      this.zIndex = zIndex++
    },
    getIcon (data) {
      let icon = data ? data[this.treeOptions['iconKey'] || 'icon'] : 'list-alt'
      if (icon) { return icon }
      if (data[this.pidKey] === this.rootPId) {
        icon = this.treeOptions['rootIcon'] || 'home'
      } else {
        icon = this.treeOptions['nodeIcon'] || 'list-alt'
      }
    },
    handleTreeHeight () {
      this.treeHeight = this.height - 5
      if (this.$refs.header) {
        this.treeHeight -= this.$refs.header.clientHeight
      }
      if (this.$refs.toolbar) {
        this.treeHeight -= this.$refs.toolbar.clientHeight
      }
      if (this.$refs.searchForm) {
        this.treeHeight -= this.$refs.searchForm.clientHeight
      }
    },
    handleActionEvent (action, position, data) {
      const command = action.key
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
      this.$emit('action-event', command, position, data)
    },
    expandCompressTree (expanded) {
      for (var i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleNodeClick (data) {
      this.$emit('node-click', data)
    },
    /**
     * 处理节点右键菜单
     */
    handleNodeContextmenu (event, data) {
      if (!this.contextmenus || this.contextmenus.length === 0) return
      let target = event.target
      let flag = false
      if (target && target.className.indexOf('el-tree-node__content') > -1) {
        flag = true
      } else if (target && target.parentNode.className.indexOf('el-tree-node__content') > -1) {
        target = target.parentNode
        flag = true
      } else if (target && target.className.indexOf('ibps-custom-tree-node') > -1) {
        flag = true
      } else if (target && target.parentNode.className.indexOf('ibps-custom-tree-node') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.handleContextmenuList(data)
        this.contextmenuData = data
        this.contextmenuFlag = true
        this.handleReferenceContextmenu(event)
      }
    },
    handleContextmenuList (data) {
      this.contextmenuList = []
      const isRoot = data[this.pidKey] === this.rootPId
      this.contextmenus.forEach((menu) => {
        if (!menu.rights) {
          this.contextmenuList.push(menu)
        } else {
          if (Array.isArray(menu.rights)) {
            if (menu.rights.indexOf('node') > -1 && !isRoot) {
              this.contextmenuList.push(menu)
            }
          } else if (typeof menu.rights === 'function') {
            if (menu.rights.call(this, menu, data, isRoot)) {
              this.contextmenuList.push(menu)
            }
          }
        }
      })
      console.log(this.contextmenuList)
    },
    // 处理菜单位置
    handleReferenceContextmenu (event) {
      const eventX = event.pageX
      const eventY = event.pageY
      this.$nextTick(() => {
        const contextmenuPosition = {
          top: eventY,
          left: eventX
        }
        if (this.autoPlacement) {
          const el = this.$refs.contextmenu.$el
          const contextmenuWidth = el.clientWidth
          const contextmenuHeight = el.clientHeight
          if (contextmenuHeight + eventY >= window.innerHeight) {
            contextmenuPosition.top -= contextmenuHeight
          }
          if (contextmenuWidth + eventX >= window.innerWidth) {
            contextmenuPosition.left -= contextmenuWidth
          }
        }

        this.contentmenuX = contextmenuPosition.left
        this.contentmenuY = contextmenuPosition.top
      })
    },
    handleContextmenuClick (command) {
      this.contextmenuFlag = false
      this.$emit('action-event', command, 'contextmenu', this.contextmenuData[this.pkKey], this.contextmenuData)
    },
    handleExpandCollapse () {
      this.isExpand = !this.isExpand
      this.$emit('expand-collapse', this.isExpand)
    },
    remove (data) {
      this.$refs.elTree.remove(data)
    },
    getCurrentKey () {
      return this.$refs.elTree.getCurrentKey()
    }
  }
}
</script>

<style lang="scss" >
$border-color: #e5e6e7;
.ibps-tree {
  .layout-header {
    background: white;
    height: 35px;
    border-bottom: 1px solid $border-color;
    font-weight: bold;
    text-align: center;
    padding: 5px;
    position: relative;
    overflow: hidden;
    &--medium {
      height: 40px;
    }
    &--small {
      height: 35px;
    }
    &--mini {
      height: 30px;
    }
    .layout-header-title {
      float: left;
      text-align: left;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-tools {
      float: right;
      margin-top: 5px;
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
  .ibps-show {
    height: 42px;
    background: white;
    position: relative;
    right: 1px;
  }
  .ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 35px;
    padding: 5px;
  }

  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
  .ibps-custom-tree-node {
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>

