<template>
  <div class="message-wrap">
    <!-- 顶栏消息弹框 -->
    <div>
      <el-collapse-transition>
        <div v-show="clearInfo">
          <!-- 代办 -->
          <div class="message" @click="goMess" v-show="this.rem.length>0?true:false">
            <div class="message-flex">
              <div class="message-left">
                <span class="message-left-border" style="background-color: rgb(51, 145, 229);">
                  <i class="iconfont icon-daibanrenwu- message-icon red"></i>
                </span>
              </div>
              <div class="message-right">
                <div class="message-right-item-title">
                  <h4>
                    您有
                    <span class="blue">{{this.rem.length}}</span> 个代办事项需要处理
                  </h4>
                </div>
                <div class="message-right-item-time">
                  <div class="content">{{this.rem[0]?this.rem[0].content:""}}</div>
                  <span class="messname">{{this.rem[0] ?this.rem[0].ownerName:""}}</span>
                  <span class="message-time">{{this.rem[0]?this.rem[0].durationTime:""}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 提醒 -->
          <div class="message" @click="goMess" v-show="this.age.length>0?true:false">
            <div class="message-flex">
              <div class="message-left">
                <span class="message-left-border" style="background-color: rgb(51, 145, 229);">
                  <i class="iconfont icon-tixing message-icon yellow"></i>
                </span>
              </div>
              <div class="message-right">
                <div class="message-right-item-title">
                  <h4>
                    您有
                    <span class="blue">{{this.age.length}}</span> 个提醒事项需要处理
                  </h4>
                </div>
                <div class="message-right-item-time">
                  <div class="content">{{this.age[0]?this.age[0].content:""}}</div>
                  <span class="messname">{{this.age[0] ?this.age[0].ownerName:""}}</span>
                  <span class="message-time">{{this.age[0]?this.age[0].durationTime:""}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 通知 -->
          <div class="message" @click="goMess" v-show="this.not.length>0?true:false">
            <div class="message-flex">
              <div class="message-left">
                <span class="message-left-border" style="background-color: rgb(51, 145, 229);">
                  <i class="iconfont icon-tongzhi message-icon blue"></i>
                </span>
              </div>
              <div class="message-right">
                <div class="message-right-item-title">
                  <h4>
                    您有
                    <span class="blue">{{this.not.length}}</span> 个通知事项需要处理
                  </h4>
                </div>
                <div class="message-right-item-time">
                  <div class="content">{{this.not[0]?this.not[0].content:""}}</div>
                  <span class="messname">{{this.not[0] ?this.not[0].ownerName:""}}</span>
                  <span class="message-time">{{this.not[0]?this.not[0].durationTime:""}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他 -->
          <div class="message" @click="goMess" v-show="this.oth.length>0?true:false">
            <div class="message-flex">
              <div class="message-left">
                <span class="message-left-border" style="background-color: rgb(51, 145, 229);">
                  <i class="iconfont icon-qita message-icon green"></i>
                </span>
              </div>
              <div class="message-right">
                <div class="message-right-item-title">
                  <h4>
                    您有
                    <span class="blue">{{this.oth.length}}</span> 个其他事项需要处理
                  </h4>
                </div>
                <div class="message-right-item-time">
                  <div class="content">{{this.oth[0]?this.oth[0].content:""}}</div>
                  <span class="messname">{{this.oth[0] ?this.oth[0].ownerName:""}}</span>
                  <span class="message-time">{{this.oth[0]?this.oth[0].durationTime:""}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <div class="checkAll" @click="goMess">查看全部通知</div>

    <transition name="el-zoom-in-bottom">
      <div class="nomess" v-show="this.messinfo.length>0?false:true">
        <img src="@/assets/images/desktop/nomessage.png" alt />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "header-mess",
  props: {
    messinfo: Array,
    remList: Array,
    ageList: Array,
    notList: Array,
    othList: Array,
    close: Function,
    cleInfo: Boolean,
    infoid: Array
  },
  data() {
    return {
      mes: this.messinfo,
      rem: this.remList,
      age: this.ageList,
      not: this.notList,
      oth: this.othList,
      clearInfo: true,
      // nomessage: false,
      ids: this.infoid
    };
  },
  mounted() {
    // console.log('ids',this.ids);
  },
  watch: {
    // rem(newInfo, oldInfo) {
    //   if (newInfo>0) {
    //     this.rem = newInfo;
    //   }
    // },
    // immediate:true
  },
  methods: {
    goMess() {
      let path = this.$route.path;
      if (path != "/xxzx/receiveMessage") {
        this.$router.push({
          path: "/xxzx/receiveMessage"
        });
      }
      this.close();
    },
    changeclearInfo() {
      this.clearInfo = false;
      setTimeout(() => {
        this.nomessage = true;
      }, 100);
    }
  }
};
</script>

<style scoped lang="scss">
.message-wrap {
  position: absolute;
  left: 0;
  top: 0.55rem;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  height: 4rem;
  // margin-top: 0.25rem;
  .checkAll {
    position: absolute;
    bottom: 0.05rem;
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    font-size: 0.14rem;
    color: #108de9;
    cursor: pointer;
    border-top: 1px solid #e8eaec;
  }
  .nomess {
    position: absolute;
    top: 1rem;
    left: 0.5rem;
  }
}
.message {
  padding: 0.12rem 0.24rem;
  border-bottom: 0.01rem solid #e8eaec;
  width: 2.5rem;
  height: 0.61rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  text-align: left;
  &:hover {
    background-color: #f0faff;
  }
  .message-flex {
    display: flex;
    width: 2.5rem;
    height: 0.55rem;
    align-items: center;
    .message-left {
      flex: 0 1 0.4rem;
      margin-top: -0.13rem;
      .message-left-border {
        background-color: #fff !important;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.35rem;
        height: 0.35rem;
        margin-top: 0.25rem;
        border-radius: 50%;
        .message-icon {
          font-size: 0.3rem !important;
          margin-left: -0.02rem;
        }
        .red {
          color: #d81e06;
        }
        .yellow {
          color: #f4ea2a;
        }
        .blue {
          color: #0061b2;
        }
        .green {
          color: #4a9d5e;
        }
      }
    }
    .message-right {
      flex: 1;
      margin-top: 0.15rem;
      margin-left: 0.2rem;
      .message-right-item-title {
        margin-bottom: 0.06rem;
        h4 {
          width: 2.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.16rem;
          font-weight: 550;
          line-height: 0.22rem;
          color: #515a6e;
          .blue {
            display: inline-block;
            height: 0.22rem;
            line-height: 0.25rem;
            vertical-align: bottom;
            font-size: 0.2rem;
            color: #409eff !important;
          }
        }
      }
      .messname {
        margin-right: 0.1rem;
      }
      .message-right-item-time {
        .content {
          font-size: 0.14rem;
          color: #717171;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 2rem;
        }
        span {
          font-size: 0.14rem;
          color: #cccccc;
        }
      }
    }
  }
}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
