<template>
  <div>
    <div v-if="toolbars"
         ref="toolbar"
         class="ibps-tree-toolbar">
      <ibps-toolbar :actions="toolbars"
                    type="icon"
                    @action-event="handleTreeAction" />
    </div>
    <div ref="searchForm"
         class="ibps-tree-search-form">
      <el-input v-model="filterText"
                placeholder="请输入组织名称"
                clearable />
    </div>
    <div :style="{ height:(tableHeight)+'px'}">
      <el-scrollbar style="height: 100%;"
                    wrap-class="ibps-tree-wrapper">
        <!-- 多选-->

        <el-tree v-if="multiple"
                 ref="elTree"
                 v-loading="loading"
                 :data="treeData"
                 :expand-on-click-node="false"
                 :props="{ children: 'children', label: 'name'}"
                 :show-checkbox="multiple"
                 :check-strictly="true"
                 :filter-node-method="filterNode"
                 node-key="id"
                 pid-key="parentId"
                 highlight-current
                 check-on-click-node
                 @check-change="handleCheckChange"
                  @node-expand="nodeOpen" />
        <!-- 单选-->
        <el-tree v-else
                 ref="elTree"
                 v-loading="loading"
                 :data="treeData"
                 :expand-on-click-node="false"
                 :props="{ children: 'children', label: 'name'}"
                 :filter-node-method="filterNode"
                 node-key="id"
                 pid-key="parentId"
                 default-expand-all
                 highlight-current
                 @node-click="onNodeClick">
          <span slot-scope="{ node, data }"
                class="custom-tree-node">
            <el-radio v-model="radio"
                      :label="data[pkKey]"
                      :disabled="data.disabled?data.disabled:data.id==='0'?true:null"
                      @change="changeRadio(data)">
              {{ node.label }}111
            </el-radio>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { findTreeData,newFindTreeData } from '@/api/platform/org/org'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'

export default {
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data () {
    return {
      radio: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      filterText: '',
      // 树配置
      treeData: [],
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }]

    }
  },
  computed: {
    tableHeight () {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    filterText (val) {
      this.$refs.elTree.filter(val)
    },
    multiple (val) {
      console.log('multiple值', val)
    }
  },
  created () {
    console.log('multiple初始值', this.multiple)
    this.loadTreeData()
  },
  methods: {
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
        this.loading = true;
        newFindTreeData({
          type: 1
        }, {
          parentId: id,
        }).then(res => {
          // 获取对应节点数据，并将chuildren值转换成jason格式
            console.log('获取对应节点数据', res)
          this.selected = this.transFromArr(res.data);
          //   console.log('获取对应节点数据', this.selected)
          // 2、然后根据id递归到treeData指定节点数据
          this.parseJson(this.treeData, id)
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      }
    },
    // 转换字符串数组
    transFromArr (arr) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.children = JSON.parse(item.children);
      }
      return arr;
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
    setChecked (data, selected) {
      if (data !== undefined) {
        this.$refs['elTree'].setChecked(data, selected)
      } else {
        this.radio = ''
      }
    },
    cleanData (multiple) {
      if (multiple) {
        this.$refs['elTree'].setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    // 加载组织树
    loadTreeData () {
      this.loading = true
      //   findTreeData({
      //     type: 1
      //   }).then(response => {
      //     const data = response.data
      //     this.treeData = TreeUtils.transformToArrayFormat(data)
      //     this.loading = false
      //   }).catch(() => {
      //     this.loading = false
      //   })

      newFindTreeData({
        type: 1
      }, {
        parentId: 0,
      }).then(response => {
        console.log('获取组织树新接口数据')
        console.log(response)
        const data = response.data
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          item.children = JSON.parse(item.children);
        }
        this.treeData = TreeUtils.transformToArrayFormat(data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })


    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * 查询
     */
    search () {
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset () {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理按钮事件
     */
    handleAction (command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadListData()
          break

        default:
          break
      }
    },
    handleTreeAction (action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.loadTreeData()
      }
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree (expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleCheckChange (data, checked) {
      if (data.id === 0 || data.id === '0') return
      let val = JSON.parse(JSON.stringify(this.value))
      if (checked) {
        const index = val.find((v) => {
          return v[this.pkKey] === data[this.pkKey]
        })
        if (!index) { val.push(data) }
      } else {
        val = val.filter((v) => {
          return v[this.pkKey] !== data[this.pkKey]
        })
      }
      this.$emit('selected', val)
    },
    changeRadio (data) {
      if (data.id === 0 || data.id === '0') return
      this.$emit('selected', data)
    },
    onNodeClick (data, node, obj) {
      if (data.id === 0 || data.id === '0') return
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-color: #e5e6e7;
.ibps-tree-toolbar {
  border: 1px solid $border-color;
  height: 30px;
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
</style>

