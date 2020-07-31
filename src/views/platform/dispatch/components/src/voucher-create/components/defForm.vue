<template>
    <div class="contairebox">
        <!-- <sany-message
            slot="footer"
            :data="messageData"
        /> -->
       <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="行项目">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="会计中心">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="利润中心">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="借方金额">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="贷方金额">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>

            <!-- <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item> -->
        </el-form>
    </div>
</template>

<script>
// import SanyMessage from './message'
  export default {
    name:'contaire-box',
    components:{
    //    SanyMessage
    }, 
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        formDefList: {
          type: Array,
          default: () => []
        },
        formConList: {
          type: Array,
          default: () => []
        },
      }
    },
    computed: {
        // messageData() {
        //     return this.data.message_data
        // }
    },
    methods: {
    //   onSubmit() {
    //     console.log('submit!');
    //   }
    

    }
}
</script>

<style lang="scss" scoped>
    .contairebox{
        padding:10px
    }
</style>