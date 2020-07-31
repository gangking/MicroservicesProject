
<template>
  <!-- <add-header class="add-header" @addPage="addPage" @removePage="removePage" @change="addData"></add-header> -->
  <div class="block rotary" ref="mainBody" @mouseover="swiperHover" @mouseout="swiperOutHover">
    <!-- bannner -->
    <!-- <div class="banner">
      <div class="bannercarousel">
        <carousel></carousel>
      </div>
      <div class="bannermycard">
        <mycard></mycard>
      </div>
    </div> -->

    <swiper
      ref="mySwiper"
      :options="swiperOption"
      class="swiper-warp multi_desktop"
      :style="{height:computerHeight,width:computerWidth}"
    >
      <swiper-slide v-for="(item,index) in layoutData" :key="index">
        <div class="commonSwiper">
          <slide-dashboard :layoutData="item" :page="index" :empty-text="emptyText"></slide-dashboard>
        </div>
      </swiper-slide>
      <!-- 修改底部轮播点隐藏 -->
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>
<script>
import carousel from "./components/carousel/index";
import mycard from "./components/mycard/index";

import axios from "axios";
import { getMulti } from "@/api/platform/desktop/multi";
import "swiper/dist/css/swiper.css"; //引入swiper css
import { swiper, swiperSlide } from "vue-awesome-swiper";
import slideDashboard from "@/views/platform/multi_desktop/components/layout";
import { mapState } from "vuex";
export default {
  name: "multi",
  components: {
    swiper,
    swiperSlide,
    slideDashboard,
    carousel,
    mycard
  },
  data() {
    return {
      emptyText: "请到个人办公->多桌面设置 管理你的自定义桌面",
      desktopMyLayout: "",
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
        // pagination: {
        //   el: ".multi_desktop .swiper-pagination",
        //   clickable: true
        // },
        navigation: {
          nextEl: ".multi_desktop .swiper-button-next",
          prevEl: ".multi_desktop .swiper-button-prev"
        },
        on: {
          click: () => {
            // 通过$refs获取对应的swiper对象
            let i = swiper.activeIndex;
            // console.log(i);
          },
          slideChangeTransitionEnd: () => {
            let swiper = this.$refs.mySwiper.swiper;
            this.activeIndex = swiper.activeIndex;
          }
        }
      },
      /* mock 数据 */
      layoutData: [
        // [
        //   {
        //     alias: "completedMatters",
        //     h: 9,
        //     i: "85c9c579-6de2-4374-a5cf-0091e8da0304",
        //     moved: false,
        //     w: 12,
        //     x: 12,
        //     y: 0
        //   },
        //   {
        //     alias: "myCompleted",
        //     h: 9,
        //     i: "fa1e328c-e1c7-4acd-ada1-f6705a9eed6b",
        //     moved: false,
        //     w: 12,
        //     x: 0,
        //     y: 0
        //   }
        // ],
        // [
        //   {
        //     alias: "myCompleted",
        //     h: 9,
        //     i: "fa1e328c-e1c7-4acd-ada1-f6705a9eed6b",
        //     moved: false,
        //     w: 12,
        //     x: 0,
        //     y: 0
        //   }
        // ]
      ]
    };
  },
  methods: {
    //获取数据
    getData() {
      // axios
      //   .get(
      //     "https://www.easy-mock.com/mock/59af6d3fe0dc6633419e63d2/example/multi"
      //   )
      //   .then(response => {
      //     this.layoutData = response.data.data;
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
      
        getMulti(this.$store.getters.userId)
        .then(response => {
          console.log(response);
          if (response.data.dataResult.length > 0) {
            this.layoutData = JSON.parse(
              response.data.dataResult[0].templateHtml
            );
            if (Array.isArray(this.layoutData)) {
             // this.copyData = JSON.parse(JSON.stringify(this.layoutData));
            } else {
              this.layoutData = [[]];
             
            }
          } else {
            this.layoutData = [[]];
         
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
      this.layoutData[this.activeIndex].push(data);
    },
    // 计算高度宽度
    calculateHeight() {
      var element = document.querySelector(".rotary");
      if (element) {
        this.computerWidth = element.clientWidth + "px";
        this.computerHeight = element.clientHeight - 10 + "px";
      }
    },
    // 左右箭头的hover显示隐藏
    swiperHover() {
      document.querySelector(".swiper-button-next").style.display = "block";
      document.querySelector(".swiper-button-prev").style.display = "block";
      // document.querySelector(".swiper-pagination").style.display = "block";
    },
    swiperOutHover() {
      document.querySelector(".swiper-button-next").style.display = "none";
      document.querySelector(".swiper-button-prev").style.display = "none";
      // document.querySelector(".swiper-pagination").style.display = "none";
    },
    loadData() {
      const systemAlias = "fssc";
      findHashRightsColumn({
        systemAlias: systemAlias
      })
        .then(response => {
          const dataResult = response.data;
          console.log(dataResult);
          // 构建组件
          dataResult.forEach(column => {
            const name = `ibps-desktop-${column.alias}`;
            Vue.component(name, (resolve, reject) => {
              resolve(buildComponent(name, column));
            });
            components.push(name);
          });
          //console.log(components);
        })
        .catch(error => {});
    }
    // listenMove() {
    //   this.throttle(this.listenScroll, 500);
    // },
    // listenScroll() {
    //   let main_work = document.querySelector(".main_work");
    //   let work_flex = document.querySelector(".work_flex");

    //   console.log(work_flex.scrollHeight, main_work.clientHeight);
    //   if (work_flex.scrollHeight > main_work.clientHeight) {
    //     this.$notify({
    //       title: "警告",
    //       message: "有滚动条了",
    //       type: "warning"
    //     });
    //   }
    // },
    // throttle(func, delay) {
    //   if (func.timeId) return;
    //   var that = this;
    //   func.timeId = setTimeout(function() {
    //     func.call(that);
    //     clearTimeout(func.timeId);
    //     func.timeId = null;
    //   }, delay);
    // }
  },

  watch: {
    visible: {
      immediate: true,
      handler: function() {}
    },
    asideShow(n, o) {
      setTimeout(() => {
        this.calculateHeight();
      }, 300);
    },
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

  
  },
  created() {
    //this.loadData();
  }
};
</script>
<style lang="scss" scoped>
// .ibps-container-full__body {
//   position: absolute;
//   top: 0;
//   right: 0px;
//   bottom: 0px;
//   left: 0px;
//   background: #fff;
//   overflow-y: auto;
//   .work_flex {
//     display: flex;
//     .work_left {
//       flex: 1;
//     }
//     .work_right {
//       width: 200px;
//       margin-right: 5px;
//     }
//   }
// }
.rotary {
  width: 100%;
  height: 100%;
  // background: #fff;
}

.commonSwiper {
  position: absolute;
  top: 0;
  right: 0px;
  bottom: 0px;
  left: 0px;
  // background: #fff;
  overflow-y: auto;
}

// .el-carousel__item:nth-child(2n) {
//   background-color: #1e58a8;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #62dbad;
// }

// .rotary /deep/ .swiper-slide {
//   color: #fff;
//   text-align: center;
//   font-size: 30px;
// }
// .rotary /deep/ .swiper-slide:nth-of-type(2n) {
//   background: #62dbad;
// }
// .rotary /deep/ .swiper-slide:nth-of-type(2n + 1) {
//   background: #1a5f86;
// }
/* swiper 左右按钮 下方pagetion*/
.swiper-button-prev {
  width: 20px;
  height: 20px;
  // 修改箭头颜色
  border-top: 2px solid #CCC;
  border-left: 2px solid #CCC;
  transform: rotate(-45deg);
  background: none !important;
  outline: none;
}
.swiper-button-next {
  width: 20px;
  height: 20px;
  border-top: 2px solid #CCC;
  border-left: 2px solid #CCC;
  transform: rotate(135deg);
  background: none !important;
  outline: none;
}
// .rotary /deep/ .swiper-pagination-bullet-active {
//   opacity: 1;
//   background: #34465a;
//   outline: none;
// }
// .rotary /deep/ .swiper-pagination {
//   bottom: -2px;
//   text-align: center;
// }
/* 布局相关设置 */
.swiper-warp {
}
.add-header {
  border-bottom: 1px solid #dcdfe6;
  background: #fff;
  padding: 10px;
}
.box-card /deep/.el-card__body {
  height: 100%;
}
.commonSwiper /deep/.vue-grid-layout {
  width: 100%;
}
/*修改首页banner margin值  */
// .banner {
//   margin: 0 10px;
// }
</style>
