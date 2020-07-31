<template>
  <fsscContainerFrame :tagVal="tagVal"/>
  <!-- <div>地址：{{this.tagVal}}</div> -->
</template>

<script>
import fsscContainerFrame from '../frame';
export default {
  props: {
    tagVal: {
      type: Object,
      default: ()=>{
          return {}
      }
    }
  },
  components: {
    fsscContainerFrame
  },
  created(){
      console.log('进入合同预览页面',this.tagVal)
  }
};
</script>