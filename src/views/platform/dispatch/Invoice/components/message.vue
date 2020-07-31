<template>
  <div class="sany-message">
    <ul class="statisticsList">
      <!-- 定型左右数值渲染 -->
      <li
        v-for="(item,index) in statisticsList"
        :key="index"
        style="list-style-type:none"
        :class="cssName = division.lebelPosition!='top'?'statisticsItem':'statisticsItemTwo'"
      >
        <label
:style="{
          color: item.label.color,
          fontSize: item.label.fontSize+'px',
          fontFamily: item.label.fontFamily
        }"
>{{ item.label.name }}<span class="valDivision">{{ division.desGap }}</span></label>
        <br class="huanhang">
        <span
:style="{
          color: item.value.color,
          fontSize: item.value.fontSize+'px',
          fontFamily: item.value.fontFamily
        }"
>{{ item.currency?item.currency:'' }} {{ item.script | fomartAmount }}</span>
        <span class="division">{{ division.fieldGap }}</span>
      </li>

      <!-- 用来根据测试按钮测试样式的，别删除了 -->
      <!-- <li :class="cssName">
        <label>申请核销金额<span class="valDivision">:</span></label>
        <br class="huanhang" />
        <span>CNY 2000.00</span>
        <span class="division">|</span>
      </li>
      <li :class="cssName">
        <label>财务核销金额<span class="valDivision">:</span></label>
        <br class="huanhang" />
        <span>CNY 0.00</span>
        <span class="division">|</span>
      </li> -->

    </ul>
  </div>
</template>

<script>
export default {
    name: 'sany-message',
    filters: {
        fomartAmount(value) {
            if (value) {
                // console.log('fjsflkjdsfjsdflsf....', value)
                var reg = /\d{1,3}(?=(\d{3})+\.)/g
                return (parseFloat(value).toFixed(2) + '').replace(reg, '$&,')
            }
            return '0.00';
        }
    },
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            cssName: 'statisticsItem'
            // statisticsList: [],
            // division: {}
        }
    },
    computed: {
        statisticsList() {
            if (!this.data) {
                return []
            }
            var list = this.data.fieldList
            if (!list) {
                return []
            }
            //   console.log('统计金额数据', list)
            const sf = []
            for (var i = 0; i < list.length; i++) {
                var item = { ...list[i] }
                item.label = JSON.parse(item.label)
                item.value = JSON.parse(item.value)
                item.script = item.script
                sf.push(item)
            }
            return sf
        },
        division() {
            if (!this.data) {
                return {}
            }
            var obj = {
                desGap: this.data.desGap,
                fieldGap: this.data.fieldGap,
                lebelPosition: this.data.lebelPosition
            }
            return obj
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.testBtn {
    position: fixed;
    top: 200px;
    left: 100px;
}
.sany-message {
    height: 100%;
    position: relative;
    // overflow: auto;
    padding-right: 10px;
    .statisticsList {
        margin-top: 7px;
        // margin: 0;
        padding: 0;
        overflow: hidden;
        position: absolute;
        height: 100%;
        top: 0;
        right: 10px;
        line-height: 20px;
        list-style: none;
        display: flex;
        .statisticsItem {
            font-weight: bold;
            padding-right: 3px;
            float: left;
            white-space: nowrap;
            line-height: 42px;
            .huanhang {
                display: none;
            }
            label {
                color: black;
                font-size: 12px;
                white-space: nowrap;
                .valDivision {
                    color: black;
                }
            }
            span {
                color: #4b9efe;
                font-size: 12px;
                white-space: nowrap;
            }
            .division {
                color: black;
            }
        }
        .statisticsItemTwo {
            font-weight: bold;
            text-align: right;
            float: left;
            // background: red;
            margin-left: 20px;
            padding-top: 3px;
            box-sizing: border-box;
            .huanhang {
                display: block;
            }
            label {
                color: black;
                font-size: 12px;
                display: inline-block;
                white-space: nowrap;
                .valDivision {
                    display: none;
                }
            }
            span {
                color: #4b9efe;
                font-size: 12px;
                white-space: nowrap;
            }
            .division {
                color: black;
                display: none;
            }
        }
        .statisticsItem:last-child {
            padding: 0;
            .division {
                display: none;
            }
        }
    }
}
</style>
