<template>
  <div class="rotary">
    <div class="toggle-header" @click="toggleHeader">
      <el-button v-show="!headerShow" size="mini">显示设置</el-button>
      <el-button v-show="headerShow" size="mini">隐藏设置</el-button>
    </div>
    <transition name="fade-slide">
      <add-header
        v-show="headerShow"
        class="add-header"
        @addPage="addPage"
        @removePage="removePage"
        @reset="reset"
        @change="addData"
        @save="save"
      />
    </transition>
    <div class="block" ref="mainBody" @mouseover="swiperHover" @mouseout="swiperOutHover">
      <swiper
        ref="mySwiper"
        :options="swiperOption"
        class="swiper-no-swiping multi_set swiper-warp"
        :style="{height:computerHeight,width:computerWidth}"
      >
        <swiper-slide v-for="(item,index) in layoutData" :key="index">
          <div class="commonSwiper">
            <slide-dashboard
              :layoutData="item"
              :ectypal="layoutData"
              :empty-text="emptyText"
              :page="index"
              @changeDele="changeDele"
              @changeResize="changeResize"
              @moved="moved"
            ></slide-dashboard>
          </div>
        </swiper-slide>

        <!-- <div class="swiper-pagination" slot="pagination" ref="pagination"></div> -->
        <div class="swiper-button-prev" slot="button-prev" ref="buttonPrev"></div>
        <div class="swiper-button-next" slot="button-next" ref="buttonNext"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getMulti, saveMulti } from "@/api/platform/desktop/multi";
import "swiper/dist/css/swiper.css"; //引入swiper css
import { swiper, swiperSlide } from "vue-awesome-swiper";
import addHeader from "@/views/platform/multi_set/components/add-header";
import slideDashboard from "@/views/platform/multi_set/components/layout";

