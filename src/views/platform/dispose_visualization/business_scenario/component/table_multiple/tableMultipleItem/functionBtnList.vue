<template>
  <div class="tablelist">
    <div class="list2">
      <el-table highlight-current-row @current-change="handleCurrentChange" :data="btnTabel" border style="width: 140%" height="140%">
        <el-table-column prop="buttonName" label="按钮名称" width="140">
        </el-table-column>
        <el-table-column prop="buttonPosition" label="按钮位置" width="120">
          <template slot-scope="scope">
                <span v-if="scope.row.buttonPosition=='1'">分页区</span>
                <span v-else-if="scope.row.buttonPosition=='2'">页签</span>
                <span v-else-if="scope.row.buttonPosition=='3'">业务类型</span>
                <span v-else-if="scope.row.buttonPosition=='4'">左边栏</span>
                <span v-else-if="scope.row.buttonPosition=='5'">处理意见</span>
                <span v-else-if="scope.row.buttonPosition=='6'">集中处理</span>
              </template>
        </el-table-column>
        <el-table-column prop="buttonIcon" label="按钮图标" width="120">
          <template slot-scope="scope">
            <i :class="'icon-'+scope.row.buttonIcon" style="color:#409EFF;"></i>
          </template>
        </el-table-column>
        <el-table-column prop="subtab" label="静态页签" width="120">
        </el-table-column>
        <el-table-column prop="buttonType" label="按钮类型" width="120">
        </el-table-column>
        <el-table-column prop="buttonPlain" label="是否朴素按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonPlain" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonRound" label="是否圆角按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonRound" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonCircle" label="是否圆形按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonCircle" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonCode" label="按钮编码" width="120">
        </el-table-column>
        <el-table-column prop="sn" label="排序" width="120">
        </el-table-column>
        <!-- <el-table-column prop="dataStatus" label="状态" width="120">
        </el-table-column> -->
      </el-table>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnTabel: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods:{
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange',val)
    }
  }
};
</script>

<style lang="scss" scoped>
.tablelist {
  width: 140%;
  height: calc(140% - 45px);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  // overflow: auto;
  // background: yellow;
  // .list1 {
  //   width: 30%;
  // }
  .list2 {
    // width: 65%;
    flex: 1;
  }
}
</style>