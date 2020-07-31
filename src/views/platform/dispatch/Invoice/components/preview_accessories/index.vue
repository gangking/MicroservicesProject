<template>
  <fsscContainerFrame :tagVal="tagVal"/>
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