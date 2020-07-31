<template>
  <ibps-container
    ref="dashboardContainer"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :scroll-delay="scrollDelay"
    type="full"
    class="ibps-desktop-page"
    @scroll="({x, y}) => { scrollTop = y }"
  >

    <ibps-grid-layout
      v-if="layout && layout.length >0"
      :layout.sync="layout"
      :col-num="colNum"
      :row-height="rowHeight"
      :is-draggable="isDraggable"
      :is-resizable="isResizable"
      :is-mirrored="isMirrored"
      :vertical-compact="verticalCompact"
      :margin="margin"
      :use-css-transforms="useCssTransforms"
    >
      <ibps-grid-item
        v-for="(item,index) in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <component
          :is="'ibps-desktop-'+item.alias"
          v-if="hasComponent(item.alias)"
          :id="item.i"
          :alias="item.alias"
          :height="getHeight(item.h)"
          @action-event="(command,data)=> handleActionEvent(command,data,index)"
        />
      </ibps-grid-item>
    </ibps-grid-layout>
    <el-alert
      v-else-if="!loading"
      :closable="false"
      type="warning"
      show-icon
      style="height:50px"
    >
      <span slot="title">
        未设置个人桌面布局，可以通过“<a href="javascript:void(0)" @click="goMyLayout">个人办公-》个人桌面布局</a>”进行设置
      </span>
    </el-alert>
    <ibps-back-to-top
      :visibility-height="150"
      :scroll-top="scrollTop"
      transition-name="fade"
      @scrollToTop="scrollToTop"
    />
    <preview
      :id="id"
      :visible="dialogPreviewVisible"
      title="全屏预览"
      screen
      @close="visible => dialogPreviewVisible = visible"
    />
  </ibps-container>
</template>

<script>

import { getMyDesktop } from '@/api/platform/desktop/myLayout'
import { isInit, getComponents } from './components'
//  网格布局组件
import { GridLayout, GridItem } from 'vue-grid-layout'
import IbpsBackToTop from '@/components/ibps-back-to-top'
import Preview from '@/views/platform/desktop/column/preview'

export default {
  components: {
    IbpsBackToTop,
    Preview,
    'ibps-grid-layout': GridLayout,
    'ibps-grid-item': GridItem
  },
  data() {
    return {
      layout: null,
      colNum: 24,
      rowHeight: 30,
      isDraggable: false,
      isResizable: false,
      isMirrored: false,
      verticalCompact: true,
      margin: [15, 15],
      useCssTransforms: true,

      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      id: '',
      dialogPreviewVisible: false, // 预览
      defaultData: []

    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    scrollToTop() {
      this.$refs.dashboardContainer.scrollToTop()
    },
    // 抓取数据
    fetchData() {
      this.loading = true
      const systemAlias = this.$store.getters.system ? this.$store.getters.system.alias : ''
      const interval = setInterval(() => {
        if (isInit()) {
          getMyDesktop({
            systemAlias: systemAlias
          }).then(response => {
            try {
              this.layout = this.$utils.parseData(response.data)
              this.defaultData = this.$utils.parseData(response.data)
            } catch (error) {
              console.error(error)
              this.layout = []
              this.defaultData = []
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          clearInterval(interval)
        }
      }, 100)
    },
    getHeight(h) {
      return (h - 1) * (this.rowHeight + this.margin[1]) + this.margin[1]
    },
    hasComponent(alias) {
      const name = 'ibps-desktop-' + alias
      return getComponents().includes(name)
    },
    resizedHandler(i, newH, newW, newHPx, newWPx) {
      if (!this.layout) return
      this.layout.layout.find((n) => {
        if (i === n.i) {
          n.widthPx = this.getWidth(n.w)
          n.heightPx = this.getHeight(n.h)
        }
      })
    },
    goMyLayout() {
      this.$router.push({
        path: '/officeDesk/desktopMyLayout'
      })
    },
    handleActionEvent(command, { id }, index) {
      switch (command) {
        case 'fullscreen':
          this.handleFullscreen(id)
          break
        case 'collapse':
        case 'expansion':
          this.handleCollapseExpansion(index, command === 'collapse')
          break
        default:
          break
      }
    },
    /**
     * 全屏展示切换
     */
    handleFullscreen(id) {
      this.dialogPreviewVisible = true
      this.id = id
    },
    // 处理收缩/展开
    handleCollapseExpansion(index, isCollapse) {
      this.layout[index].h = isCollapse ? 2 : this.defaultData[index].h
      this.layout.push({ i: '0' })
      const deleteIndex = this.layout.findIndex(item => item.i === '0')
      this.layout.splice(deleteIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.ibps-desktop-page {
  .ibps-grid-item,
  .el-card{
    height: 100%;
  }
  .vue-grid-layout {
    border-radius: 4px;
    margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}
</style>

<style lang="scss" >
.ibps-desktop-dashboard{
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

