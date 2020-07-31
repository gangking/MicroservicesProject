<template>
  <div class="tabsBox">
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tablist"
                   :key="index"
                   :label="item.label"
                   :name="item.name" />
    </el-tabs>
    <div class="content">
      <div class="rule"
           v-if="activeName != 'EnhanceScript'">
        <div class="msgbox">
          <div class="top">
            <ul>
              <li>
                <div class="topLabel">
                  消息类型
                </div>
                <el-select v-model="formInline.msgType.default"
                           placeholder="消息类型"
                           :disabled="!isEditable">
                  <el-option v-for="(item,index) in formInline.msgType.typeList"
                             :key="index"
                             :label="item"
                             :value="item"></el-option>
                </el-select>
              </li>
              <li>
                <div class="topLabel">
                  消息类别
                </div>
                <el-select v-model="formInline.msgCategory.default"
                           placeholder="消息类别"
                           @change="categoryListActive"
                           :disabled="!isEditable">
                  <el-option v-for="(item,index) in formInline.msgCategory.categoryList"
                             :key="index"
                             :label="item.stext"
                             :value="item.msgid"></el-option>
                </el-select>
              </li>
              <li>
                <div class="topLabel">
                  消息编号
                </div>
                <el-select v-model="formInline.msgCode.default"
                           placeholder="消息编号"
                           @change="codeListActive"
                           :disabled="!isEditable">
                  <el-option v-for="(item,index) in formInline.msgCode.codeList"
                             :key="index"
                             :label="'消息'+item.msgno"
                             :value="item.msgno"></el-option>
                </el-select>
              </li>
            </ul>
            <div class="msgtxt">
              <div class="topLabel">消息文本</div>
              <el-input v-model="formInline.msgtxt"
                        placeholder="请选择消息文本"
                        :disabled="true"></el-input>
            </div>
            <ul>
              <li class="msgVar">
                <div class="topLabel">
                  消息变量1
                </div>
                <el-select v-model="formInline.msgVar1.default"
                           placeholder="消息变量"
                           @focus="msgVarClick(1)"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           :disabled="!isEditable"
                           @change="defalutUpdate(1)">
                  <el-option v-for="(item,index) in formInline.msgVar1.list"
                             :key="index"
                             :label="item.name"
                             :value="item.key"></el-option>
                </el-select>
              </li>
              <li class="msgVar">
                <div class="topLabel">
                  消息变量2
                </div>
                <el-select v-model="formInline.msgVar2.default"
                           placeholder="消息变量"
                           @focus="msgVarClick(2)"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           :disabled="!isEditable"
                           @change="defalutUpdate(2)">
                  <el-option v-for="(item,index) in formInline.msgVar2.list"
                             :key="index"
                             :label="item.name"
                             :value="item.key"></el-option>
                </el-select>
              </li>
              <li class="msgVar">
                <div class="topLabel">
                  消息变量3
                </div>
                <el-select v-model="formInline.msgVar3.default"
                           placeholder="消息变量"
                           @focus="msgVarClick(3)"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           :disabled="!isEditable"
                           @change="defalutUpdate(3)">
                  <el-option v-for="(item,index) in formInline.msgVar3.list"
                             :key="index"
                             :label="item.name"
                             :value="item.key"></el-option>
                </el-select>
              </li>
              <li class="msgVar">
                <div class="topLabel">
                  消息变量4
                </div>
                <el-select v-model="formInline.msgVar4.default"
                           placeholder="消息变量"
                           @focus="msgVarClick(4)"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           :disabled="!isEditable"
                           @change="defalutUpdate(4)">
                  <el-option v-for="(item,index) in formInline.msgVar4.list"
                             :key="index"
                             :label="item.name"
                             :value="item.key"></el-option>
                </el-select>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        增强脚本
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'
import effectApi from '@/api/platform/effectiveness/index.js';
export default {
  name: 'tabs-panel',
  components: {
    codemirror
  },
  props: {
    form: {
      type: Object,
      default () {
        return {}
      }
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    blurFormFlag: {
      type: String,
      default: ''
    },
    msgVarList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      activeName: JSON.parse(JSON.stringify(this.form.tabs[0].name)),
      tablist: this.form.tabs,
      formInline: {
        // 消息类型
        msgType: {
          default: '',
          typeList: ['X', 'E', 'S', 'I', 'W']
        },
        // 消息类别
        msgCategory: {
          default: '',
          categoryList: []
        },
        // 消息编号
        msgCode: {
          default: '',
          codeList: []
        },
        msgtxt: '',// 消息文本
        // 消息变量
        msgVar1: {
          default: '',
          list: []
        },
        msgVar2: {
          default: '',
          list: []
        },
        msgVar3: {
          default: '',
          list: []
        },
        msgVar4: {
          default: '',
          list: []
        }
      },
      focusBox: null
    };
  },
  watch: {
    // 监听值的变化
    formInline: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.formInline = newVal;
        this.$emit('getNewMsgData', newVal);
        console.log('formInline消息区域所有值变化', newVal)
      }
    },
    'form.formInfo': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getData(newVal)
      }
    },
    // 监听目前焦点变化
    blurFormFlag (val) {
      if (val != 'formDataTwo' && val != 'formDataOne') {
        console.log('当前焦点不在规则那边', val);
      } else {
        this.focusBox = null; // 焦点的不在消息区域了
      }
    },
    // 监听业务对象点击情况
    msgVarList (val) {
      console.log('当前消息获取焦点，业务对象被点击', val)
      if (this.focusBox) {
        switch (this.focusBox) {
          case 1:
            if (this.formInline.msgVar1.list.length < 1) {
              this.formInline.msgVar1.list = val;
              this.formInline.msgVar1.default = val;
            }
            break;
          case 2:
            if (this.formInline.msgVar2.list.length < 1) {
              this.formInline.msgVar2.list = val;
              this.formInline.msgVar2.default = val;
            }

            break;
          case 3:
            if (this.formInline.msgVar3.list.length < 1) {
              this.formInline.msgVar3.list = val;
              this.formInline.msgVar3.default = val;
            }

            break;
          case 4:
            if (this.formInline.msgVar4.list.length < 1) {
              this.formInline.msgVar4.list = val;
              this.formInline.msgVar4.default = val;
            }

            break;
        }
      }
    },
    setDefault (list, num) {

    }
  },
  created () {
    this.getMsgType();
  },
  methods: {
    //   监听值改变
    defalutUpdate (index) {
      console.log('监听值改变', index)
      switch (index) {
        case 1:
          if (this.formInline.msgVar1.default.length == 0) {
            this.formInline.msgVar1.list = [];
          }
          break;
        case 2:
          if (this.formInline.msgVar2.default.length == 0) {
            this.formInline.msgVar2.list = [];
          }
          break;
        case 3:
          if (this.formInline.msgVar3.default.length == 0) {
            this.formInline.msgVar3.list = [];
          }
          break;
        case 4:
          if (this.formInline.msgVar4.default.length == 0) {
            this.formInline.msgVar4.list = [];
          }
          break;
      }
    },
    //   消息变量焦点获取
    msgVarClick (num) {
      this.focusBox = num;// 记录当前是下拉框获取焦点
      this.$emit('thisBlur', '消息变量')
    },
    //   查询消息类型列表
    getMsgType () {
      effectApi.findAllForMsgClass().then((res) => {
        console.log('获取消息类型列表', res)
        this.formInline.msgCategory.categoryList = res.data
      }).catch((req) => {
        console.log('调接口失败')
      })
    },
    // 选择消息类别
    categoryListActive (info) {
      console.log('选中的消息类别', info)
      if (info) {
        var id = info;
        this.getMsgTxtList(id);
      }
    },
    // 选择消息文本
    codeListActive (id) {
      //   this.formInline.msgtxt = txt;
      if (this.formInline.msgCode.codeList.length > 0) {
        for (var i = 0; i < this.formInline.msgCode.codeList.length; i++) {
          var item = this.formInline.msgCode.codeList[i];
          if (id == item.msgno) {
            this.formInline.msgtxt = item.msgtx;
          }
        }
      }

    },
    // 查询有效消息类型对应的消息文本列表
    getMsgTxtList (id,num) {
      effectApi.findAllByMsgId({
        msgId: id
      }).then((res) => {
        console.log('获取消息文本列表', res,num)
        this.formInline.msgCode.codeList = res.data;
        if (num) {
            var form = JSON.parse(JSON.stringify(this.formInline))
            for(var i = 0; i < res.data.length; i++) {
                var item = res.data[i];
                console.log('比较',item.msgno,num,item.msgno == num)
                if (item.msgno == num) {
                    form.msgCode.default = item.msgno;
                    form.msgtxt = item.msgtx;
                }
            }
        } else {
            form.msgCode.default = res.data[0].msgno;
            form.msgtxt = res.data[0].msgtx;
        }
        this.formInline = form;
      }).catch((req) => {
        console.log('调接口失败')
      })
    },
    getData (val) {
      // 设置消息变量
      console.log('获取到所选步骤信息', val)
      this.formInline.msgVar1.list = val.msg1 ? JSON.parse(val.msgobj1) : [];
      this.formInline.msgVar1.default = val.msg1 ? JSON.parse(val.msgobj1) : '';

      this.formInline.msgVar2.list = val.msg2 ? JSON.parse(val.msgobj2) : [];
      this.formInline.msgVar2.default = val.msg2 ? JSON.parse(val.msgobj2) : '';

      this.formInline.msgVar3.list = val.msg3 ? JSON.parse(val.msgobj3) : [];
      this.formInline.msgVar3.default = val.msg3 ? JSON.parse(val.msgobj3) : '';

      this.formInline.msgVar4.list = val.msg4 ? JSON.parse(val.msgobj4) : [];
      this.formInline.msgVar4.default = val.msg4 ? JSON.parse(val.msgobj4) : '';

      // 设置文本
      // this.formInline.msgVar1.msgtxt = val.msg1;

      // 设置消息类型、类别，编码
      this.formInline.msgType.default = val.msgType;
      this.formInline.msgCategory.default = val.msgSort;
      // 当消息类别有值时，查询并设置消息文本
      if (val.msgSort) {
        this.getMsgTxtList(val.msgSort,val.msgNumber);
      }
      //   this.formInline.msgCode.default = val.msgNumber;
    },
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style lang="scss" scoped>
.tabsBox {
  height: 100%;
  .content {
    height: calc(100% - 40px);
    padding: 10px 18px;
    box-sizing: border-box;
    .rule {
      height: 100%;
    }
    .msgbox {
      .top {
        > ul {
          margin: 0;
          padding: 0;
          overflow: hidden;
          margin-bottom: 2px;
          > li {
            float: left;
            width: 120px;
            margin-right: 20px;
            > div {
              // text-align: center;
              margin-bottom: 3px;
            }
          }
        }
        .topLabel {
          font-size: 12px;
        }
        .msgVar {
          /deep/ .el-select__tags {
            max-width: none !important;
            .el-input__inner{
                padding: 0 10px;
            }
          }
          /deep/ .el-input__suffix {
            display: none;
          }
        }
        .msgtxt {
          margin-bottom: 3px;
          > div {
            margin-bottom: 3px;
          }
        }
      }
    }
  }
}
/deep/ .el-tabs__item {
    height: 30px;
    line-height: 30px;
}
/deep/ .el-tabs__nav {
  margin-left: 20px;
}
/deep/ .el-tabs__active-bar {
  height: 4px;
  padding: 0 10px;
  left: -10px;
}
/deep/ .el-tabs__header {
  margin: 0;
}
</style>