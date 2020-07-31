
<template>
  <div :class="slidePage" ref="mainBody" @mouseover="swiperHover" @mouseout="swiperOutHover">
    <swiper
      ref="mySwiper"
      :options="swiperOption"
      class="swiper-no-swiping swiper-warp"
      :style="{width:slideWidth,height:slideHeight}"
    >
      <swiper-slide v-for="(noteSilde,index) in noteData" :key="index">
        <div class="commonSwiper">
          <drag-item 
          :noteData="noteSilde"
          :pageNum="pageNum"
          :swiperIndex="index"
          @dragChange="dragChange"
          @add="add"
          @deleteId="deleteId"
          ></drag-item>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css"; //引入swiper css
import { swiper, swiperSlide } from "vue-awesome-swiper";
import DragItem from "./drag-item";
export default {
  name: "drag-slide",
  props: {
    slideWidth: {
      type: String
    },
    slideHeight: {
      type: String
    },
    pageNum: {
      type: Number
    },
    noteData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
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
      }
    };
  },
  watch: {
    pageNum: {
      handler(n) {
        //console.log(this.pageNum);
      },
      immediate: true
    },
    noteData: {
      handler(n) {
        
        // console.log(n)
      }
    }
  },
  computed: {
    slidePage() {
      return "swiperNum" + this.pageNum;
    }
  },
  mounted() {
    this.swiperOption.pagination = ".swiper-pagination" + this.pageNum;
    this.swiperOption.navigation = ".swiper-button-next" + this.pageNum;
    this.swiperOption.prevEl = ".swiper-button-prev" + this.pageNum;
  },
  methods: {
    swiperHover() {},
    swiperOutHover() {},
    dragChange(data, index,swiper){

      this.$emit("dragList",data,index,swiper)
    },
    add(index,swiper){
      this.$emit('add',index,swiper)
    },
    deleteId(pageNum,swiper,id){
      this.$emit("deleteId",pageNum,swiper,id)
    }
  },
  components: {
    DragItem,
    swiper,
    swiperSlide
  }
};
</script>

<style scoped lang="scss">
.swiper-warp {
  min-height: 180px;
  // position: absolute;
  // top: 0px;
  // right: 0px;
  // bottom: 0px;
  // left: 0px;
  background: #fff;
  overflow-y: auto;
}
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
</style>