import { mapState } from "vuex";
export default {
  name: "work",
  components: {
    swiper,
    swiperSlide,
    slideDashboard,
    addHeader
  },
  data() {
    return {
      headerShow: true,
      desktopMyLayout: {
        createBy: "",
        createTime: "",
        dataStatus: "",
        dbtype: "",
        id: "",
        ip: "",
        memo: "",
        name: "",
        pk: "",
        sn: 0,
        templateHtml: "",
        tenantId: "",
        updateBy: "",
        updateTime: "",
        userId: this.$store.getters.userId
      },
      emptyText: "请点击上方添加栏目，否则则按默认布局设置您的首页。",
      copyData: [], //恢复默认时使用
      observer: null,
      firedNum: 0,
      activeIndex: 0,
      computerHeight: "",
      computerWidth: "",
      swiperOption: {
        effect: "slide ", // fade  flip
        slidesPerView: 1,
        spaceBetween: 30,
        // loop:true,
        keyboard: {
          enabled: true
        },
        slidesPerView: "auto",
        pagination: {
          el: ".multi_set .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".multi_set .swiper-button-next",
          prevEl: ".multi_set .swiper-button-prev"
        },
        on: {
          click: () => {
            // 通过$refs获取对应的swiper对象
            let swiper = this.$refs.mySwiper.swiper;
            let i = swiper.activeIndex;
            console.log(i);
          },
          slideChangeTransitionEnd: () => {
            let swiper = this.$refs.mySwiper.swiper;
            this.activeIndex = swiper.activeIndex;
          }
        }
      },
      /* mock 数据 */
      layoutData: [
        /*    [
          {
            alias: "async1",
            h: 10,
            i: "85c9c579-6de2-4374-a5cf-0091e8da0304",
            moved: false,
            w: 12,
            x: 0,
            y: 0
          },
          {
            alias: "async2",
            h: 10,
            i: "fa1e328c-e1c7-4acd-ada1-f6705a9eed6b",
            moved: false,
            w: 12,
            x: 12,
            y: 0
          }
        ],
        [
          {
            alias: "bill",
            h: 10,
            i: "fa1e328c-e1c7-4acd-ada1-f6705a9eed6b",
            moved: false,
            w: 12,
            x: 0,
            y: 0
          }
        ] */
      ]
    };
  },
  methods: {
    //保存
    save() {
      this.desktopMyLayout.templateHtml = JSON.stringify(this.layoutData);
      saveMulti(this.desktopMyLayout)
        .then(response => {
          this.$alert("保存成功");
          this.$router.replace("/refresh");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取数据
    getData() {
      getMulti(this.$store.getters.userId)
        .then(response => {
          // console.log(response);
          if (response.data.dataResult.length > 0) {
            this.layoutData = JSON.parse(
              response.data.dataResult[0].templateHtml
            );
            if (Array.isArray(this.layoutData)) {
              this.copyData = JSON.parse(JSON.stringify(this.layoutData));
            } else {
              this.layoutData = [[]];
              this.copyData = [[]];
            }
          } else {
            this.layoutData = [[]];
            this.copyData = [[]];
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //重置功能
    reset() {
      this.layoutData = JSON.parse(JSON.stringify(this.copyData));
    },
    // moved事件
    moved(page, layout) {
      this.layoutData[page].splice(0);
      layout.forEach(item => {
        delete item.com;
        this.layoutData[page].push(item);
      });
    },
    // 拖动事件
    changeResize(page, layout) {
      this.layoutData[page].splice(0);
      layout.forEach(item => {
        delete item.com;
        this.layoutData[page].push(item);
      });
    },
    // 删除某一项目
    changeDele(page, i) {
      this.layoutData[page].splice(i, 1);
    },
    // 添加新一页slide
    addPage() {
      this.layoutData.push([]);
    },
    // 删除最后一页slide
    removePage() {
      if (this.layoutData[this.layoutData.length - 1].length > 0) {
        this.$confirm("删除的页面有数据，确定删除?", "提示", {
          type: "warning"
        })
          .then(() => {
            this.layoutData.pop();
          })
          .catch(() => {});
      } else {
        this.layoutData.pop();
      }
    },
    //获取添加的数据 到当前页
    addData(data) {
      console.log(data, "加载的数据");
      this.layoutData[this.activeIndex].push(data);
    },
    // 计算高度宽度
    calculateHeight() {
      var element = document.querySelector(".rotary");
      if (element) {
        this.computerWidth = element.clientWidth + "px";
        this.computerHeight = element.clientHeight + "px";
      }
    },
    // 左右箭头的hover显示隐藏
    swiperHover() {
      // this.$refs["pagination"].style.display = "block";
      this.$refs["buttonPrev"].style.display = "block";
      this.$refs["buttonNext"].style.display = "block";
      // document.querySelector(".swiper-button-next").style.display = "block";
      // document.querySelector(".swiper-button-prev").style.display = "block";
      // document.querySelector(".swiper-pagination").style.display = "block";
    },
    swiperOutHover() {
      // this.$refs["pagination"].style.display = "none";
      this.$refs["buttonPrev"].style.display = "none";
      this.$refs["buttonNext"].style.display = "none";
      // document.querySelector(".swiper-button-next").style.display = "none";
      // document.querySelector(".swiper-button-prev").style.display = "none";
      // document.querySelector(".swiper-pagination").style.display = "none";
    },
    toggleHeader() {
      this.headerShow = !this.headerShow;
    }
  },

  watch: {
    visible: {
      immediate: true,
      handler: function() {}
    },
    //侧边栏收缩 放大
    asideShow(n, o) {
      setTimeout(() => {
        this.calculateHeight();
      }, 300);
    },
    //侧边栏显示隐藏
    toggleSlide(n, o) {
      setTimeout(() => {
        this.calculateHeight();
      }, 300);
    }
  },
  computed: {
    ...mapState("ibps/menu", {
      asideShow: state => state.asideShow,
      toggleSlide: state => state.toggleSlide
    })
  },
  mounted() {
    setTimeout(() => {
      this.calculateHeight();
    }, 1000);
    window.addEventListener("resize", () => {
      this.calculateHeight();
    });
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.rotary {
  width: 100%;
  height: 100%;
  position: relative;
}
.block {
  position: absolute;
  top: 0;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.commonSwiper {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  // background: #fff;
  overflow-y: auto;
}
/* swiper 左右按钮 下方pagetion*/
.swiper-button-prev {
  width: 20px;
  height: 20px;
  border-top: 2px solid rgb(48, 42, 34);
  border-left: 2px solid rgb(48, 42, 34);
  transform: rotate(-45deg);
  background: none !important;
  outline: none;
}
.swiper-button-next {
  width: 20px;
  height: 20px;
  border-top: 2px solid rgb(48, 42, 34);
  border-left: 2px solid rgb(48, 42, 34);
  transform: rotate(135deg);
  background: none !important;
  outline: none;
}
.rotary /deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: #34465a;
  outline: none;
}
.rotary /deep/ .swiper-pagination {
  bottom: 10px;
  text-align: center;
}
/* 布局相关设置 */
.swiper-warp {
}
.add-header {
  position: absolute;
  border-bottom: 1px solid #dcdfe6;
  width: 100%;
  background: #fff;
  padding: 10px;
  z-index: 999;
}
.commonSwiper /deep/ .vue-grid-item > .vue-resizable-handle {
  z-index: 999;
}
/* 设置区域 */
.toggle-header {
  display: flex;
  height: 25px;
  width: 80px;
  background: #fff;
  position: absolute;
  right: 7px;
  top: 16px;
  z-index: 1000;
}
</style>
