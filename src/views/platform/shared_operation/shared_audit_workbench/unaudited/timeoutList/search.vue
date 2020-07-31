<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="单据编号">
        <el-input v-model="formInline.docNumber" placeholder="单据编号"></el-input>
      </el-form-item>
      <el-form-item label="业务场景">
        <div class="bsaList">
            <div class="newSelect" @click="innerVisible=true">
              <el-tag @close="closeScenario(item)" v-for="item in formInline.bsaList" :key="item.bsaKey" closable :type="item.bsaKey">
                {{item.bsaName}}
              </el-tag>
            </div>
          </div>
      </el-form-item>
      <el-form-item label="公司代码">
        <el-input v-model="formInline.companyCode" placeholder="公司代码"></el-input>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model="formInline.username " placeholder="审核人"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    
    <el-dialog width="65%" title="选择业务场景" top="5vh" :visible.sync="innerVisible" append-to-body @close="userclose">
        <scenarioList :flag="innerVisible" @getBusScenario="getBusScenario" @userclose="userclose" />
      </el-dialog>
  </div>
</template>

<script>
import scenarioList from '@/views/platform/shared_operation/basicConfig/businessGroupSet/task_allocation/oneLevelSetup/scenario.vue';
export default {
  components: {
    scenarioList
  },
  data() {
    return {
      formInline: {
        docNumber: '',
        busScenario: '',
        companyCode: '',
        username: '',
        dispatchPoll: '',
        dateSubmit: ['',''],
        dataPool: ['',''],
        status: '',
        bsaList:[],
      },
      innerVisible:false,
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
      console.log('查询参数',this.formInline)
      this.$emit('searchForm', this.formInline);
    },
    // 获取弹窗选中的业务场景
    getBusScenario(list) {
      var arry = [];
      if (list.length == 1) {
        for (var i = 0; i < list.length; i++) {
        var item = list[i];
        arry.push({
          bsaKey: item.key,
          bsaName: item.describe
        });
      }
      // this.bsaDataList = arry;
      this.formInline.bsaList = arry;
      console.log('选择的业务场景', arry);
      this.userclose();
      } else {
        this.$message.error('目前仅支持单选');
      }
    },
    userclose() {
      this.innerVisible = false;
    },
    // 单个删除弹窗选中业务场景
    closeScenario(info) {
      var arry = JSON.parse(JSON.stringify(this.formInline.bsaList));
      // console.log('单个删除弹窗选中业务场景',info)
      for (var i = 0; i < arry.length; i++) {
        if (info.bsaKey == arry[i].bsaKey) {
          // a.slice(2,5)
          arry.splice(i, 1);
          // console.log('删除后的业务场景',arry);
        }
      }
      this.$set(this.formInline, 'bsaList', arry);
    },
  }
};
</script>

<style lang="scss" scoped>
.searchbox {
  width: 100%;
  // height: 125px;
  background: white;
  border-bottom: 1px solid #ccc;
  padding-top: 8px;
  box-sizing: border-box;
  /deep/ .el-form {
    height: 100%;
    line-height: 10px;
    box-sizing: border-box;
    position: relative;
    // padding-bottom: 30px;
    .el-form-item {
      margin-bottom: 10px;
      margin-right: 0px;
      
      .bsaList {
        .newSelect {
          width: 200px;
          height: 32px;
          overflow: auto;
          border: 1px dashed #ccc;
          border-radius: 4px;
         box-sizing: border-box;
        }
        .el-input__suffix {
          display: none;
        }
      }
      
    }
    .el-form-item__label {
      width: 82px;
      overflow: hidden;
      text-align: center;
    }
    .el-form-item__content {
      display: inline-block;
      line-height: 10px;
      .el-date-editor {
        width: 200px;
      }
      .el-input {
        width: 200px;
      }
      .el-select {
        width: 200px;
      }
    }
  }
}
</style>