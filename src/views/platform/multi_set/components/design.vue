<template>
  <ibps-container
    ref="dashboardContainer"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :scroll-delay="scrollDelay"
    type="full"
    @scroll="({x, y}) => { scrollTop = y }"
  >
    <desktop-layout
      :data="layoutData"
      :page="page"
      :ectypal="layoutData"
      :empty-text="emptyText"
  
      @change="changeLayout"
    />
  </ibps-container>
</template>

<script>
import DesktopLayout from './layout'
export default {
  props:{
    layoutData:{
      type:Array
    },
    page:{
      type:Number
    }
  },
  components: {
    DesktopLayout
  },
  watch: {
    layoutData:{
      handler(n,o){
        console.log(this.layoutData);
      },
      immediate:true
    }
  },
  // directives: {
  //   focus: {
  //     // 指令的定义
  //     inserted: function (el) {
  //       el.focus()
  //     }
  //   }
  // },
  data() {
    return {
      emptyText: '请点击上方添加栏目，否则则按默认布局设置您的首页。',
      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      layout: [],
      ectypal: [],
      addColumnVisible: false,
      
      defaultForm: {},
      desktopMyLayout: {
        id: '',
        sysAlias: '',
        templateHtml: ''
      }
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.desktopMyLayout))
  },
  methods: {
    changeLayout(data) {
      this.layout = data
    },
    handerReset() {
      this.loadData()
    },
    handerRestoreDefault() {
      const id = this.desktopMyLayout.id
      remove({
        desktopMyLayoutIds: id
      }).then(response => {
        this.$alert('删除成功')
        this.layout = []
      }).catch(() => {
      })
    },
    handerSave() {
      const systemAlias = this.$store.getters.system ? this.$store.getters.system.alias : ''
      this.desktopMyLayout.sysAlias = systemAlias
      this.desktopMyLayout.templateHtml = JSON.stringify(this.layout)
      this.desktopMyLayout.designHtml = 'ibps'
      save(this.desktopMyLayout).then(response => {
        this.$alert('保存成功')
        this.$router.replace('/refresh')
      }).catch(() => {
      })
    }
  }
}
</script>
