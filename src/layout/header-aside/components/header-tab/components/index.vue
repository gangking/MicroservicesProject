<template>
  <div>
    <div class="content">
      <ul class="clearfix">
        <li v-for="(page, index) in opened" :key="page.name+index" :label="generateTitle(page.meta.name,page.meta.title) || generateTitle('untitled')" :name="page.name" class="tab-li" :class="{'active':activeLi(page)}" @click="handleClickRoute(page,index)" v-if="(page.name) !='home' && (page.name) !='dashboard' ">
          <!-- <ibps-icon class="tab-icon" :name="page.meta.icon" size="16" /> -->
          <!-- 修复多任务图标不显示问题 -->
          <div class="tab-background" :style="{backgroundColor:'rgb('+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+')'}">
            <i :class="`iconfont icon-${page.meta.icon}`"></i>

            <i @click.stop="btnClose(page,index)" v-if="homeHide(page)" class="tab-close-btn el-icon-error"></i>
          </div>

          <span class="tab-text" :title="generateTitle(page.meta.name,page.meta.title)">{{generateTitle(page.meta.name,page.meta.title) || generateTitle('untitled')}}</span>
        </li>
      </ul>
    </div>
    <div class="button-set">
      <el-button type="danger" @click="btnCloseAll" class="closeall">关闭全部</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import I18n from '@/utils/i18n';

export default {
  components: {},
  data() {
    return {
      tagName: 'dashboard'
    };
  },
  watch: {
    opened: {
      handler(newTab, o) {
        let tabFiler = newTab.filter(v => {
          if ((v.name != 'dashboard') & (v.name != 'home')) {
            return true;
          }
        });
        this.$emit('tabNum', tabFiler.length);
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('ibps/page', ['opened', 'current']),
    activeLi() {
      return function(page) {
        if (page.meta.name == this.current || page.name === this.current) {
          return true;
        }
      };
    },
    homeHide() {
      return page => {
        return page.name === 'home' ? false : true;
      };
    }
  },
  methods: {
    ...mapActions('ibps/page', ['close', 'closeAll']),
    generateTitle(name, title, ...values) {
      return I18n.generateTitle(name, title, values);
    },

    // 点击相应的li跳转页面
    handleClickRoute(tab, index) {
      if (tab.name === 'home') {
        this.$router.push({ name: tab.name, query: tab.query });
      }
      const pageTab = this.opened.find(page => page.name === tab.name);
      const { name, params, query } = tab.meta;
      if (pageTab) {
        this.$router.push({ name: tab.name, params, query });
      }
    },
    // 列表 关闭按钮
    btnClose(page, index) {
      let tagName = page.name;
      console.log(tagName);
      this.close({
        tagName
      });
    },
    // 关闭全部的按钮
    btnCloseAll() {
      this.closeAll();
      this.$emit('closebtn');
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  width: 14rem;
  border-bottom: 1px solid #999;
  margin: 0;
  ul {
    flex: 1;
    margin-top: 0.1rem;
    margin-bottom: 0;
    padding-left: 0.05rem;
    width: 14.3rem;
    .tab-li {
      float: left;

      align-items: center;
      width: 0.88rem;
      height: 0.8rem;
      line-height: 0.35rem;
      margin-right: 0.1rem;
      margin-bottom: 0.05rem;
      margin-top: 0.1rem;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      .tab-background {
        position: relative;
        width: 0.5rem;
        height: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 0.1rem;
        color: #fff;
        border-radius: 0.15rem;
        transition: 0.3s all;
        .iconfont {
          color: #fff;
          font-size: 0.25rem;
        }
        .el-icon-close {
          cursor: pointer;
        }
        .tab-close-btn {
          position: absolute;
          top: -0.1rem;
          right: -0.1rem;
          cursor: pointer;
          color: #333;
          padding: 0.03rem;
          transition: all 0.3s;
          font-size: 0.2rem;
          &:hover {
            transform: scale(1.1);
            color: orangered;
          }
        }
      }

      i:nth-child(1) {
        font-size: 0.3rem;
      }
      &:hover .tab-text {
        transform: translateY(-0.03rem);
      }
      .tab-text {
        position: relative;
        top: -0.1rem;
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: all 0.3s;
        font-size: 0.14rem;
      }
    }
    .active {
      color: #409eff;
      background: #fff;
      .tab-icon {
        color: #409eff;
      }
    }
  }
}
.button-set {
  margin: 0.1rem auto;
  text-align: center;
  .closeall {
    width: 1.5rem;
    height: 0.4rem;
    font-size: 0.16rem;
  }
}
</style>

