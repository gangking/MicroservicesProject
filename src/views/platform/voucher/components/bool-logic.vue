<template>
  <div class="logicbox">
    <slot name="title"></slot>
    <div class="content">
      <div class="listBox">
        <ul class="btnlist">
          <li v-for="(item,index) in symboList"
              :key="index">
            <el-button type="primary"
                       size="small"
                       @click="btnClick(item)"
                       v-if="item.key!='null'">{{item.name}}</el-button>
            <el-button v-else
                       type="primary"
                       size="small"
                       @click="btnClick(item)">NULL</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bool-logic',
  data () {
    return {
      symboList: [
        {
          "id": "1",
          "key": "quandeng",
          "name": "==",
          "type": "btn"
        }, {
          "id": "17",
          "key": "等于",
          "name": '=',
          "type": "btn"
        }, {
          "id": "2",
          "key": "budeng",
          "name": "!=",
          "type": "btn"
        }, {
          "id": "3",
          "key": "dayu",
          "name": ">",
          "type": "btn"
        }, {
          "id": "4",
          "key": "dayudengyu",
          "name": ">=",
          "type": "btn"
        }, {
          "id": "5",
          "key": "xiaoyu",
          "name": "<",
          "type": "btn"
        }, {
          "id": "6",
          "key": "xiaoyudengyu",
          "name": "<=",
          "type": "btn"
        },
        {
          "id": "7",
          "key": "yu",
          "name": "&&",
          "type": "btn"
        }, {
          "id": "8",
          "key": "huo",
          "name": "||",
          "type": "btn"
        }, {
          "id": "9",
          "key": "fei",
          "name": "!",
          "type": "btn"
        }, {
          "id": "10",
          "key": "zuokuo",
          "name": "(",
          "type": "btn"
        }, {
          "id": "11",
          "key": "youkuo",
          "name": ")",
          "type": "btn"
        }, {
          "id": "12",
          "key": "add",
          "name": "+",
          "type": "btn"
        }, {
          "id": "13",
          "key": "sub",
          "name": "-",
          "type": "btn"
        }, {
          "id": "14",
          "key": "cheng",
          "name": "*",
          "type": "btn"
        }, {
          "id": "15",
          "key": "chu",
          "name": "/",
          "type": "btn"
        },  {
          "id": "18",
          "key": "SUM",
          "name": "SUM",
          "type": "btn"
        },{
          "id": "21",
          "key": "null",
          "name": '""',
          "type": "btn"
        }, {
          "id": "19",
          "key": "zuofang",
          "name": "[",
          "type": "btn"
        }, {
          "id": "20",
          "key": "youfang",
          "name": "]",
          "type": "btn"
        }
      ],
      funcList: [
        {
          "id": "2",
          "key": "num",
          "name": "数字常量",
          "type": "const",
          "value": "",
          "placeholder": "请先输入数字"
        },
        {
          "id": "3",
          "key": "txt",
          "name": "文本常量",
          "type": "const",
          "value": "",
          "placeholder": "请先输入文本"
        }
      ]
    }
  },
  methods: {
    defineInput (dom) {
      this.$nextTick(() => {
        var btnDom = document.getElementById(dom.key);
        btnDom.click();
        setTimeout(() => {
          dom.value = '';
        }, 10)

      })
    },
    btnClick (info) {
      localStorage.setItem('codeEdit', 'func')
      if (info.type == 'func' || info.type == 'const') {
        // console.log('常量信息', info)
        switch (info.name) {
          case 'SUM()':
            // 只能以数字开头和结尾，中间用逗号隔开
            var re1 = /[0-9]\,[0-9]/;
            this.checkFuncValue(info, re1);
            break;
          case '数字常量':
            // 只能输入数字
            var re1 = /^[0-9]+$/;
            this.checkConstValue(info, re1, '只能输入数字');
            break;
          case '文本常量':
            // 只能输入中英文数字
            var re1 = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
            this.checkConstValue(info, re1, '只能输入中英文');
            break;
        }
      } else {
        this.$emit('getSlectLogic', info)
      }
    },
    checkConstValue (info, rel, tip) {
      if (info.value) {
        if (rel.test(info.value)) {
          var item = JSON.parse(JSON.stringify(info));
          if (info.key == 'num') {
            item.name = info.value;
          } else {
            item.name = '"' + info.value + '"';
          }
          this.$emit('getSlectLogic', item);
        } else {
          this.$message.error(tip);
        }
      } else {
        this.$message.error('请输入常量值');
      }
    },
    checkFuncValue (info, rel) {
      if (info.value) {
        if (rel.test(info.value)) {
          var item = JSON.parse(JSON.stringify(info));
          item.name = item.name.substr(0, 4) + info.value + ')';
          this.$emit('getSlectLogic', item);
        } else {
          this.$message.error('只能以数字开头和结尾，中间用逗号隔开');
        }
      } else {
        this.$message.error('请输入常量值');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logicbox {
  height: 100%;
  .content {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .btnlist {
    margin: 0;
    padding: 0;
    width: 100%;
    li {
      float: left;
      margin: 10px;
      /deep/ .el-button--small {
        width: 30px;
        padding: 5px 0px;
        font-size: 9px;
      }
    }
  }
}
</style>