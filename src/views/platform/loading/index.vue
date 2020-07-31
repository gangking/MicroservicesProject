<template>
  <div class="loading">
    loading......
    <layoutComponent :addressParam="addressParam" @exit-multi-form="Close" />
  </div>
</template>

<script>
import layoutComponent from '@/layout/header-aside/layout.vue';
import { createNamespacedHelpers, mapActions as rootMapActions, mapMutations } from 'vuex';
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('ibps/account');
import { getUserInfo } from '@/api/oauth2/user';
export default {
  components: {
    layoutComponent
  },
  data() {
    return {
      addressParam: {}
    };
  },

  mounted() {
    // 更新token
    this.updataTokenInfo({
      access_token: this.$route.query.userToken,
      refresh_token: this.$route.query.refreshToken
    });

    // 打开表单
    const { appId, instId, taskId, status, routerName } = this.$route.query;

    setTimeout(() => {
      this.addressParam = {
        appId,
        instId,
        taskId,
        status,
        routerName
      };
    }, 10);

    console.log('接受路由参数', this.$route, this.addressParam);
  },
  methods: {
    ...mapActions(['updataTokenInfo']),
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...rootMapActions({
      switchUser: 'ibps/user/switchUser'
    }),
    handleSwitchUser(username) {
      this.switchUser(username).then(() => {
        //ActionUtils.successMessage('切换用户成功!');
        // 由于已经加载过设置 需要清空缓存设置
        this.pageKeepAliveClean();
        // 由于已经加载过设置 需要刷新此页面
        this.$router.replace('/fqlc/MyInitiationProcess');
        // window.location.reload();
      });
    },
    Close() {
      /* this.console.log('close....');
      if (
        navigator.userAgent.indexOf('Firefox') != -1 ||
        navigator.userAgent.indexOf('Chrome') != -1
      ) {
        window.location.href = 'about:blank';
        window.close();
      } else {
        window.opener = null;
        window.open('', '_self');
        window.close();
      }*/
      getUserInfo('*').then(
        ({
          data: {
            user: { account }
          }
        }) => {
          // console.log('获取外链账号', account, '准备自动登录');
          this.handleSwitchUser(account);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: calc(100vh);
  padding: 10px;
  box-sizing: border-box;
}
</style>