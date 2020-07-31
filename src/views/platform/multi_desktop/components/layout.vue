<template>
  <div class="ibps-desktop-page">
    <grid-layout v-if="layout && layout.length >0" :layout.sync="layout" :col-num="colNum" :row-height="rowHeight" :is-draggable="isDraggable" :is-resizable="isResizable" :is-mirrored="isMirrored" :vertical-compact="verticalCompact" :margin="margin" :use-css-transforms="useCssTransforms" :responsive="responsive">
      <!-- 模块外包围 -->
      <grid-item v-for="(item ,index) in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
        <div class="ibps-grid-item">
          <component :is="item.com" :key="index" :componInfo="item" />
          <!-- <el-card class="box-card">
            <component :is="item.com" :key="index" />
          </el-card>-->
        </div>
      </grid-item>
    </grid-layout>
    <el-alert v-else :closable="false" :title="emptyText" type="warning" show-icon style="height:50px" />
    <!-- <add-column
      :visible="dialogVisible"
      @close="closeDialog"
      @confirm="handerAddConfirm"
    />-->
    <preview :id="id" :visible="dialogPreviewVisible" :screen="screen" title="全屏预览" @close="visible => dialogPreviewVisible = visible" />
  </div>
</template>
<script>
import { isInit, getComponents } from '@/pages/dashboard/components';
//  网格布局组件
import { GridLayout, GridItem } from 'vue-grid-layout';
import Preview from '@/views/platform/desktop/column/preview';
import { dynamicImport } from '@/utils/dynamic-import';
export default {
  components: {
    GridLayout,
    GridItem,
    Preview
  },
  props: {
    layoutData: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number
    },
    emptyText: {
      type: String
    },
    open: {
      type: Boolean
    },
    visible: Boolean,
    ectypal: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      autoSize: true, // 是否根据内容确定容器的高度
      colNum: 24, // 列数
      rowHeight: 30, // 行高
      margin: [8, 8], // 两个可移动元素间的距离
      //  maxRows: 99999999999, // 最大的行高
      useCssTransforms: true, //  是否使用自定义的过渡效果
      isDraggable: false, // 是否支持推拽
      isResizable: false, // 是否支持改变大小
      isMirrored: false, // if the RTL/LTR should be reversed.
      verticalCompact: true, // 是否使用verticalCompact(垂直紧凑)布局
      responsive: false, // 响应式布局
      layout: [],

      dialogPreviewVisible: false, // 预览
      id: '',
      defaultData: [],
      screen: true,
      shrink: false,

      dialogVisible: false,
      componentNames: [] //保存
    };
  },
  watch: {
    open(val, oldVal) {
      if (val) {
        this.fetchData();
      }
    },
    layoutData: {
      handler(n, o) {
        this.layout = JSON.parse(JSON.stringify(this.layoutData));
        this.initData();
      },
      immediate: true
    },
    ectypal() {
      this.defaultData = this.ectypal;
    },
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    initData() {
      this.componentNames = [];
      this.layout.forEach(item => {
        this.componentNames.push(dynamicImport(`@/views/platform/widget/components/${item.alias}`));
      });
      this.componentNames.forEach((item, index) => {
        this.$set(this.layout[index], 'com', item);
      });
    },
    // 抓取数据
    // fetchData() {
    //   if (isInit()) {
    //     this.$emit('init')
    //   } else {
    //     const interval = setInterval(() => {
    //       if (isInit()) {
    //         this.$emit('init')
    //         clearInterval(interval)
    //       }
    //     }, 100)
    //   }
    // },

    getHeight(h) {
      return (h - 1) * (this.rowHeight + this.margin[1]) + this.margin[1];
    },
    closeDialog() {
      this.$emit('close', false);
    },

    handleActionEvent(command, { id }, index) {
      switch (command) {
        case 'fullscreen':
          this.handleFullscreen(id);
          break;
        case 'collapse':
        case 'expansion':
          this.handleCollapseExpansion(index, command === 'collapse');
          break;
        default:
          break;
      }
    },
    /**
     * 全屏展示切换
     */
    handleFullscreen(id) {
      this.dialogPreviewVisible = true;
      this.id = id;
    },
    // 处理收缩/展开
    handleCollapseExpansion(index, isCollapse) {
      this.layout[index].h = isCollapse ? 2 : this.defaultData[index].h;
      this.layout.push({ i: '0' });
      const deleteIndex = this.layout.findIndex(item => item.i === '0');
      this.layout.splice(deleteIndex, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.ibps-desktop-page {
  .vue-grid-layout {
    border-radius: 4px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }
    .vue-resizable-handle {
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
    }
  }
  .ibps-grid-item,
  .el-card {
    height: 100%;
  }
  // .vue-grid-item{
  //   transition: height .5s;
  // }

  .ibps-grid-item .drag {
    cursor: move;
    padding: 5px;
  }
  .ibps-grid-item .remove {
    padding: 5px;
  }

  .ibps-grid-item .drag,
  .ibps-grid-item .remove {
    filter: alpha(opacity=20);
    opacity: 0.2;
    -webkit-transition: all 500ms ease;
    -moz-transition: all 500ms ease;
    -ms-transition: all 500ms ease;
    -o-transition: all 500ms ease;
    transition: all 500ms ease;
  }

  .ibps-grid-item:hover .drag,
  .ibps-grid-item:hover .remove {
    filter: alpha(opacity=100);
    opacity: 1;
  }

  .ibps-grid-item-tools {
    position: absolute;
    top: -15px;
    right: 0;
    padding: 7px 8px;
    z-index: 10;
  }
}
</style>

<style lang="scss" >
.ibps-desktop-dashboard {
  .item {
    position: relative;
    margin: 12px;
    padding: 12px;
    height: 90px;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
  }
  .item-header {
    position: relative;
    & > p {
      margin: 0px;
      font-size: 14px;
    }
    & > span {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
  .item-body {
    & > h2 {
      margin: 0;
      font-size: 32px;
      line-height: 60px;
    }
  }
  // .item-footer {
  //   line-height: 16px;
  //   & > span {
  //     font-size: 10px;
  //   }
  //   & > p {
  //     margin: 0px;
  //     font-size: 12px;
  //   }
  // }
  .item-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 80px;
    height: 80px;
    bottom: -35px;
    right: 50px;
    border: 2px solid #fff;
    border-radius: 100%;
    font-size: 48px;
    transform: rotate(-40deg);
    opacity: 0.1;
  }
}
</style>

