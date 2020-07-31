<template>
  <div class="ibps-header-setting">
    <!-- <el-tooltip
      :content="$t('navbar.setting')"
      effect="dark"
      placement="bottom"
    >-->
    <!-- 设置按钮 -->
    <!-- <el-button class="btn-text can-hover" type="text" @click="handleClick">
        <ibps-icon name="cog" size="22" />
    </el-button>-->
    <!-- </el-tooltip> -->
    <el-drawer
      :visible="settingVisible"
      :title="$t('navbar.setting')"
      width="30%"
      :before-close="handleClose"
      class="navbarbox"
    >
      <el-scrollbar style="height: 100%">
        <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.theme') }}</div>
          <div class="panel-body">
            <ul>
              <li
                v-for="(item,index) in themelist"
                :key="index"
                class="theme-preview"
                @click="handleSelectTheme(item.name)"
              >
                <!-- {{ index }} -->
                <div class="colorbox">
                  <!-- <div class="ddd">
                    <i class="iconfont icon-duigou coloricon"></i>
                  </div>-->
                  <div :style="{'background': item.color }" class="topcolor"></div>
                  <div class="butcolor">
                    <div :style="{'background': item.leftcolor }" class="leftcolor"></div>
                    <div class="centercolor"></div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- <el-table :data="themeList" :show-header="false" border> -->
            <!-- 颜色名字 -->
            <!-- <el-table-column width="120">
                <template slot-scope="scope">{{ $t(scope.row.title) }}</template>
            </el-table-column>-->
            <!-- 颜色模块 -->
            <!-- <el-table-column width="100px">
                <div
                  slot-scope="scope"
                  :style="{'background': scope.row.color }"
                  class="theme-preview"
                  @click="handleSelectTheme(scope.row.name)"
                />
            </el-table-column>-->
            <!-- 按钮 -->
            <!-- <el-table-column prop="address" align="center">
                <template slot-scope="scope">
                  <el-button v-if="activeThemeName === scope.row.name" type="success" icon="el-icon-check" round>{{ $t('theme.status.activate') }}</el-button>
                  <el-button v-else round @click="handleSelectTheme(scope.row.name)">{{ $t('theme.status.select') }}</el-button>
                </template>
            </el-table-column>-->
            <!-- </el-table> -->
          </div>
        </div>
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
        <!-- <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.language') }}</div>
          <div class="panel-body rightbody">
            <el-radio-group v-model="language">
              <el-radio
                v-for="item in languageList"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="panel panel-info">
          <div class="panel-heading">{{ $t('navbar.size') }}</div>
          <div class="panel-body rightbody">
            <el-radio-group v-model="size">
              <el-radio v-for="item in sizes" :key="item" :label="item">{{ $t('size.'+item) }}</el-radio>
            </el-radio-group>
          </div>
        </div> -->
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import setting from "@/setting.js";
export default {
  created() {
    this.themelist = this.themeList;
    // console.log(this.themelist);
  },
  props: {
    settingVisible: {
      type: Boolean,
      default: false,
      themelist: ""
    }
  },
  data() {
    return {
      // settingVisible: false,
      themeDialogVisible: false,
      languageList: [
        { value: "zh-CN", label: "简体中文" },
        { value: "en", label: "English" }
      ],
      sizes: ["default", "medium", "small", "mini"],
      predefine: setting.color.predefine
    };
  },
  computed: {
    ...mapState({
      themeList: state => state.ibps.theme.list,
      activeThemeName: state => state.ibps.theme.activeName,
      sizeValue: state => state.ibps.size.value,
      languageValue: state => state.ibps.language.value,
      colorValue: state => state.ibps.color.value
    }),
    language: {
      get() {
        return this.languageValue || "zh-CN";
      },
      set(value) {
        this.handleLanguageChange(value);
      }
    },
    size: {
      get() {
        return this.sizeValue || this.$ELEMENT.size;
      },
      set(value) {
        this.handleSizeChange(value);
      }
    },
    color: {
      get() {
        return this.colorValue || process.env.VUE_APP_ELEMENT_COLOR;
      },
      set(value) {
        this.handleColorChange(value);
      }
    }
  },
  watch: {
    // // 注意 这里是关键
    // // 因为需要访问 this.$ELEMENT 所以只能在这里使用这种方式
    // sizeValue: {
    //   handler(val, oldVal) {
    //     if (val === '') {
    //       return this.handleSizeChange(this.$ELEMENT.size || setting.system.size)
    //     }
    //     if (oldVal) {
    //       // 这个情况在已经加载完页面 用户改变了尺寸时触发
    //       this.$ELEMENT.size = val
    //       // 由于已经加载过设置 需要清空缓存设置
    //       this.pageKeepAliveClean()
    //       // 由于已经加载过设置 需要刷新此页面
    //       this.$router.replace('/refresh')
    //     } else {
    //       // 这个情况在刷新页面时触发
    //       this.$ELEMENT.size = val
    //     }
    //   },
    //   immediate: true
    // },

    themeList: {
      handler(val, oldVal) {
        //console.log(val);
      },
      immediate: true
    },
    // 因为需要访问 this.$i18n 所以只能在这里使用这种方式
    languageValue: {
      handler(val, oldVal) {
        if (val === "") {
          return this.handleLanguageChange(
            this.$i18n.locale || setting.system.language
          );
        }
        if (oldVal) {
          // 这个情况在已经加载完页面 用户改变了国际化时触发
          this.$i18n.locale = val;
          // 由于已经加载过设置 需要清空缓存设置
          this.pageKeepAliveClean();
          // 由于已经加载过设置 需要刷新此页面
          this.$router.replace("/refresh");
        } else {
          // 这个情况在刷新页面时触发
          this.$i18n.locale = val;
        }
      },
      immediate: true
    },
    //
    colorValue: {
      handler(val, oldVal) {
        if (val === "") {
          this.handleColorChange(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: "ibps/page/keepAliveClean"
    }),
    ...mapActions({
      themeSet: "ibps/theme/set",
      sizeSet: "ibps/size/set",
      languageSet: "ibps/language/set",
      colorSet: "ibps/color/set"
    }),

    handleClick() {
      this.settingVisible = true;
    },
    handleClose() {
      this.$emit("update:settingVisible", false);
    },
    // -----------------主题---------------
    handleSelectTheme(value) {
      this.themeSet(value);
    },
    // -----------------尺寸---------------
    handleSizeChange(value) {
      this.sizeSet(value);
    },
    // -----------------语言---------------
    handleLanguageChange(value) {
      this.languageSet(value);
    },
    // -----------------颜色---------------
    handleColorChange(value) {
      this.colorSet(value);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/public.scss";
.theme-preview {
  float: left;
  height: 0.6rem;
  width: 0.9rem;
  margin: 3% 6%;
  // border-radius: 0.04rem;
  background-size: cover;
  border: 1px solid $color-border-1;
  list-style: none;
  .colorbox {
    height: 0.6rem;
    width: 0.9em;
    position: relative;     
      .leftcolor {
        position: absolute;
        top: 0.2rem;
        width: 0.25rem;
        height: 0.41rem;
      }
      .centercolor{
        position: absolute;
        top: 0.2rem;
        left: 0.25rem;
        width: 0.644rem;
        height: 0.4rem;
        background: $color-border-1;
      }

    .topcolor {
      position: absolute;
      // left: 0.25rem;
      // float: left;
      width: 0.91rem;
      height: 0.2rem;
    }
  }
}
</style>
<style lang="scss">
.ibps-header-setting-drawer {
  .el-drawer__header {
    margin-bottom: 0.1rem;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid #dcdfe6;
  }
  .el-drawer__body {
    padding: 0.05rem;
  }

  .ibps-header-setting-wrapper {
    height: calc(100vh - 65px) !important;
    .panel {
      border: 1px solid #dde7ee;
    }
  }
}
.panel-info {
  .panel-heading {
    font-size: 0.22rem;
    font-weight: 500;
    // height: 0.3rem;
  }
  .panel-body {
    // height: 0.5rem;
    ul {
      margin: 0 !important;
    }
  }
}
.rightbody {
  height: 0.5rem !important;
  line-height: 0.35rem;

  /deep/ .el-radio__label {
    font-size: 0.18rem;
  }
}
.navbarbox /deep/ .el-drawer__header {
  font-size: 0.28rem;
  font-weight: 500;
  margin: 0.3rem 0;
  padding: 0 20px !important;
}
</style>
