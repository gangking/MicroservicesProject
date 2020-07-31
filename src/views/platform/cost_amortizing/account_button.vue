<template>
  <div class="accBtnBox">
    <el-button
      type="primary"
      plain
      size="mini"
      class="accbtn"
      icon="iconfont icon-uniE24D"
      @click="getAccInfo()"
    >
      <span>生成台账</span>
    </el-button>
  </div>
</template>

<script>
import request from "@/utils/request";
import { COMP_URL } from "@/api/baseUrl";
export default {
  data() {
    return {
      docNumber: ""
    };
  },
  methods: {
    getAccInfo() {
      console.log("docNumber", this.docNumber);
      return request({
        url:
          COMP_URL + `/scene/v3/outstandingaccount/create?docNumber=${this.docNumber}`,
        method: "get"
      })
        .then(res => {
          if (res.state == 200) {
            this.$message.success("新增成功!");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },
  props: {
    docNum: {
      type: String,
      default: ""
    }
  },
  watch: {
    docNum: {
      handler: function(val, oldVal) {
        this.docNumber = val;
      },
      immediate: true
    }
  },
  mounted() {
    console.log("docNum", this.docNum);
  }
};
</script>

<style lang="scss" scoped>
.accBtnBox {
  display: inline-block;
  .accbtn {
    font-size: 12px !important;
    padding: 4px;
    width: 80px;
    height: 24px;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    span {
      height: 13px;
      padding-left: 4px;
    }
  }
}
</style>