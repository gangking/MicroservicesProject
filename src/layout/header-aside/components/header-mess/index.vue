<template>
  <div class="mainbox">
    <el-button
      slot="reference"
      class="ibps-ml-0 ibps-mr btn-text can-hover waves-effect icontop1"
      type="text"
      @click.native.stop="handClick"
    >
      <el-badge :max="99" :value="messageCount">
        <!-- <ibps-icon name="paper-plane-o" size="16" /> -->
        <!-- 更换图标 -->
        <i class="iconfont icon-message icontop"></i>
        <!-- 白色 -->
        <!-- <img src="@/assets/images/white_icon_top/message.png" class="imgtop"> -->
        <!-- 黑色 -->
        <!-- <img src="@/assets/images/icon_top/message.png" class="imgtop"> -->
      </el-badge>
    </el-button>

    <template>
      <transition name="bounceInDown">
        <el-card class="box-card" v-show="headerBtn.headerMess" @click.native.stop>
          <div slot="header" class="title">
            <span>消息列表</span>
            <el-tooltip class="item" effect="dark" content="全部已读" placement="right">
              <span class="clearAll" @click="chaclearInfo">
                <i class="iconfont icon-qingchu message-icon gray"></i>
              </span>
            </el-tooltip>

            <!-- <button  type="button"  v-waves.button>Vue-Waves</button> -->

            <!-- <button
              type="button"
              style="float: right; padding: 0.03rem 0"
              @click="btnClose"
              aria-label="Close"
              class="el-message-box__headerbtn"
            >
              <i class="el-message-box__close el-icon-close"></i>
            </button>-->
          </div>

          <header-message
            ref="headmess"
            :messinfo="messageList"
            :remList="remindList"
            :ageList="agencyList"
            :notList="noticeList"
            :othList="otherList"
            :close="btnClose"
            :infoid="infoids"
          ></header-message>
          <!-- <div v-for="o in 4" :key="o" class="text item">{{'消息内容 ' + o }}</div> -->
        </el-card>
      </transition>
    </template>
  </div>
</template>
    

<script>
import { getMsgList } from "@/api/platform/message/innerMessage";
import { mapState, mapMutations } from "vuex";
import headerMessage from "./components";
import {
  queryReceivePageList,
  markRead
} from "@/api/platform/message/innerMessage";
export default {
  data() {
    return {
      messageList: [],
      remindList: [],
      agencyList: [],
      noticeList: [],
      otherList: [],
      messageCount: 0,
      clearInfo: true,
      infoids: [],
      ids: ""
    };
  },
  components: {
    headerMessage
  },
  created() {
    this.loadData();
    this.winHandel();
  },
  computed: {
    ...mapState("ibps/menu", ["headerBtn"])
  },
  methods: {
    // 加载数据
    // 10.7注释
    loadData() {
      getMsgList().then(response => {
        const data = response.data;
        this.messageList = data.dataResult;
        // this.messageCount = data.pageResult ? data.pageResult.totalCount : 0;
        this.messageCount = data.dataResult.length;
        console.log("messageList:", this.messageList);

        data.dataResult.forEach(item => {
          this.infoids.push(item.id);
          if (item.messageType == "backlog") {
            // 代办
            this.remindList.push(item);
          } else if (item.messageType == "remind") {
            // 提醒
            this.agencyList.push(item);
          } else if (item.messageType == "notice") {
            // 通知
            this.noticeList.push(item);
          } else if (item.messageType == "other") {
            // 其他
            this.otherList.push(item);
          }
        });
        this.ids = this.infoids.toString();
      });
    },
    handClick() {
      this.headerBtn.headerMess = !this.headerBtn.headerMess;
      let activeMess = ["headerMess", this.headerBtn.headerMess];

      this.activeTop(activeMess);
    },
    btnClose() {
      this.headerBtn.headerMess = false;
    },
    winHandel() {
      document.addEventListener("click", e => {
        this.headerBtn.headerMess = false;
      });
    },
    ...mapMutations("ibps/menu", ["activeTop"]),
    // 全部已读
    chaclearInfo() {
      this.$refs.headmess.changeclearInfo();
      if (this.messageList == 0) {
        this.$message({
          message: "已经全部清空了!",
          type: "warning"
        });
        return false;
      }
      markRead({ innerMessageIds: this.ids })
        .then(response => {
          this.$message.closeAll();
          this.$message({
            message: "标记已读成功",
            type: "success"
          });
          // this.search();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.gray {
  color: #4e5367;
}
.header-message-popper {
  padding: 0 !important;
  .message-more {
    padding: 0.15rem 0;
    text-align: center;
    border-top: 1px solid #ebeef5;
  }
}
.mainbox {
  position: relative;
  width: 42px !important;
  height: 42px !important;
  // margin-right: 0.15rem;
  .box-card {
    position: absolute;
    top: 55px;
    width: 3rem;
    height: 4.5rem;
    font-size: 0.22rem;
    right: 0;
    z-index: 99999;
  }
}
.header-message {
  position: relative;
}
.text {
  font-size: 0.14rem;
}
.item {
  margin-bottom: 0.18rem;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 3rem;
  height: 4.5rem;
  
  .title {
    position: relative;
    height: 0.25rem;
    .clearAll {
      height: 0.25rem !important;
      width: 0.25rem !important;
      float: right;
    }
    .item {
      cursor: pointer;
    }
  }
}
.box-card /deep/ .el-card__header {
  height: 0.6rem;
  width: 3rem;
  padding: 0.18rem 0.2rem;
  // span {
  //   display: block;
  //   height: 1rem;
  //   width: 3rem;
  // }
}
.box-card /deep/ .el-card__body {
  padding: 0px;
  height: 3.4rem;
}
.imgtop {
  margin-top: 2px;
  width: 28px;
  height: 28px;
}
.icontop {
  display: inline-block;
  // height: 0.27rem;
  // width: 0.27rem;
  font-size: 17px;
  margin-top: 2px;
}
.icontop1 {
  position: absolute;
  top: -3px;
  overflow: hidden;
  width: 46px;
  height: 46px;
  margin: 0 5px !important;
}
</style>

