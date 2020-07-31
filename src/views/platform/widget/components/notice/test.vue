<template>
  <div class="dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      style="height: 100%;"
      append-to-body
      top="63px"
      :modal="false"
      width="94%"
    >
      <div class="block">
        <span class="demonstration">选择日期</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
     
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.tableData);
  },
  updated() {
   // console.log(this.value1);
    //console.log(this.value2);
    
  },
  data() {
    return {
      tableData: this.msg,
      dialogTableVisible: false,
      formLabelWidth: "120px",
      value1: "",
      value2: ""
    };
  },
  methods: {
    handleClose() {
      // console.log("关闭");
      this.$emit("handleClose", false);
    }
  },
  props: {
    msg: Array,
    dialogVisible: Boolean
  }
};
</script>

<style lang="scss" scoped>
.block /deep/ ul li {
  padding: 3px 0;
  width: 20px;
  button {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin: 0 auto;
    background-color: #d1d2d4;
    opacity: 1;
  }
}
.block /deep/ ul li.is-active button {
  background-color: #4ba5ff;
}
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #e61a23;
}
.redblock_title {
  position: relative;
  top: -4px;
  left: -20px;
  > a {
    position: absolute;
    top: 4px;
    right: -20px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.block {
  position: relative;
  top: -10px;
  height: 650px;
}
#noticetitle {
  width: 200px;
  height: 25px;
  margin-top: 2px !important;
  margin-left: 20px !important;
  font-size: 18px;
  font-family: PingFang SC;
  margin-bottom: 12px;
}
.noticebox {
  position: relative;
  .newstitle {
    position: absolute;
    margin: 10px 0 0 0;
    font-size: 14px;
    font-weight: 500;
  }
  .newsdate {
    position: absolute;
    margin: 40px 0 0 0;
    font-size: 12px;
    img {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      vertical-align: top;
    }
    span {
      margin-right: 5px;
      color: #a1a2a5;
    }
  }
  .newsinfo {
    overflow: hidden;
    position: absolute;
    width: 100%;
    margin: 50px 0 0 0;
    font-size: 12px;
    line-height: 21px;
    // text-indent: 27px;
    letter-spacing: 1px;
    p {
      font-size: 12px;
      color: #a1a2a5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 20; /* 可以显示的行数，超出部分用...表示*/
      -webkit-box-orient: vertical;
    }
  }

  .el-carousel__button {
    width: 5px !important;
    height: 5px !important;
    border-radius: 50%;
    background-color: #2793ff !important;
    margin-left: 3px;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #fff !important;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #fff !important;
}
.el-carousel__indicators {
  width: 50px;
}
/deep/ .el-dialog__header {
  padding: 0 !important;
}
/deep/ .el-dialog {
  height: 91% !important;
  margin-left: 80px;
}
</style>