<template>
  <div class="rank">
    <div class="header" :style="bgImg">
      <h3 class="headerTitle">{{title}}</h3>
      <ul class="headerUl">
        <li class="headerLi" v-for="(list,index) in rankTop" :key="list+index">
          <div class="itemAva" :class="{marginBottom:index==1}">
            <img class="itemHead" :src="list.ava"  border="0" />
            <img class="itemRank" :src="list.imgUrl" />
          </div>
          <div class="itemName" :class="{marginTop:index==1}">{{list.name}}</div>
          <div class="itemNum" :class="{colorRed:index==1}">{{format(list.num)}}</div>
        </li>
      </ul>
    </div>
    <ul class="rankList">
      <li class="rankLi" v-for="(item,index) in rankList" :key="item.num+index">
        <span class="rankNum">{{index+4}}</span>
        <span class="rankAva">
          <img :src="item.ava" />
        </span>
        <span class="rankName">{{item.name}}</span>
        <span class="rankFraction">{{item.num}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { getRanking } from "@/api/platform/bill/bill";
import { BASE_PHOTO_API } from "@/api/baseUrl";
export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rankTop: [
        {
          imgUrl: require("@/assets/images/bill_rank/rank2.png"),
          ava: " ",
          name: "",
          num: ""
        },
        {
          imgUrl: require("@/assets/images/bill_rank/rank1.png"),
          ava: " ",
          name: "",
          num: ""
        },
        {
          imgUrl: require("@/assets/images/bill_rank/rank3.png"),
          ava: " ",
          name: "",
          num: ""
        }
      ],
      rankList: [
        // {
        //   ava: require("@/assets/images/bill_rank/ava1.jpg"),
        //   name: "王五",
        //   num: 888
        // }
      ],

      bgImg: {
        backgroundImage:
          "url(" + require("@/assets/images/bill_rank/header.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto"
      },
      title: "本月处理单据量排行榜"
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  watch: {},
  methods: {
    initData() {
      getRanking({ group1: this.componInfo.parameters || "" }).then(res => {
        this.dealDeal(res.data.arrayCount, res.data.arrayName, res.data.photo);
        console.log(res, "排行榜的数据");
      });
    },
    //千分位处理
    format(num) {
      return (num + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    },
    dealDeal(countArr, nameArr, avaArr) {
      let topThreeCount = countArr.slice(0, 3);
      let topThreeName = nameArr.slice(0, 3);
      let topThreeAva = avaArr.slice(0, 3);
      let residueCount = countArr.slice(3);
      let residueName = nameArr.slice(3);
      let residueAva = avaArr.slice(3);
      topThreeCount.forEach((element, index) => {
        if (index == 0) {
          this.rankTop[1].num = element;
        } else if (index == 1) {
          this.rankTop[0].num = element;
        } else {
          this.rankTop[2].num = element;
        }
      });
      topThreeName.forEach((element, index) => {
        if (index == 0) {
          this.rankTop[1].name = element;
        } else if (index == 1) {
          this.rankTop[0].name = element;
        } else {
          this.rankTop[2].name = element;
        }
      });
      topThreeAva.forEach((element, index) => {
        if (index == 0) {
          this.rankTop[1].ava = BASE_PHOTO_API+element;
        } else if (index == 1) {
          this.rankTop[0].ava = BASE_PHOTO_API+element;
        } else {
          this.rankTop[2].ava = BASE_PHOTO_API+element;
        }
      });
      residueCount.forEach((item, index) => {
        let obj = {
          //ava: require("@/assets/images/bill_rank/ava1.jpg"),
          num: item
        };
        this.rankList.push(obj);
      });
      residueName.forEach((item, index) => {
        this.rankList[index]["name"] = item;
      });

      residueAva.forEach((item, index) => {
        this.rankList[index]["ava"] = item;
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
img[src=" "]{opacity:0;} 
.rank {
  height: 100%;
  background: #fff;
}
.header {
  min-height: 230px;
  .headerTitle {
    padding-top: 12px;
    padding-bottom: 10px;
    height: 40px;
    line-height: 40px;
    text-indent: 20px;
    font-weight: bold;
    font-size: 19px;
  }
  .headerUl {
    margin: 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    .headerLi {
      width: 33%;
      text-align: center;
      .itemAva {
        position: relative;
        display: inline-block;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 1px solid #ccc;
        //background: #3dc;
        .itemHead {
          margin-top: 15px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .itemRank {
          width: 36px;
          height: 36px;
          position: absolute;
          left: 50%;
          top: 53px;
          margin: 0 0 0 -18px;
        }
      }
      .itemName {
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
        font-weight: bold;
        text-align: center;
        font-size: 16px;
      }
      .itemNum {
        height: 26px;
        line-height: 26px;
        font-weight: bold;
        text-align: center;
        font-size: 18px;
      }
    }
    > li:nth-of-type(1) .itemAva {
      background: #d3d3d3;
    }
    > li:nth-of-type(2) .itemAva {
      background: #f5cf41;
    }
    > li:nth-of-type(3) .itemAva {
      background: #e19449;
    }
  }
}
.rankList {
  height: calc(100% - 230px);
  overflow: auto;
  margin: 0;
  padding: 0;

  .rankLi {
    display: flex;
    height: 70px;

    align-items: center;
    border-bottom: 1px solid #e4e4e4;
    > span {
      font-size: 14px;
      display: inline-block;
      text-align: center;
    }
    .rankNum {
      width: 20%;
      padding-left: 10%;
    }
    .rankAva {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .rankName {
      width: 22%;
    }
    .rankFraction {
      width: 23%;
    }
  }
}
.rankList > li:nth-last-of-type(0) {
  border-bottom: none !important;
}
.marginBottom {
  margin-top: -15px;
}
.marginTop {
  margin-top: 25px !important;
}
.colorRed {
  color: red;
}
</style>
