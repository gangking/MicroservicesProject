<template>
  <div class="objbox">
    <el-row v-loading="loading" element-loading-text="正在获取集成接口明细字段" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="title">
            接口名称：{{interfaceInfo.desc}}
          </div>
          <div class="content">
            <el-tree :data.sync="boTreeData" :props="{
                  children: 'children',
                  label: 'name'
               }" default-expand-all @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TreeUtils from '@/utils/tree';
import { buildTree } from '@/api/platform/form/formDef';
import indexApi from '@/api/platform/voucher/index.js';
// import { showLoading, hideLoading } from '@/utils/loading';
export default {
  name: 'business-object',
  props: {
    interfaceInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      boTreeData: [],
      loading: false
    };
  },
  watch: {
    interfaceInfo(val) {
      // 获取到业务场景参数变化
      this.onload(val);
    }
  },
  methods: {
    onload(info) {
      this.loading = true;
      indexApi
        .leftRightFontServer({
          boCode: info.boCode,
          mode: 'bo'
        })
        .then(res => {
          this.loading = false;
          console.log('获取业务场景对应的集成接口明细字段', res);
          this.boTreeData = TreeUtils.transformToArrayFormat(res.data, {
            idKey: 'id',
            pIdKey: 'parentId'
          });
        })
        .catch(req => {
          this.loading = false;
          this.$message.error('集成接口明细字段获取失败');
        });
      // buildTree({
      //   boCode: info.bizKey,
      //   boDefId: info.boDefId,
      //   mode: 'bo'
      // })
      //   .then(response => {
      //     this.loading = false;
      //     // console.log('获取业务场景对应的集成接口明细字段', response)
      //     this.boTreeData = TreeUtils.transformToArrayFormat(response.data, {
      //       idKey: 'id',
      //       pIdKey: 'parentId'
      //     });
      //   })
      //   .catch(e => {
      //     this.loading = false;
      //     this.$message.error('集成接口明细字段获取失败');
      //   });
    },
    handleNodeClick(data) {
      localStorage.setItem('codeEdit', 'variable');
      this.$emit('getObj', data);
    }
  }
};
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
        .title {
          font-size: 13px;
          height: 30px;
          line-height: 30px;
          font-weight: bold;
          padding: 0 10px;
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
        }
        .content {
          height: calc(100% - 30px);
          overflow: auto;
        }
      }
    }
  }
}
</style>