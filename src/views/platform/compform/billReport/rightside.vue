<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="费用" name="first">
      <div class="head">
        <div class="fylx">
          <p>费用类型</p>
          <el-select v-model="value" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p>费用发生地</p>
          <el-select v-model="value1" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            </el-select>
          <p>审批金额</p>
          <el-input v-model="input" placeholder="1,500.00"></el-input>
        </div>

        <div class="jyrq">
          <p>交易日期</p>
          <el-input v-model="input" placeholder="2019-06-03"></el-input>
          <p>付款类型</p>
          <el-select v-model="value2" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p>发票状态</p>
          <el-select v-model="value3" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="fyms">
          <p>费用描述</p>
          <el-input v-model="input" placeholder="公交大巴费用"></el-input>
          <p>金额</p>
          <div>
            <el-input placeholder="请输入金额" v-model="input" class="input-with-select srje"></el-input>
            <el-select v-model="value4" placeholder="请选择" class="bai xuanze">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
          <el-checkbox v-model="checked">个人付费(不报销)</el-checkbox>
        </div>

        <div class="gys">
          <p>请输入供应商名称</p>
          <el-input v-model="input"></el-input>
          <p>VAT 金额(CNY)</p>
          <el-input v-model="input" placeholder="0.00"></el-input>
        </div>
      </div>

      <div class="line"></div>

      <div class="foot">
        <div class="xmid">
          <p>项目ID</p>
          <el-input v-model="input" placeholder="(SCJASDI123989)BG3)"></el-input>
          <p>员工工号(列表)</p>
          <el-select v-model="value5" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p>发票号</p>
          <el-input v-model="input" placeholder="(SCJASDI123989)BG3)"></el-input>
        </div>
        <div class="ccc">
          <p>CCC</p>
          <el-input v-model="input" placeholder="(73846123989)BG3)"></el-input>
          <el-checkbox v-model="checked1">客户付费</el-checkbox>
          <p>发票代码</p>
          <el-input v-model="input"></el-input>
        </div>
        <div class="fyxz">
          <p>费用性质</p>
          <el-input v-model="input" placeholder="(73846123989)BG3)"></el-input>

          <p>申请</p>
          <el-select v-model="value6" placeholder="请选择" class="bai">
            <el-option
              v-for="item in options6"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="flst">
          <p>法律实体</p>
          <el-input v-model="input" placeholder="深圳文思海辉"></el-input>
        </div>
      </div>
    </el-tab-pane>

    <el-tab-pane label="发票图像" name="second">
        <img src="./test.png" class="testimg">
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      checked: false,
      checked1: false,
      activeName: "first",
      options: [
        {
          value: "选项1",
          label: "差旅费_公交"
        },
        {
          value: "选项2",
          label: "餐费"
        },
        {
          value: "选项3",
          label: "住宿费"
        }
      ],
      options1: [
        {
          value: "选项1",
          label: "北京"
        },
        {
          value: "选项2",
          label: "上海"
        },
        {
          value: "选项3",
          label: "深圳"
        }
      ],options2: [
        {
          value: "选项1",
          label: "现金"
        },
        {
          value: "选项2",
          label: "支付宝"
        },
        {
          value: "选项3",
          label: "微信"
        }
      ],options3: [
        {
          value: "选项1",
          label: "机打发票"
        },
        {
          value: "选项2",
          label: "小额餐饮发票"
        },
        {
          value: "选项3",
          label: "手写发票"
        }
      ],options4: [
        {
          value: "选项1",
          label: "CNY"
        },
        {
          value: "选项2",
          label: "HKD"
        },
        {
          value: "选项3",
          label: "USD"
        }
      ],options5: [
        {
          value: "选项1",
          label: "张三"
        },
        {
          value: "选项2",
          label: "李四"
        },
        {
          value: "选项3",
          label: "王五"
        }
      ],options6: [
        {
          value: "选项1",
          label: "CNY"
        },
        {
          value: "选项2",
          label: "HKD"
        },
        {
          value: "选项3",
          label: "USD"
        }
      ],
      value: "",
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      input: "",
      select: ""
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
p{
  font-size: 14px;
  margin: 12px 0 5px 0;
}
.bai {
  width: 100%;
}
.fylx {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.jyrq {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.fyms {
  float: left;
  width: 22%;
  margin-right: 3%;
  .srje {
    float: left;
    width: 65%;
    margin-right: 2%;
  }
  .xuanze {
    float: left;
    width: 33%;
  }
}
.gys {
  float: left;
  width: 22%;
  margin-right: 3%;
}

.line {
  float: left;
  margin: 15px 0;
  width: 100%;
  height: 2px;
  background-color: skyblue;
}
.xmid {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.ccc {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.fyxz {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.flst {
  float: left;
  width: 22%;
  margin-right: 3%;
}
.testimg{
    width: 80%;
    margin-left: 10%;
}
</style>