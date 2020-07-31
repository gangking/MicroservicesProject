<template>
  <div class="main" v-loading="loading">
    <div class="title">
      <div class="number">
        当前共有资产
        <span>{{totalCount}}</span> 个
      </div>
    </div>
    <div class="list">
      <div v-if="tableData.length>0">
        <div class="list-item" v-for="(list,index) in tableData" :key="index">
          <div class="left">
            <div class="icon">
              <i class="iconfont" :class="getIcon(list.ANLKL)"></i>
            </div>
            <div class="detail">
              <div class="top">{{list.TXT50}}</div>
              <div class="bottom">
                <span>{{list.ANLN1}} 丨数量：{{list.MENGE}}</span>
              </div>
            </div>
          </div>
          <div class="address">
            <!-- <i class="iconfont icon-yewuleixing"></i> -->
            <img src="@/assets/images/mycard/adress.png" />
            {{list.CFMS}}
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <div>暂无数据</div>
      </div>
      <!-- <div class="list-item">
        <div class="left">
          <div class="icon">
            <i class="iconfont icon-biaodanguanli-erji"></i>
          </div>
          <div class="detail">
            <div class="top">显示器</div>
            <div class="bottom">
              <span>10600522 丨数量：1</span>
            </div>
          </div>
        </div>
        <div class="address">
          <i class="iconfont icon-yewuleixing"></i>新研发大楼
        </div>
      </div>-->
    </div>
    <div class="footer" ref="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="slot, prev, pager, next"
        :total="totalCount"
      >
        <span class="pageNumber">共 {{pageNumber}} 页</span>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getGrmxzc, getUserNo } from "@/api/platform/assets/assets";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      userid: this.$store.getters.userId,
      userNo: "",
      tableData: [],
      loading: false,
      pageNumber: 1,
      currentPage: 1, //当前页
      pageSize: 10, // 每页多少条
      totalCount: 0 //总数
    };
  },
  computed: {
    tableResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.getHeight();
        });
      }, 150);
    }
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.tableResize);
    this.getUser();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    //获取表格数据
    getTable(limit = 10, pageno = 1) {
      this.loading = true;
      getGrmxzc({
        userNo: this.userNo,
        limit: this.pageSize,
        page: this.currentPage
      }).then(response => {
        this.loading = false;
        this.totalCount = response.cause == "0" ? 0 : parseInt(response.cause);
        this.pageNumber =
          this.totalCount == "0"
            ? 1
            : Math.ceil(this.totalCount / this.pageSize);
        this.tableData = response.data;
      });
    },
    getUser() {
      this.loading = true;
      getUserNo({ subPid: this.userid }).then(result => {
        this.userNo = result.data.userId;
        getGrmxzc({
          userNo: this.userNo,
          limit: this.pageSize,
          page: this.currentPage
        }).then(response => {
          this.loading = false;
          // console.log(response, "资产信息");
          this.totalCount =
            response.cause == "0" ? 0 : parseInt(response.cause);
          this.pageNumber =
            this.totalCount == "0"
              ? 1
              : Math.ceil(this.totalCount / this.pageSize);
          this.tableData = response.data;
        });
      });
    },
    getIcon(type) {
      let iconList = {
        "00002000": "icon-jianzhuwu",
        "00006300": "icon-yingzhuangzhichu",
        "00006000": "icon-dianzishebei",
        "00007100": "icon-gongzhuangmoju",
        "00006200": "icon-jijianfushuwu",
        "00001000": "icon-fangwu",
        "00004000": "icon-yunshushebei",
        "00003000": "icon-tudi",
        "00005000": "icon-jiqishebei",
        "00007000": "con-jingyingzulinzuchushebei"
      };
      return iconList[type];
    },
    getHeight() {
      //   let clientHeight =
      //     document.documentElement.clientHeight || document.body.clientHeight;
      //   this.height =
      //     clientHeight * 0.9 -
      //     this.$refs.title.clientHeight -
      //     this.$refs.footer.clientHeight -
      //     70;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTable();
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.tableResize);
  }
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    height: 40px;
    .number {
      margin-left: 5px;
      > span {
        color: #0a36ef;
      }
    }
  }
  .list {
    height: calc(100% - 80px);
    padding: 10px 15px;
    overflow: auto;

    .empty {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      > div {
        text-align: center;
      }
    }
    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
      color: #666;
      margin-bottom: 13px;
      font-size: 12px;
      .left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 5px;
        .icon {
          margin-right: 15px;
          > i {
            font-size: 35px;
            color: #1296db;
          }
        }
        .detail {
          color: #333;
          .top {
            padding-bottom: 5px;
            font-weight: bold;
          }
        }
      }
      .address {
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 20px;
          height: 20px;
          margin-right: 3px;
        }
        > i {
          color: red;
          font-size: 20px;
        }
      }
    }
  }
  .footer {
    /deep/.el-pagination {
      text-align: center;
    }
    .pageNumber {
      margin-right: 10px;
      font-weight: 400;
      color: #606266;
    }
  }
}
</style>
