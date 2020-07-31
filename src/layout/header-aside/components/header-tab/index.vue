<template>
  <div class="main">
    <fssc-header-icon @click.native.stop="handClick" :badge-hidden="false" :badgeNumber="messageCount" icon="icon-more">
      <div slot="content">多任务管理</div>
    </fssc-header-icon>
    <template>

      <transition name="bounceInDown">
        <el-card class="box-card2" v-show="headerBtn.headerTab" @click.native.stop ref="tab">
          <div slot="header" class="clearfix">
            <span>多任务队列</span>

            <!-- <button
              type="button"
              style="float: right; padding: 3px 0"
              @click="btnClose"
              aria-label="Close"
              class="el-message-box__headerbtn"
            >
              <i class="el-message-box__close el-icon-close"></i>
            </button>-->
          </div>

          <fssc-tabs @tabNum="watchTab" @closebtn="btnClose"></fssc-tabs>
        </el-card>
      </transition>
    </template>
  </div>
</template>
    

<script>
import FsscTabs from './components';
import { mapState, mapMutations } from 'vuex';
import FsscHeaderIcon from '../header-menu-icon';

export default {
  data() {
    return {
      messageList: [],
      messageCount: 0
    };
  },
  components: {
    FsscTabs,
    FsscHeaderIcon
  },
  created() {
    this.loadData();
    this.winHandel();
  },
  computed: {
    ...mapState('ibps/menu', ['headerBtn'])
  },
  methods: {
    //获取多任务数量
    watchTab(n) {
      this.messageCount = n;
    },
    // 加载数据
    loadData() {
      // getMsgList()
      //   .then(response => {
      //     const data = response.data;
      //     this.messageList = data.dataResult;
      //     this.messageCount = data.pageResult ? data.pageResult.totalCount : 0;
      //   })
      //   .catch(() => {});
    },
    handClick() {
      this.headerBtn.headerTab = !this.headerBtn.headerTab;
      let activeMess = ['headerTab', this.headerBtn.headerTab];

      this.activeTop(activeMess);
    },
    cardHandel() {},
    btnClose() {
      this.headerBtn.headerTab = false;
    },
    winHandel() {
      document.addEventListener('click', e => {
        this.headerBtn.headerTab = false;
      });
    },
    ...mapMutations('ibps/menu', ['activeTop'])
  }
};
</script>
<style lang="scss" scoped >
.header-message-popper {
  padding: 0 !important;
  .message-more {
    padding: 15px 0;
    text-align: center;
    border-top: 1px solid #ebeef5;
  }
}
.main {
  position: relative;
  width: 44px;
  height: 46px;
  .box-card2 {
    font-size: 0.22rem;
    position: absolute;
    top: 55px;
    right: 0.2rem;
    z-index: 999999;
    width: 14.3rem;
    height: 2.6rem;
    font-weight: 500;
  }
  // .btn-text {
  //   padding-right: 0.16rem !important;
  // }
}
.box-card2 /deep/ .el-card__body {
  height: 1.8rem;
  overflow: auto;
  padding-top: 0.05rem;
  // ul{
  //   .tab-li{
  //     width: 0.88rem;
  //     margin-right: 0.1rem !important;
  //     .tab-text{
  //       font-size: 0.14rem;
  //       .tab-icon{
  //         font-size: 0.35rem !important;
  //       }
  //     }
  //   }
  // }
}

.imgtop {
  margin-top: 2px;
  width: 18px;
  height: 18px;
}

.icontop {
  top: 10px;
  display: inline-block;
  font-size: 18px;
  // margin-top: 3px;
}
.icontop1 {
  position: absolute;
  margin: 0 -2px !important;
  // top: -3px;
  // overflow: visible !important;
  overflow: hidden;
  width: 48px;
  height: 46px;
}
.padbom {
  padding-bottom: 12px;
}
</style>

