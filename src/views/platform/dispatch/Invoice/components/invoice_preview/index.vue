<template>
  <div class="box">
    <div v-if="invoiceNumer=='043001900104' && !invoiceImgUrl" class="diabox img1"></div>
    <div v-else-if="invoiceNumer=='4300192130' && !invoiceImgUrl" class="diabox img2"></div>
    <div v-else-if="invoiceNumer=='143001916818' && !invoiceImgUrl" class="diabox img3"></div>
    <img v-if="invoiceImgUrl" :src="invoiceImgUrl" alt="">
  </div>
</template>

<script>
export default {
  name: 'invoice-preview',
  props: {
    tagVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      invoiceImgUrl: this.tagVal.invoiceImgUrl,
      invoiceNumer: this.tagVal.invoiceNumer
    };
  },
  created(){
      console.log('进入发票查看',this.tagVal)
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  img {
    display: inline-block;
    width: 70%;
    height: 70%;
  }
  .diabox {
    width: 100%;
    height: 100%;
  }
  .img1 {
    background: url('./invoiceTestImg/043001900104.jpg') no-repeat center center;
    background-size: contain;
  }
  .img2 {
    background: url('./invoiceTestImg/4300192130.jpg') no-repeat center center;
    background-size: contain;
  }
  .img3 {
    background: url('./invoiceTestImg/143001916818.jpg') no-repeat center center;
    background-size: contain;
  }
}
</style>