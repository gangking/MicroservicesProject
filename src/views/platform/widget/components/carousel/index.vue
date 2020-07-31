<template>
  <div class="block">
      <el-carousel :autoplay="true" :interval="5000">
        <el-carousel-item v-for="(item,index) in options" :key="index">
          <a href="#">
            <img :src="item.imgUrl" class="bannerimg" />
          </a>
        </el-carousel-item>
      </el-carousel>
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
    }
  },
}
</script>
<style scoped lang="scss" scoped>
.block {
  // width: 73%;
  // height: 220px;
  height: 100%;
  .bannerimg {
    width: 100%;
    height: 100%;
    border-radius: 3px;
  }
  /deep/ .el-carousel--horizontal{
    height: 100%;
  }
  /deep/ .el-carousel__container{
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
</style>