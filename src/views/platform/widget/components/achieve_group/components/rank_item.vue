<template>
  <div class="rank" :style="backgroundImg">
    <div class="unit">单位：分/单</div>
    <div class="rank_title">本月处理单据排行</div>
    <div class="rank_list">
      <swiper ref="mySwiper" :options="swiperOption" class="swiper-no-swiping swiper-warp">
        <swiper-slide v-for="(list,index) in ranktData" :key="index">
          <div class="rankItem">
            <ul class="rankUl">
              <li
                class="rankLi"
                :style="rankbackImg"
                v-for="(item,itemIndex) in list"
                :key="itemIndex"
              >
                <img class="rankPhoto" :src="getPhoto(item.photo)" />
                <div class="personInfo">
                  <span>{{item.name}}</span>
                  <label></label>
                </div>
                <div class="personNum">{{item.value}}</div>
              </li>
              <!-- <li class="rankLi" :style="rankbackImg">
                <img class="rankPhoto" src="@/assets/images/bill_rank/ava1.jpg" />
                <div class="personInfo">
                  <span>张三</span>
                  <label>1002100</label>
                </div>
                <div class="personNum">1054</div>
              </li>
              <li class="rankLi" :style="rankbackImg">
                <img class="rankPhoto" src="@/assets/images/bill_rank/ava1.jpg" />
                <div class="personInfo">
                  <span>张三</span>
                  <label>1002100</label>
                </div>
                <div class="personNum">1054</div>
              </li>-->
            </ul>
          </div>
        </swiper-slide>

        <div class="swiper-pagination" slot="pagination" ref="pagination"></div>
        <!-- <div class="swiper-button-prev" slot="button-prev" ref="buttonPrev"></div>
        <div class="swiper-button-next" slot="button-next" ref="buttonNext"></div>-->
      </swiper>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css"; //引入swiper css
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getGroupCldjlPh } from "@/api/platform/achieve/group";
import { BASE_PHOTO_API } from "@/api/baseUrl";
export default {
  name: "rank",
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      backgroundImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/rank_bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },

      rankbackImg: {
        backgroundImage:
          "url(" + require("@/assets/images/achievement/rank_person.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      ranktData: [],
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
        autoplay: {
          delay: 2000,
          //当用户滑动图片后继续自动轮播
          disableOnInteraction: false
        },

        // navigation: {
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev"
        // },
        on: {
          click: () => {
            // 通过$refs获取对应的swiper对象
            let swiper = this.$refs.mySwiper.swiper;
            let i = swiper.activeIndex;
            console.log(i);
          },
          slideChangeTransitionEnd: () => {
            let swiper = this.$refs.mySwiper.swiper;
            // this.activeIndex = swiper.activeIndex;
          }
        }
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  watch: {},
  methods: {
    getPhoto(img) {
      return BASE_PHOTO_API + img;
    },
    initData() {
      getGroupCldjlPh({ group1: this.componInfo.parameters || "" }).then(
        res => {
          if (res.data.length > 0) {
            res.data.sort(this.aycArray);
            this.ranktData = this.againGroup(res.data, 3);
          }
          console.log(this.ranktData, 99999);
        }
      );
    },
    //分割数组
    againGroup(data, num) {
      var result = [];
      for (var i = 0, len = data.length; i < len; i += num) {
        result.push(data.slice(i, i + num));
      }
      return result;
    },
    //排序
    aycArray(a, b) {
      return b.value - a.value;
    }
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>

<style scoped lang="scss">
.rank {
  height: 100%;
  position: relative;
  .unit {
    position: absolute;
    right: 8px;
    top: 5px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 44px;
    letter-spacing: 0px;
    color: rgb(235, 222, 222);
  }
  .rank_title {
    color: #00e4ff;
    text-indent: 40px;
    font-size: 18px;
  }
  .rank_list {
    height: calc(100% - 40px);
    width: 95%;
    margin: 10px auto;
    color: #fff;
    .swiper-warp {
      width: 100%;
      height: 100%;
      .rankItem {
        .rankUl {
          .rankLi {
            margin-bottom: 30px;
            width: 290px;
            height: 80px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .rankPhoto {
              position: relative;
              right: 30px;
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
            .personInfo {
              margin-right: 20px;
              width: 30%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              > span {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 3px;
              }
            }
            .personNum {
              flex: 1;
              font-family: Impact;
              font-size: 38px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 36px;
              letter-spacing: 0px;
              color: #00eaff;
            }
          }
        }
      }
    }
  }
}
/deep/ .swiper-pagination-bullet {
  background: #fff;
  opacity: 0.8;
}
/deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: #007aff;
}
</style>
