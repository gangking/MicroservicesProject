<template>
  <div class="objbox">
    <slot name="title"></slot>
    <div class="content">
      <el-tree :data.sync="boTreeData"
               :props="{
                  children: 'children',
                  label: 'name'
               }"
               default-expand-all
               @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
import TreeUtils from '@/utils/tree'
import { buildTree } from "@/api/platform/form/formDef";
export default {
  name: 'business-object',
  props:{
    objTreeData:{
      type: Array,
      default:[]
    }
  },
  data () {
    return {
      boData: [],
      boTreeData: []
    }
  },
  watch: {
    objTreeData(val){
      this.boTreeData = TreeUtils.transformToArrayFormat(val, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    },
    boData (val) {
      this.boTreeData = TreeUtils.transformToArrayFormat(val, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    }
  },
  created () {
    // this.onload();
  },
  methods: {
    onload () {
      buildTree({
        boCode: 'BO_REASON_CODE',
        boDefId: '620944050194743296',
        mode: 'bo'
      }).then(response => {
        this.boData = response.data;
      }).catch(e => {
        //  loading.close()
      });
    },
    handleNodeClick (data) {
      console.log('业务对象',data)
      localStorage.setItem('codeEdit', 'variable')
      this.$emit('getObj', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.objbox {
  height: 100%;
  .content {
    height: calc(100% - 40px);
    overflow: auto;
    // background: red;
  }
}
</style>