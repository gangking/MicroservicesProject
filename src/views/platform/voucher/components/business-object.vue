<template>
  <div class="objbox">
    <el-row v-loading="loading"
            element-loading-text="正在获取业务对象"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TreeUtils from '@/utils/tree'
import { buildTree } from "@/api/platform/form/formDef";
export default {
  name: 'business-object',
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      boTreeData: [],
      loading: false
    }
  },
  watch: {
    info (val) {
      // 获取到业务场景参数变化
      this.onload(val);
    }
  },
  methods: {
    onload (info) {
      this.loading = true;
      buildTree({
        boCode: info.bizKey,
        boDefId: info.boDefId,
        mode: 'bo'
      }).then(response => {
        this.loading = false;
        // console.log('获取业务场景对应的业务对象', response)
        this.boTreeData = TreeUtils.transformToArrayFormat(response.data, {
          idKey: 'id',
          pIdKey: 'parentId'
        })
      }).catch(e => {
        this.loading = false;
        this.$message.error('业务对象获取失败');
      });
    },
    handleNodeClick (data) {
      localStorage.setItem('codeEdit', 'variable')
      this.$emit('getObj', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.objbox {
  height: calc(100% - 41px);
  /deep/ .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      .grid-content {
        height: 100%;
        .content {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
}
</style>