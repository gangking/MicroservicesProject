<template>
  <div flex-box="1" class="banner">
    <div class="block">
      <el-carousel height="3.2rem" :autoplay="true">
        <el-carousel-item v-for="(item,index) in options" :key="index">
          <a href="#">
            <img :src="item.imgUrl" class="bannerimg" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="mycard">
      <div class="title">
        <span class="myname">您好, {{ name }}</span>
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
        <p>{{ job }}</p>
        <p>{{ bm }}</p>
        <p>{{ leader }}</p>
        <p>
          <a href="#" class="blue" >查看</a>
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
import { rem } from '@/assets/js/rem.js'
export default {
  data() {
    return {
      name:'',
      job:'',
      bm:'',
      leader:'',
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
    remmeth(){
      rem()
    },
    getInfo(){
      this.axios.get('https://www.easy-mock.com/mock/5d6dd6b5b531da21d111bf54/test/test').then(res=>{
       // console.log(res);  
        this.name=res.data.data.name
        this.job=res.data.data.zw
        this.leader=res.data.data.ld
        this.bm=res.data.data.bm

      }).catch()
    }
  },
  created() {
    this.getInfo()
  },
};
</script>

<style lang="scss" scoped>
.banner{
  height: 3.2rem;
}
.block {
  width: 73%;
  height: 3.2rem;
  float: left;
  .bannerimg {
    width: 100%;
    height: 100%;
  }
}
.block /deep/ ul li {
  padding: 0.12rem 0px;
  width: 0.3rem;
  button {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 0.05rem;
    margin: 0 auto;
    background-color: #fff;
    opacity: 1;
  }
}
.block /deep/ ul li.is-active button {
  width: 0.3rem;
  background-color: #e61a23;
}

.mycard {
  position: relative;
  background: url("../../../../../assets/images/mycard/mycardbg.png") no-repeat;
  background-size: 100% 100%;
  // background-size: cover;
  width: 27%;
  height: 3.2rem;
  float: left;
  padding: 0.44rem 0.3rem 0.33rem 0.7rem;
  box-sizing: border-box;
.title {
  position: relative;
  height: 0.5rem;
  .myname {
    position: absolute;
    top: 0rem;
    left: -0.0rem;
    height: 0.28rem;
    display: inline-block;
    font-size: 0.28rem;
    font-weight: 700;
    color: #57585a;
  }
  .edit {
    position: absolute;
    left: 1.85rem;
    top: 0px;
    display: inline-block;
    width: 0.16rem;
    height: 0.16rem;
    margin-top: 0.08rem;
    img {
      position: absolute;
      width: 100%;
    }
  }
}
}

.myinfo {
  position: absolute;
  right: 0.25rem;
  top: 0.12rem;
  width: 25%;
  height: 1.35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    margin-bottom: 0.05rem;
    // width: 55px;
    height: 0.85rem;
  }
  p {
    margin: 0.05rem 0 0 0px;
    font-size: 0.14rem;
    text-align: center;
    color: #96989b;
  }
}
.mydetail {
  position: absolute;
  top: 1rem;
  left: 0.7rem;
  // display: inline-block;
  width: 23%;
  color: #757679;
  font-weight: 550;
  font-size: 0.18rem;
  p {
    margin: 0 0 0.2rem 0;
  }
}
.myproject {
  position: absolute;
  top: 1rem;
  left: 40%;
  // display: inline-block;
  width: 33%;
  color: #96989b;
  font-size: 0.16rem;
  p {
    margin: 0 0 0.2rem 0;
  }
  a {
    color: #2d96ff;
    text-decoration: underline !important;
  }
}
</style>