<template>
  <div class="box">
    <div class="content">
      <div class="main">
        <label>业务场景：</label>
        <div class="selectBox">
          <!-- 默认区 -->
          <div v-if="!selectValue" class="default">
            <span>+</span> 请选择业务场景
          </div>
          <!-- 赋值区 -->
          <ul v-if="selectValue" class="scenario">
            <li class="scenarioItem">{{ selectValue.name }}</li>
          </ul>
          <!-- 按钮区 -->
          <div class="btnlist" v-if="!this.ruleStrategyProvide.id">
            <span @click="openDialog">重选</span>
          </div>
        </div>
      </div>
    </div>
    <scenario-dialog :dialog-table-visible="dialogTableVisible" :data-list="scenarioList" @dialogVisible="dialogVisible" @getScenario="getScenario" />
  </div>
</template>

<script>
import scenarioDialog from './scenario-dialog';
import effectApi from '@/api/platform/effectiveness/index.js';
import rulesApi from '@/api/platform/rules/index.js';
export default {
  name: 'business-scenario',
  components: {
    scenarioDialog
  },
  inject: ['ruleStrategyProvide'],
  data() {
    return {
      selectValue: '',
      dialogTableVisible: false,
      scenarioList: []
    };
  },
  props: {
    comType: {
      type: String,
      default: ''
    }
  },
  created() {
    this.onload();
  },
  methods: {
    onload() {
      console.log('父组件的业务场景值', this.ruleStrategyProvide.id);
      if (this.comType == '有效性检查') {
        effectApi
          .bsBasicQueryAll({})
          .then(res => {
            var data = res.data;
            if (this.ruleStrategyProvide.id) {
              res.data.forEach(item => {
                if (item.bizKey == this.ruleStrategyProvide.id) {
                  this.selectValue = item;
                  this.$emit('getSelectScenario', this.selectValue);
                  this.scenarioList = data;
                }
              });
            } else {
              // 默认选择第一项
              this.selectValue = data[0];
              this.$emit('getSelectScenario', this.selectValue);
              this.scenarioList = data;
            }
          })
          .catch(req => {
            console.log('获取业务场景失败');
          });
      } else {
        rulesApi
          .bsBasicQueryAll({})
          .then(res => {
            var data = res.data;
            if (this.ruleStrategyProvide.id) {
              res.data.forEach(item => {
                if (item.bizKey == this.ruleStrategyProvide.id) {
                  this.selectValue = item;
                  this.$emit('getSelectScenario', this.selectValue);
                  this.scenarioList = data;
                }
              });
            } else {
              // 默认选择第一项
              this.selectValue = data[0];
              this.$emit('getSelectScenario', this.selectValue);
              this.scenarioList = data;
            }
          })
          .catch(req => {
            console.log('获取业务场景失败');
          });
      }
    },
    openDialog() {
      this.dialogTableVisible = true;
    },
    dialogVisible(flag) {
      this.dialogTableVisible = flag;
    },
    // 获取业务场景
    getScenario(val) {
      console.log('获取到的业务场景', val);
      this.selectValue = val[0];
      this.$emit('getSelectScenario', this.selectValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  .content {
    // height: calc(100% - 41px);
    height: 100%;
    // background: yellow;
    position: relative;
    .main {
      // display: flex;
      // position: absolute;
      // top: 50%;
      // transform: translateY(-50%);
      width: 100%;
      // flex-wrap: wrap;
      padding: 0 12px 0 12px;
      box-sizing: border-box;
      label {
        text-align: right;
        vertical-align: middle;
        // float: left;
        font-size: 12px;
        color: #606266;
        line-height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .selectBox {
        display: block;
        padding: 0;
        margin: 0;
        background: #fff;
        width: 100%;
        height: 32px;
        line-height: 30px;
        min-height: 32px;
        max-height: 40px;
        border: dashed 1px #ccc;
        overflow: auto;
        // cursor: pointer;
        overflow: hidden;
        border-radius: 4px;
        &:hover {
          .btnlist {
            display: block;
          }
        }
        .scenario {
          margin: 0;
          padding: 0;
          // padding: 2px;
          .scenarioItem {
            float: left;
            position: relative;
            top: 2px;
            left: 2px;
            border-radius: 4px;
            padding: 0 5px;
            font-size: 12px;
            background-color: #ecf5ff;
            border-color: #d9ecff;
            color: #409eff;
          }
        }
        .default {
          color: #c0c4cc;
          height: 100%;
          padding: 2px 0 0 10px;
          box-sizing: border-box;
        }
        .btnlist {
          float: right;
          margin-right: 10px;
          color: #f56c6c;
          display: none;
          cursor: pointer;
          span {
            &:first-child {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
