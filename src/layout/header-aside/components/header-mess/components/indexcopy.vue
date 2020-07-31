<template>
  <div class="message-wrap">
    <!-- 顶栏消息弹框 -->
    <div class="message" v-for="(item,index) in messinfo" :key="index" @click="goMess">
      <div class="message-flex">
        <div class="message-left">
          <span class="message-left-border" style="background-color: rgb(51, 145, 229);">
            <ibps-icon class="message-icon" name="paper-plane-o" size="16" />
          </span>
        </div>
        <div class="message-right">
          <div class="message-right-item-title">
            <h4>{{ item.subject }}</h4>
          </div>
          <div class="message-right-item-time">
            <span class="messname">{{item.ownerName}}</span>
            <span class="message-time">{{item.durationTime}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "header-mess",
  props: {
    messinfo: Array,
    close: Function
  },
  data() {
    return {};
  },
  mounted() {
    console.log('messinfo:',this.messinfo);
  },
  methods: {
    goMess() {
      let path = this.$route.path;
      if (path != "/officeDesk/innerMessage/receiveMessage") {
        this.$router.push({ path: "/officeDesk/innerMessage/receiveMessage" });
      }
      this.close();
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
  height: 3.45rem;
  // margin-top: 0.25rem;
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.35rem;
        height: 0.35rem;
        margin-top: 0.25rem;
        border-radius: 50%;
        .message-icon {
          color: #fff;
          font-size: 0.2rem !important;
          margin-left: -0.02rem;
        }
      }
    }
    .message-right {
      flex: 1;
      margin-top: 0.15rem;
      margin-left: 0.2rem;
      .message-right-item-title {
        margin-bottom: 0.04rem;
        h4 {
          width: 1.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.2rem;
          font-weight: 400;
          line-height: 0.22rem;
          color: #515a6e;
        }
      }
      .messname {
        margin-right: 0.1rem;
      }
      .message-right-item-time span {
        font-size: 0.14rem;
        color: #808695;
      }
    }
  }
}
</style>
