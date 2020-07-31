<template>
  <div class="searchbox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
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
      <el-form-item label="发起人">
        <el-input v-model="formInline.username " placeholder="发起人"></el-input>
      </el-form-item>
      <el-form-item label="提交日期">
        <el-date-picker v-model="formInline.dateSubmit" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入池日期">
        <el-date-picker v-model="formInline.dataPool" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="formInline.taskType" placeholder="任务类型">
          <el-option label="请选择" value=""></el-option>
          <el-option label="共享任务" value="deliver"></el-option>
          <el-option label="稽核任务" value="audit"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属一级组">
        <el-select @change="activeOneLevel" v-model="formInline.oneLevelGroup" placeholder="所属一级组">
          <el-option v-for="(item) in groupOneList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属二级组">
        <el-select @change="activeTwoLevel" v-model="formInline.twoLevelGroup" placeholder="所属二级组">
          <el-option v-for="(item) in groupTwoList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属三级组">
        <el-select v-model="formInline.threeLevelGroup" placeholder="所属三级组">
          <el-option v-for="(item) in groupThreeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属派单池">
        <el-select @change="activePool" v-model="formInline.sharePoolId" placeholder="请选择所属派单池">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="(item) in twoAuditPoolNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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

import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
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
        dateSubmit: ['', ''],
        dataPool: ['', ''],
        status: '',
        bsaList: [],
        taskType: '',
        sharePoolId: '',
        sharePoolName: '',
        oneLevelGroup: '',
        twoLevelGroup: '',
        threeLevelGroup: ''
      },
      twoAuditPoolNameList: [],
      groupOneList: [], // 一级组数组
      groupTwoList: [], // 二级组数组
      groupThreeList: [], // 三级组数组
      innerVisible: false
    };
  },
  created() {
    this.sharedPollList({
      parameters: [
        { key: 'Q^share_pool^SL', value: 'Y' },
        { key: 'Q^org_group_id^SL', value: '' }
      ],
      requestPage: {
        pageNo: 1,
        limit: 100000,
        totalCount: 6
      },
      sorts: []
    }).then(res => {
      console.log('共享池列表', res);
      this.twoAuditPoolNameList = res.dataResult;
      this.searchGroupLevel('', 1);
    });
  },
  methods: {
    ...mapActions(['sharedPollList', 'busGroupList']),
    // 查询所属一级、二级、三级组
    // busGroupList
    searchGroupLevel(id, level) {
      var list = [];
      this.busGroupList({
        parameters: [
          { key: 'Q^parent_id^SL', value: id || '' },
          { key: 'Q^level^SL', value: level },
          { key: 'Q^status^SL', value: 'actived' }
        ],
        requestPage: {
          pageNo: 1,
          limit: 100000
        },
        sorts: []
      }).then(res => {
        console.log('业务组列表', res);
        list = res.dataResult;
        switch (level) {
          case 1:
            // this.formInline.oneLevelGroup = list.length > 0 ? list[0].id : '';
            this.groupOneList = list;
            break;
          case 2:
            this.formInline.twoLevelGroup = list.length > 0 ? list[0].id : '';
            this.groupTwoList = list;
            // 当查询二级组时，清空三级数组
            this.formInline.threeLevelGroup = '';
            this.threeLevelGroup = [];
            break;
          case 3:
            this.formInline.threeLevelGroup =  list.length > 0 ? list[0].id : '';
            this.threeLevelGroup = list;
            break;
        }
        // 查询
        this.onSubmit();
      });
    },
    activeOneLevel(val) {
      console.log('选择一级所属组，查二级所属组', val);
      this.searchGroupLevel(val, 2);
    },
    activeTwoLevel(val) {
      console.log('选择二级所属组，查三级所属组', val);
      this.searchGroupLevel(val, 3);
    },
    activePool(id) {
      var flag = false;
      this.twoAuditPoolNameList.forEach(item => {
        if (item.id == id) {
          flag = true;
          this.formInline.sharePoolName = item.name;
        }
      });
      if (!flag) {
        this.formInline.sharePoolName = '';
      }
    },
    onSubmit() {
      console.log('submit!');
      console.log('查询参数', this.formInline);
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
      for (var i = 0; i < arry.length; i++) {
        if (info.bsaKey == arry[i].bsaKey) {
          arry.splice(i, 1);
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