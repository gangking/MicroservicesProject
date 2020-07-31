<template>
  <div  class="sany-message" >
    <ul class="statisticsList" :model="listData">
      <li class="statisticsItemTwo" style="list-style-type: none;width:20%">
        <label style="color: rgb(255, 255, 255); font-size: 12px; font-family: 黑体;">
          金额总计
          <span class="valDivision">:</span>
        </label>
        <br class="huanhang" />
        <span
          style="color: rgb(75, 158, 254); font-size: 12px; font-family: 黑体;padding-right:4px;"
        >{{listData.sumAmountCurrency?listData.sumAmountCurrency : ''}}&nbsp;{{ listData.sumAmount}}</span>
        <span class="division">|</span>
      </li>
      <li class="statisticsItemTwo" style="list-style-type: none;width:50%">
        <label style="color: rgb(255, 255, 255); font-size: 12px; font-family: 黑体;">
          借方合计
          <span class="valDivision">:</span>
        </label>
        <br class="huanhang" />
        <span
          style="color: rgb(75, 158, 254); font-size: 12px; font-family: 黑体;padding-right:4px;"
        >{{listData.debtorCurrency?listData.debtorCurrency : ''}}&nbsp;{{ listData.debtorTotal | fomartAmount}}</span>
        <span class="division">|</span>
      </li>
      <li class="statisticsItemTwo" style="list-style-type: none;margin-left:35px">
        <label style="color: rgb(255, 255, 255); font-size: 12px; font-family: 黑体;">
          贷方合计
          <span class="valDivision">:</span>
        </label>
        <br class="huanhang" />
        <span style="color: #1FCE66; font-size: 12px; font-family: 黑体;padding-right:4px;">{{listData.lenderCurrenty?listData.lenderCurrenty : ''}}&nbsp;{{ listData.lenderTotal | fomartAmount}}</span>
        <span class="division">|</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
    name: 'total-info',
    filters: {
        fomartAmount(value) {
            if (value) {
                var reg = /\d{1,3}(?=(\d{3})+\.)/g
                return (parseFloat(value).toFixed(2) + '').replace(reg, '$&,')
            }
            return '0.00'
        }
    },
    data() {
        return {
          //  listData:{}
        }
    },
    props:{
        totalInfo: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed:{
      listData(){
        return this.totalInfo
      }
    },
    //  watch: {
    //   totalInfo (val) {
    //     console.log(`val=====ttt====`,val);
    //   }
    // },
    // methods:{
    //   getList(){
    //          var data = {
    //             sumAmount:"叁仟元整",
    //             sumAmountCurrency:"人民币",
    //             debtorTotal:3000,
    //             debtorCurrency:"CNY",
    //             lenderTotal:-3000,
    //             lenderCurrenty:"CNY"
    //         }
    //       this.listData = data

    //   }
    // }
  
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
    width: 100%;
    margin-top:7px;
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
        color: black !important;
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
    .left-margin{
        margin-left:160px;
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
        color: black !important;
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
