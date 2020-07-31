<template>
  <div flex-box="1" class="banner">
    <div class="block">
      <el-carousel height="320px" :autoplay="false">
        <el-carousel-item v-for="(item,index) in options" :key="index">
          <a href="#">
            <img :src="item.imgUrl" class="bannerimg" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="mycard">
      <div class="title">
        <span class="myname">您好, 张三</span>
        <a href="#" class="edit">
          <img src="@/assets/images/desktop/mycard/edit.png" />
        </a>
      </div>
      <div class="myinfo">
        <img src="@/assets/images/desktop/mycard/headportrait.png" class="headportrait" />
        <p>当前信息完成度</p>
        <p>58%</p>
      </div>
      <div class="mydetail">
        <p>职位</p>
        <p>部门</p>
        <p>直线领导</p>
        <p>差标信息</p>
        <p>信用分</p>
      </div>
      <div class="myproject">
        <p>自动化工程师</p>
        <p>市场部</p>
        <p>李四</p>
        <p>
          <a href="#" class="blue">查看</a>
          <a href="#" class="blue">下载</a>
        </p>
        <p>
          <a href="#" class="blue">98分</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          imgUrl: require("@/assets/images/desktop/banner/banner1.png")
        },
        {
          imgUrl: require("@/assets/images/desktop/banner/banner2.png")
        },
        {
          imgUrl: require("@/assets/images/desktop/banner/banner3.png")
        },
        {
          imgUrl: require("@/assets/images/desktop/banner/image2.png")
        },
        {
          imgUrl: require("@/assets/images/desktop/banner/image4.png")
        }
      ]
    };
  },
  methods: {

  },
  mounted() {
    
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: 320px;
  .bannercarousel {
    background-color: #ccc;
    height: 320px;
    float: left;
    width: 70%;
  }
  .bannermycard {
    float: left;
    width: 30%;
  }
}

.block {
  width: 70%;
  height: 320px;
  float: left;
  .bannerimg {
    width: 100%;
    height: 100%;
  }
}
.block /deep/ ul li {
  padding: 12px 0px;
  width: 30px;
  button {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin: 0 auto;
    background-color: #fff;
    opacity: 1;
  }
}
.block /deep/ ul li.is-active button {
  width: 30px;
  background-color: #e61a23;
}

.mycard {
  position: relative;
  background: url("../../../../../assets/images/mycard/mycardbg.png") no-repeat;
  background-size: 100% 100%;
  // background-size: cover;
  width: 30%;
  height: 320px;
  float: left;
  padding: 44px 30px 33px 70px;
  box-sizing: border-box;
.title {
  position: relative;
  .myname {
    height: 28px;
    display: inline-block;
    font-size: 28px;
    font-weight: 700;
    color: #57585a;
  }
  .edit {
    position: absolute;
    left: 185px;
    top: 0px;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-top: 8px;
    img {
      width: 100%;
    }
  }
}
}

.myinfo {
  // position: absolute;
  // right: 25px;
  // top: 18px;
  float: right;
  margin-top: -53px;
  width: 25%;
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    margin-bottom: 5px;
    // width: 55px;
    height: 85px;
  }
  p {
    margin: 5px 0 0 0px;
    font-size: 14px;
    text-align: center;
    color: #96989b;
  }
}
.mydetail {
  position: absolute;
  top: 100px;
  left: 70px;
  // display: inline-block;
  width: 23%;
  color: #757679;
  font-weight: 550;
  font-size: 18px;
  p {
    margin: 0 0 20px 0;
  }
}
.myproject {
  position: absolute;
  top: 100px;
  left: 40%;
  // display: inline-block;
  width: 33%;
  color: #96989b;
  font-size: 18px;
  p {
    margin: 0 0 20px 0;
  }
  a {
    color: #2d96ff;
    text-decoration: underline !important;
  }
}
</style>