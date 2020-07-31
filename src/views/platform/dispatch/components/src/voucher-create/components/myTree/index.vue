<template>
  <div class="treeBBox">
    <div class="topbtn">
      <el-button class="btnPzmode" type="primary" size="mini" plain :disabled="isDisable" @click="voucherModel"><i class="iconfont icon-uniE0411"></i>凭证模拟</el-button>
      <el-button type="danger" size="mini" plain :disabled="isDisable" @click="generVoucher"><i class="iconfont icon-uniE1BB"></i>生成凭证</el-button>
    </div>
    <p class="treeTitle">会计凭证</p>
    <div class="treeList">
      <ul class="treeMenu">
        <my-tree v-for="(item,index) in list" :key="index" :nodes="item" @getclickchildren="clickchildren">
        </my-tree>
      </ul>
    </div>

  </div>
</template>

<script>
import myTree from './my-tree';
import previewApi from '@/api/platform/voucher/preview.js';
export default {
  name: 'treeMenu',
  components: {
    myTree
  },
  props: {
    treeList: {
      type: Array,
      default: []
    },
    instId: String
  },
  data: () => {
    return {
      isDisable: false
    };
  },
  computed: {
    list() {
      var arr = this.treeList;
      return arr;
    }
  },
  methods: {
    clickchildren(info) {
      console.log('获取树形点击节点值2', info);
      this.$emit('clickchildren', info);
    },
    /**
     * 凭证预览
     */
    voucherModel() {
      this.isDisable = true;
      previewApi
        .voucherSim({
          instId: this.instId
        })
        .then(res => {
          console.log('凭证模拟', res);
          this.$emit('refreshTree');
          if (res.state === 200) {
            this.isDisable = false;
            this.$message({
              message: '操作成功！',
              type: 'success'
            });
          } else {
            this.isDisable = false;
            //  this.$message({
            //     message: res.message,
            //     type:'warning'
            //   });
          }
        })
        .catch(req => {
          this.isDisable = false;
        });
    },
    /**
     * 生成凭证
     */
    generVoucher() {
      this.isDisable = true;
      previewApi
        .voucherGenerNew({
          instIds: [this.instId]
        })
        .then(res => {
          // console.log('生成凭证===========', res);
          this.$emit('refreshTree');
          if (res.state === 200) {
            this.isDisable = false;
            this.$message({
              message: '操作成功！',
              type: 'success'
            });
          } else {
            this.isDisable = false;
          }
        })
        .catch(req => {
          this.isDisable = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.treeBBox {
  height: 100%;
  .topbtn {
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    /deep/ .el-button--mini {
      padding: 7px 7px;
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .treeTitle {
    display: block;
    margin: 0;
    padding: 0px 10px;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .treeList {
    padding: 0px 10px;
    height: calc(100% - 36px - 30px);
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    .treeMenu {
      list-style: none;
      padding: 0;
      margin: 0;
      // position: relative;
      // left: 25px;
      // top: 10px;
      > li {
        margin: 10px 0;
        min-width: 80px;
        &:first-child {
          /deep/ .line2 {
            display: block;
            top: -12px;
            height: calc(100% + 24px);
          }
        }
        &:last-child {
          /deep/ .line {
            display: none;
          }
          /deep/ .line2one {
            display: none;
          }
        }
      }
    }
  }
}
</style>
