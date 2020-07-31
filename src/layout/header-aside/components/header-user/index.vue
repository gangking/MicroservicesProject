<template>
  <div class="ibps-layout-header-user">
    <el-dropdown size="small" @command="command => handleControlItemClick(command)" @visible-change="visible =>dropdownVisible=visible" class="elbox">
      <div class="box">
        <el-avatar :text="userName" shape="square" style="background: none;" @error="errorImageHandler" class="errimg">
          <!-- <img :src="errorImage" /> -->
          <!-- <img src="@/assets/images/desktop/mycard/headportrait.png" alt /> -->
          <img :src="photo" />
        </el-avatar>
        <!-- <el-button type="text" style="display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 60px;">{{ userName }}开发001开发001开发001开发001</el-button> -->
        <!-- <i
          :class="{
            'el-icon-arrow-down':!dropdownVisible,
            'el-icon-arrow-up':dropdownVisible
          }"
          style="position: absolute;right: -15px;top: 15px;"
        />-->
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!-- <el-dropdown-item command="dashboard">
          <ibps-icon name="home" class="ibps-mr-10" />
          {{ $t('navbar.dashboard') }}
        </el-dropdown-item>-->
        <!-- <el-dropdown-item command="userInfo">
          <ibps-icon name="user" class="ibps-mr-10" />
          {{ $t('navbar.userInfo') }}
        </el-dropdown-item>-->
        <!-- 取消修改密码 -->
        <el-dropdown-item command="changePassword">
          <ibps-icon name="lock" class="ibps-mr-10" />
          {{ $t('navbar.changePassword') }}
        </el-dropdown-item>
        <!-- 更换主题 -->
        <el-dropdown-item command="ibpsHeaderSetting">
          <i class="iconfont icon-setting iconsize"></i>
          {{ $t('navbar.theme') }}
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <ibps-icon name="sign-out" class="ibps-mr-10" />
          {{ $t('navbar.logOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <change-password :ids="userId" :visible="changePasswordVisible" :title=" $t('navbar.changePassword') " @close="visible => changePasswordVisible = visible" />
    <!-- <user-info
      :id="userId"
      :visible="userInfoVisible"
      :title=" $t('navbar.userInfo') "
      readonly
      @close="visible => userInfoVisible = visible"
    />-->
    <!-- <ibps-header-setting /> -->
    <Setting :settingVisible.sync="settingVisible"></Setting>

    <!-- 去掉主题色选项 -->
    <!-- <div class="panel panel-info">
          <div class="panel-heading">
            {{ $t('navbar.color') }}
          </div>
          <div class="panel-body">
            <el-color-picker
              v-model="color"
              :predefine="predefine"
              size="mini"
              @change="handleColorChange"
            />
          </div>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getFile } from '@/utils/avatar';
import setting from '@/setting.js';
import ChangePassword from '@/views/platform/org/employee/change-password';
import UserInfo from '@/views/platform/org/employee/edit';
import Setting from '../header-setting/index.vue';
import { getToken } from '@/utils/auth';
import request from '@/utils/request';
import { BASE_GATEWAY_API, BASE_PHOTO_API } from '@/api/baseUrl';
const avatarImgage = require('@/assets/images/mycard/avatar.png');
export default {
  mounted() {
    this.getPhoto();
  },
  components: {
    ChangePassword,
    UserInfo,
    Setting
  },
  data() {
    return {
      dropdownVisible: false,
      changePasswordVisible: false,
      userInfoVisible: false,
      settingVisible: false,
      userid: this.$store.getters.userId,
      photo: ''
    };
  },
  computed: {
    ...mapState('ibps/user', ['info']),
    userId() {
      return this.info && this.info.employee ? this.info.employee.id : '';
    },
    // avatar() {
    //   const photo =
    //     this.info && this.info.employee ? this.info.employee.photo : null;
    //     // 修改默认图片
    //   // if (this.$utils.isEmpty(photo)) {
    //   //   return this.errorImage;
    //   // }
    //   return getFile(photo);
    // },
    errorImage() {
      return this.$baseUrl + setting.userInfo.user.photo;
    },
    userName() {
      return this.info && this.info.employee ? this.info.employee.name : '';
    }
  },
  methods: {
    ...mapActions('ibps/account', ['logout']),
    handleControlItemClick(command) {
      switch (command) {
        case 'dashboard': // 主页
          this.$router.push({ path: '/' });
          break;
        case 'userInfo': // 个人信息
          this.userInfo();
          break;
        case 'changePassword': // 修改密码
          this.changePassword();
          break;
        case 'ibpsHeaderSetting': // 修改主题
          this.ibpsHeaderSetting();
          break;
        case 'logout': // 登出
          this.logOff();
          break;
      }
    },
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        vm: this,
        confirm: true
      });
    },
    changePassword() {
      this.changePasswordVisible = true;
    },
    ibpsHeaderSetting() {
      this.settingVisible = true;
      // console.log(this.settingVisible);
    },
    userInfo() {
      this.userInfoVisible = true;
    },

    errorImageHandler() {
      return false;
    },
    getphotoUrl(url) {
      var reg = /http[s]?\:/gi,
        local_url = process.env.VUE_APP_BASE_PHOTO_API,
        default_url = avatarImgage;

      return url ? (reg.test(url) ? url : local_url + url) : default_url;
    },
    getPhoto() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: 'user/v3/employee/getSuper?subPid=' + this.userid,
        method: 'get'
      }).then(res => {
        // 修改默认图片
        this.photo = this.getphotoUrl(res.data.photo);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ibps-layout-header-user {
  position: relative;
  width: 42px !important;
  height: 46px !important;
  margin-right: 10px;
}
.elbox {
  position: absolute;
  // top: -1.82rem;
  margin-left: 10px;
  width: 50px !important;
  height: 46px !important;
}
.box {
  position: absolute;
  // top: 8px;
  width: 40px;
  height: 40px;
  .errimg {
    height: 36px;
    width: 36px;
    margin-left: 4px;
    margin-top: 4px;
    /deep/ img {
      border-radius: 50%;
      width: 100%;
    }
  }
}
.iconsize {
  font-size: 14px;
  margin-right: 9px;
}
.user-dropdown {
  position: absolute;
  top: 47px !important;
}
</style>