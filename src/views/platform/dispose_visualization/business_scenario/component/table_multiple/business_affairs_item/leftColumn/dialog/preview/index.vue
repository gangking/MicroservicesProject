<template>
  <div class="sany-message">
    <div class="box" v-if="formLabelAlign.singleOrWrong=='singleRow'">
      <div class="singleStyle" v-if="formLabelAlign.valShow=='descLeft'">
        <div class="singleItem" v-for="(item,index) in statisticsList" :key="index">
          <span class="desc">{{item.label.name}}</span>
          <span class="valueSeparator">{{formLabelAlign.valSeparator}}</span>
          <span class="currency">{{item.currency}}</span>
          <span class="value">{{item.script | fomartAmount}}</span>
          <span class="fontSeparator" v-if="index != (statisticsList.length-1)">{{formLabelAlign.fontSeparator}}</span>
        </div>
      </div>
      <div class="singleStyle" v-else-if="formLabelAlign.valShow=='valLeft'">
        <div class="singleItem" v-for="(item,index) in statisticsList" :key="index">
          <span class="currency">{{item.currency}}</span>
          <span class="value">{{item.script | fomartAmount}}</span>
          <span class="valueSeparator">{{formLabelAlign.valSeparator}}</span>
          <span class="desc">{{item.label.name}}</span>
          <span class="fontSeparator" v-if="index != (statisticsList.length-1)">{{formLabelAlign.fontSeparator}}</span>
        </div>
      </div>
    </div>
    <div class="box" v-else-if="formLabelAlign.singleOrWrong=='topRow'">
      <div class="wrongLine">
        <div class="singleItem" :style="{
            marginRight:formLabelAlign.columnSpac+'px'
        }" v-for="(item,index) in statisticsList" :key="index">
          <span class="desc" :style="{
              marginBottom:formLabelAlign.rowSpac+'px'
          }">{{item.label.name}}</span>
          <div class="vaue">
            <span class="currency">{{item.currency}}</span>
            <span class="value">{{item.script | fomartAmount}}</span>
          </div>
        </div>
      </div>
    </div>

    <!--
       单行:
       1、描述在左；
       2、描述在右；
       3、描述与分隔符;
       4、字段之间分隔符;
       5、其他：字体、字号、字体颜色、描述文字位置（居左、居中、居右）;
     -->
    <!-- <div class="singleStyle">
      <div class="singleItem">
        <label>待分摊总额</label>
        <span>:</span>
        <span>RMB</span>
        <span>3,000.00</span>
      </div>
      <div class="singleItem">
        
      </div>
    </div> -->

    <!--
       错行:
       1、行间距；
       2、列间距；
       3、其他：字体、字号、字体颜色、描述文字位置（居左、居中、居右）;
    -->

  </div>
</template>

<script>
export default {
  name: 'sany-message',
  filters: {
    fomartAmount(value) {
      if (value) {
        var reg = /\d{1,3}(?=(\d{3})+\.)/g;
        return (parseFloat(value).toFixed(2) + '').replace(reg, '$&,');
      }
      return '0.00';
    }
  },
  props: {
    dialogPreview: {
      type: Boolean,
      default: false
    },
    formLabelAlign: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    dialogPreview: {
      handler(val) {
        if (val) {
          console.log('接收排版设置', this.formLabelAlign);
          // 模拟预览字段列表数据
          this.previewStyleList = require('./test.json').data;
          this.formLabelAlign = this.formLabelAlign;
        }
      },
      immediate: true
    }
  },
  computed: {
    // 改造字段列表
    statisticsList() {
      if (!this.previewStyleList) {
        return [];
      }
      var list = this.previewStyleList.fieldList;
      if (!list) {
        return [];
      }
      const sf = [];
      for (var i = 0; i < list.length; i++) {
        var item = { ...list[i] };
        item.label = JSON.parse(item.label);
        item.value = JSON.parse(item.value);
        item.script = item.script;
        sf.push(item);
      }
      return sf;
    }
  },
  data() {
    return {
      previewStyleList: []
    };
  },
  computed: {
    statisticsList() {
      if (!this.previewStyleList) {
        return [];
      }
      var list = this.previewStyleList.fieldList;
      if (!list) {
        return [];
      }
      const sf = [];
      for (var i = 0; i < list.length; i++) {
        var item = { ...list[i] };
        item.label = JSON.parse(item.label);
        item.value = JSON.parse(item.value);
        item.script = item.script;
        sf.push(item);
      }
      return sf;
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.sany-message {
  width: 100%;
  //   height: 500px;
  position: relative;
  overflow-x: auto;
  box-sizing: border-box;
  .wrongLine,
  .singleStyle {
    width: 100%;
    overflow: auto;
    height: 90px;
    box-sizing: border-box;
  }
  // 单行
  .singleStyle {
    white-space: nowrap;
    .singleItem {
      font-family: '黑体';
      font-weight: bold;
      padding: 5px;
      position: relative;
      display: inline-block;
      > span {
        float: left;
      }
      .desc {
        color: black;
        font-size: 14px;
      }
      .valueSeparator {
        color: black;
        font-size: 14px;
        margin-right: 5px;
      }
      .currency {
        color: rgb(52, 152, 216);
        font-size: 14px;
        margin-right: 5px;
      }
      .value {
        color: rgb(52, 152, 216);
        font-size: 14px;
      }
      .fontSeparator {
        position: absolute;
        top: 5px;
        right: -4.5px;
        color: black;
      }
    }
  }
  // 错行
  .wrongLine {
    display: flex;
    .singleItem {
      font-family: '黑体';
      font-weight: bold;
      min-width: 100px;
      .desc {
        display: inline-block;
        width: 100%;
        color: black;
        font-size: 14px;
      }
      .valueSeparator {
        color: black;
        font-size: 14px;
      }
      .currency {
        color: rgb(52, 152, 216);
        font-size: 14px;
      }
      .value {
        color: rgb(52, 152, 216);
        font-size: 14px;
      }
    }
  }
}
</style>
