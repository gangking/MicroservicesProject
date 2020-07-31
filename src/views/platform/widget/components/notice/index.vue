<template>
  <el-card>
    <div class="redblock"></div>
    <div class="redblock_title">
      <h3 id="noticetitle">通知公告</h3>
      <a href="#" @click="logvisible "><img class="bigger"  src="@/assets/images/desktop/amplification.png" /></a>
    </div>
    <div class="block">
      <el-carousel height="170px" :autoplay="false" class="noticebox" arrow="never">
        <el-carousel-item v-for="item in 3" :key="item">
          <h4 class="newstitle">三一集团</h4>
          <div class="newsdate">
            <img src="@/assets/images/desktop/notice/calendar.png" />
            <span>2019-06-08</span>
            <img src="@/assets/images/desktop/notice/time.png" />
            <span>09:22:01</span>
          </div>
            <div class="newsinfo">
              <p>
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
                三一集团主业是以“工程机械”为主体的装备制造业，主导产品为混凝土机械、筑路机械、挖掘机械、桩工机械、起重机械、港口机械、风电设备等全系列产品，其中混凝土机械、挖掘机械、桩工机械、履带起重机械、港口机械为中国第一品牌，混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一混凝土泵车全面取代进口，且连续多年产销量居全球第一。
              </p>
            </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <bigger
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      @handleClose="handleClose"
    ></bigger>
  </el-card>
</template>
<script>
import bigger from "./dialog.vue";
// import test from './test'

export default {
  data() {
    return {
      dialogTableVisible: false,
    }
  },
  methods: {
    logvisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
    }
  },
  components: {
    bigger,
    // test
  }
}
</script>
<style lang="scss" scoped>
.block /deep/ ul li {
  padding: 3px 0;
  width: 20px;
  button {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin: 0 auto;
    background-color: #d1d2d4;
    opacity: 1;
  }
}
.block /deep/ ul li.is-active button {
  background-color: #4ba5ff;
}
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #E61A23;
}
.redblock_title{
  position: relative;
  top: -4px;
  left: -20px;
  >a{
    position: absolute;
    top: 4px;
    right: -20px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.block {
  position: relative;
  top: -10px;
  height: 308px;
}
#noticetitle {
  width: 200px;
  height: 25px;
  margin-top: 2px !important;
  margin-left: 20px !important;
  font-size: 18px;
  font-family: PingFang SC;
  margin-bottom: 12px;
}
.noticebox {
  position: relative;
  .newstitle {
    position: absolute;
    margin: 10px 0 0 0;
    font-size: 14px;
    font-weight: 500;
  }
  .newsdate {
    position: absolute;
    margin: 40px 0 0 0;
    font-size: 12px;
    img {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      vertical-align: top;
    }
    span {
      margin-right: 5px;
      color: #A1A2A5;
    }
  }
  .newsinfo {
    overflow: hidden;
    position: absolute;
    width: 100%;
    margin: 50px 0 0 0;
    font-size: 12px;
    line-height: 21px;
    // text-indent: 27px;
    letter-spacing: 1px;
    p {
      font-size: 12px;
      color: #A1A2A5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* 可以显示的行数，超出部分用...表示*/
      -webkit-box-orient: vertical;
    }
  }

  .el-carousel__button {
    width: 5px !important;
    height: 5px !important;
    border-radius: 50%;
    background-color: #2793ff !important;
    margin-left: 3px;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #fff !important;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #fff !important;
}
.el-carousel__indicators {
  width: 50px;
}
</style>