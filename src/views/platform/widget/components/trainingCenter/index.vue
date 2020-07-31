<template>
  <el-card>
    <div class="redblock"></div>
    <div class="redblock_title">
      <h3 id="noticetitle">培训中心</h3>
      <a href="#"  @click="logvisible ">
        <img class="bigger" src="@/assets/images/desktop/amplification.png" />
      </a>
    </div>

    <div class="block">
      <el-carousel height="170px" :autoplay="false" class="noticebox" arrow="never">
        <el-carousel-item v-for="item in 3" :key="item">
          <ul class="newslist">
            <li class="newsinfo">
              <div class="redball"></div>
              <div class="newsdetailbox">
                <span class="newsdetail">2号车间XXX用品单据</span>
                <span class="newsdetail">未开始</span>
                <span class="newsdetail">2019-07-31</span>
              </div>
            </li>
            <li class="newsinfo">
              <div class="newsdetailbox">
                <span class="newsdetail">3号车间XXX用品单据</span>
                <span class="newsdetail now">进行中</span>
                <span class="newsdetail">2019-07-30</span>
              </div>
            </li>
            <li class="newsinfo">
              <div class="newsdetailbox">
                <span class="newsdetail">4号车间XXX用品单据</span>
                <span class="newsdetail finished">已完成</span>
                <span class="newsdetail">2019-07-29</span>
              </div>
            </li>
            <li class="newsinfo">
              <div class="newsdetailbox">
                <span class="newsdetail">1号车间XXX用品单据</span>
                <span class="newsdetail finished">已完成</span>
                <span class="newsdetail">2019-07-28</span>
              </div>
            </li>
          </ul>
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
import { rem } from "@/assets/js/rem.js";
import bigger from "./dialog.vue";
export default {
  methods: {
    remmeth() {
      rem();
    },
    logvisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
    }
  },
  data() {
    return {
      dialogTableVisible: false,
    }
  },
  components: {
    bigger
  }
};
</script>

<style lang="scss" scoped>
.finished {
  color: #2db85d;
}
.now {
  color: #f89c4f;
}
.block /deep/ ul li {
  padding: 10px 0;
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
  background-color: #e61a23;
}
.redblock_title {
  position: relative;
  top: -2px;
  left: -20px;
  > a {
    position: absolute;
    top: 4px;
    right: -18px;
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
  top: -18px;
}
#noticetitle {
  width: 200px;
  height: 35px;
  font-size: 18px;
  font-family: PingFang SC;
  margin-top: 0px !important;
  margin-left: 20px !important;
  // margin-bottom: 15px !important;
}
.noticebox {
  position: relative;
  .newslist {
    height: 100%;
    font-size: 16px;
    margin: 0;
    padding: 0;
    padding-left: 20px;
    .newsinfo {
      width: 90%;
      font-size: 16px;
      margin: 0;
      position: relative;
      .redball {
        position: absolute;
        width: 8px;
        height: 8px;
        left: -20px;
        top: 77%;
        margin-top: -13px;
        border-radius: 100%;
        background: #e61a23;
      }
      .newsdetailbox {
        width: 100%;
        display: flex;
      }

      .newsdetail {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
      }
      .newsdetail:nth-child(2) {
        text-align: center;
      }
      .newsdetail:nth-child(3) {
        text-align: right;
      }
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
</style>