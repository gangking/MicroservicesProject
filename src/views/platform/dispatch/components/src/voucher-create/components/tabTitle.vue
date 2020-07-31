<template>
  <!-- <div class="box">
  <p>
    <label>公司代码:</label>
    <span>{{listData.bukrs}}</span>
    <label>|&nbsp;利润中心:</label>
    <span>{{listData.prctr}}</span>
  </p>
  <p>
    <label>AP会计凭证号:</label>
    <span>{{listData.postNumber}}</span>
    <label>|&nbsp;过帐日期:</label>
    <span>{{this.timestampToTime(listData.budat)}}</span>
  </p>
</div> -->
  <el-form :inline="true" :model="listData" class="tabTitleFrom">
    <el-row>
      <div style="display:inline-block">
        <span class="txtspan">公司代码:</span>
        <span class="txtspan">{{listData.bukrs}}</span>
      </div>
      <div style="display:inline-block">
        <span class="txtspan">|&nbsp;利润中心:</span>
        <span class="txtspan">{{listData.prctr}}</span>
      </div>
    </el-row>
    <el-row class="row-bot">
      <div style="display:inline-block">
        <span class="txtspan">会计凭证号:</span>
        <span class="txtspan">{{listData.postNumber}}</span>
      </div>
      <div style="display:inline-block">
        <span class="txtspan">|&nbsp;过帐日期:</span>
        <span class="txtspan">{{this.timestampToTime(listData.budat)}}</span>
      </div>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'tab-title',
  props: {
    titleCon: {
      type: Object,
      default: function() {
        return {};
      }
    },
    contentab: {
      type: Object,
      default: {}
    }
  },
  //  computed:{
  //   listData(){
  //     return this.titleCon.dataResult[0]
  //   }
  // },
  data() {
    return {
      listData: {}
    };
  },
  watch: {
    titleCon(val) {
      console.log(`val=====ttt4====`, val);
      this.listData = val.dataResult[0];
    },
    contentab(val) {
      this.listData = val;
    }
  },

  methods: {
    // 时间戳转化
    timestampToTime(timestamp) {
      if (!timestamp) {
        return;
      }
      var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '/';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes();
      return Y + M + D;
    }
  }
};
</script>

<style lang="scss" scoped>
.tabTitleFrom {
  el-row div {
    display: inline;
  }
  padding: 3px;
  margin-left: 4px;
  // color: rgb(255, 255, 255);

  .row-bot {
    margin-top: 5px;
  }
  .txtspan {
    color: black !important;
    font-size: 12px;
    // font-family: 黑体;
    font-weight: 700;
  }
}
</style>