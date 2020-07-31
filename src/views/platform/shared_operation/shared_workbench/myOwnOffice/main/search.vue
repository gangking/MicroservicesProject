<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="单据编号">
        <el-input v-model="formInline.docNumber" placeholder="单据编号"></el-input>
      </el-form-item>
      <el-form-item label="业务场景编码">
        <!-- <el-input v-model="formInline.busScenario" placeholder="业务场景编码"></el-input> -->
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
      <el-form-item label="发起人">
        <el-input v-model="formInline.applicant" placeholder="发起人"></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker @input="debounce(formInline.dateSubmit,false)" v-model="formInline.dateSubmit" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理时间">
        <el-date-picker @input="debounce(formInline.dataPool,true)" v-model="formInline.dataPool" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
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
        applicant: '',
        dateSubmit: ['', ''],
        dataPool: ['', ''],
        bsaList: []
      },
      innerVisible: false,
      timmer: null
      // bsaDataList:[]
    };
  },
  methods: {
    // 防抖
    debounce(val, flag) {
      if (val != null) {
        return;
      }
      this.$nextTick(() => {
        var now = !this.timmer;
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.timmer = null;
        }, 1000);
        if (now) {
          console.log('处理时间发生变化: 为Null', flag);
          if (flag) {
            this.formInline.dataPool = ['', ''];
            console.log('处理时间发生变化: 为Null2', flag, this.formInline);
          } else {
            this.formInline.dateSubmit = ['', ''];
          }
        }
      });
    },
    onSubmit() {
      console.log('submit!');
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
    }
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
      &:last-child {
        // position: absolute;
        // right: 15px;
        // bottom: -5px;
        // padding-left: 10px;
      }
    }
    .el-form-item__label {
      width: 110px;
      overflow: hidden;
      text-align: center;
      text-align: right;
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