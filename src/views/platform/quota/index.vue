<template>
  <div class="bg" ref="quota">
    <div class="quotaRadio" ref="quotaTitle">
      <div class="quotaRadioTitle">指标选择:</div>
      <el-radio-group v-model="radio" @change="handleChange">
        <el-radio label="platform_work">平台工作指标</el-radio>
        <el-radio label="business_work">业务工作指标</el-radio>
        <el-radio label="share_work">共享工作指标</el-radio>

        <el-radio label="platform_achieve">平台绩效指标</el-radio>
        <el-radio label="business_achieve">业务绩效指标</el-radio>
        <el-radio label="share_achieve">共享绩效指标</el-radio>
      </el-radio-group>
    </div>
    <div class="quotaMain">
      <component :is="compon" :quotaHeight="quotaHeight" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { dynamicImport } from '@/utils/dynamic-import';
export default {
  props: {},
  data() {
    return {
      radio: 'platform_work',
      compon: '',
      quotaHeight: 0
    };
  },
  computed: {
    chartResize() {
      return _.throttle(() => {
        this.getHeight();
      }, 150);
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.$nextTick(() => {
      this.getHeight();
    });
  },
  mounted() {
    this.loadComponent();
  },
  watch: {},
  methods: {
    getHeight() {
      this.quotaHeight = this.$refs.quota.clientHeight - this.$refs.quotaTitle.clientHeight;
    },
    handleChange(label) {
      console.log(label);

      this.compon = dynamicImport(`@/views/platform/quota/components/${label}`);
    },
    loadComponent() {
      this.compon = dynamicImport(`@/views/platform/quota/components/platform_work`);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight);
  },
  components: {}
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
  .quotaRadio {
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    height: 60px;
    line-height: 60px;

    .quotaRadioTitle {
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      padding-left: 10px;
      padding-right: 15px;
    }
  }
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    .btn-left {
      float: left;
    }
    .btn-right {
      float: right;
      padding-right: 10px;
    }
  }
  .header-input {
    padding: 5px;
    border: 1px solid #ebeef5;
  }
  .footer {
    padding: 5px 0;
    border-top: 1px solid #dcdfe6;
    background: #fff;
  }
}
</style>
