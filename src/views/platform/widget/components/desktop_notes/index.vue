
<template>
  <div class="note-wraper el-card is-always-shadow" id="note-wraper">
    <!-- 工作台头部 -->
    <div class="header">
      <div class="header-tip"></div>
      <div class="header-name">{{headerName}}</div>

      <div class="editNote" @click="handelNote">
        <img src="@/assets/images/desktop/note/edit.png" />
        <span></span>
      </div>

      <div class="fullscreen">
        <img @click="fullHandler" src="@/assets/images/desktop/amplification.png" />
      </div>
    </div>

    <!-- tab页面主体 -->
    <div class="note-slide">
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        :tab-position="tabPosition"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in noteData"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <drag-slide
            :pageNum="index"
            :noteData="item.tabData"
            :slideWidth="slideWidth"
            :slideHeight="slideHeight"
            :style="{width:slideWidth,height:slideHeight}"
          ></drag-slide>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 全屏 -->
    <note-full :visible.sync="hidden" alias="full_notes" />
  </div>
</template>

<script>
import json from "./demoJson";
import { getNotes } from "@/api/platform/desktop/notes";
import noteFull from "./components/preview";
import DragSlide from "./components/drag-slide";
import { mapMutations, mapState } from "vuex";
export default {
  name: "notes",
  components: {
    DragSlide,
    noteFull
  },
  props: {
    layoutChange: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hidden: false, // 全局组件是否显示
      tabPosition: "bottom", //tab标签位置
      noteData: [],
      selectIndex: 0,
      editableTabsValue: "", //当前激活的tab name
      tabIndex: 1,
      activeTab: 0,
      closable: false, //选择
      slideWidth: "", //轮播图宽度
      slideHeight: "", // 轮播图高度
      maxPageNum: "", //每一个slide可容纳的数量
      headerName: "工作台"
    };
  },
  watch: {
    // $route: {
    //   handler: function(val, oldVal) {
    //     console.log(999);
    //     setTimeout(() => {
    //       this.allSideRefresh();
    //     });
    //   },
    //   // 深度观察监听
    //   deep: true
    // },
    layoutChange: {
      handler(n) {
        // console.log(n)
        this.calculateHeight();
      },
      immediate: true
    },
    //轮播图的宽度
    slideWidth: {
      handler(n) {
        let width = parseInt(this.slideWidth);
        let height = parseInt(this.slideHeight);
        this.calculateSlideNum(width, height);
        this.allSideRefresh();
      }
    },
    slideHeight: {
      handler(n) {
        let width = parseInt(this.slideWidth);
        let height = parseInt(this.slideHeight);
        this.calculateSlideNum(width, height);
        this.allSideRefresh();
      }
    },
    /* 侧边栏 */
    asideShow(n, o) {
      setTimeout(() => {
        this.calculateHeight();
      }, 500);
    },
    toggleSlide(n, o) {
      setTimeout(() => {
        this.calculateHeight();
      }, 500);
    },
    noteData() {
      // console.log(this.noteData);
    }
  },
  computed: {
    ...mapState("ibps/menu", {
      asideShow: state => state.asideShow,
      toggleSlide: state => state.toggleSlide
    })
  },
  mounted() {
    // this.noteData = json;
    // this.$nextTick(() => {
    //   this.slideHeight =
    //     document.querySelector(".note-wraper").clientHeight - 107 + "px";
    // });
    // setTimeout(() => {
    //   this.calculateHeight();
    //   let width = parseInt(this.slideWidth);
    //   let height = parseInt(this.slideHeight);
    //   this.calculateSlideNum(width, height);
    //   this.allSideRefresh();
    // }, 1000);
    window.addEventListener("resize", () => {
      this.throttle(this.calculateHeight, 300);
    });
    this.getData();
  },
  methods: {
    getData() {
      getNotes(this.$store.getters.userId)
        .then(response => {
          console.info(response);
          if (response.data.dataResult.length > 0) {
            let listData = JSON.parse(response.data.dataResult[0].templateHtml);
            this.headerName = response.data.dataResult[0].name;
            this.noteData = this.filterAdd(listData);
            this.editableTabsValue = this.noteData[0].name;
          } else {
            this.noteData = [
              {
                title: "标签页1",
                name: "1",
                tabName: "tab1",
                tabData: []
              }
            ];
            this.headerName = "工作台";
          }
          this.calculateHeight();
          let width = parseInt(this.slideWidth);
          let height = parseInt(this.slideHeight);
          this.calculateSlideNum(width, height);
          this.allSideRefresh();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 函数节流 throttle
    throttle(func, delay) {
      if (func.timeId) return;
      var that = this;
      func.timeId = setTimeout(function() {
        func.call(that);
        clearTimeout(func.timeId);
        func.timeId = null;
      }, delay);
    },
    /* 计算每一个的个数 分配每个slide个数 */
    calculateSlideNum(width, height) {
      const rowNumber = Math.floor((width - 60) / 120);
      const columnNumber = Math.floor((height - 20) / 120);
      //  console.log( this.slideWidth)
      // console.log(rowNumber,columnNumber)
      this.maxPageNum = rowNumber * columnNumber;
    },

    // 计算swiper高度宽度
    calculateHeight() {
      var element = document.querySelector("#note-wraper");
      if (element) {
        this.slideWidth = element.clientWidth + "px";
        this.slideHeight = element.clientHeight - 100 + "px";
        // console.log(element.clientHeight);
        // console.log(this.slideHeight);
      }
    },

    // tabs的点击事件
    handleClick(tab, event) {
      this.editableTabsValue = tab.name;
      this.allSideRefresh();
    },
    /* 获取当前tabs所在的索引 */
    getTabIndex(name) {
      return this.noteData.findIndex((item, index) => {
        return item.name == name;
      });
    },
    /* 数组按个数重新划分新的数组 */
    againGroup(data, num) {
      let result = [];
      for (let i = 0, len = data.length; i < len; i += num) {
        result.push(data.slice(i, i + num));
      }
      return result;
    },
    /* 重新分配数据 分页 */
    allSideRefresh(select) {
      // console.log(this.maxPageNum);
      let newData = this.noteData;
      newData.forEach((element, index) => {
        this.onedDimension = [].concat(...element.tabData);

        newData[index].tabData.splice(0);
        let newSplice = this.againGroup(this.onedDimension, this.maxPageNum);
        //console.log(newSplice);
        newSplice.forEach((eArr, i) => {
          newData[index].tabData.push([]);
          eArr.forEach(e => {
            newData[index].tabData[i].push(e);
          });
        });
      });

      this.noteData = newData;
    },

    // 提交保存数据
    saveData() {
      save({ name: "cun" })
        .then(response => {
         // console.log(response);
        })
        .catch(err => {
          console.info(err);
        });
    },
    // 全屏事件
    fullHandler() {
      this.hidden = true;
    },
    // 跳转工作台编辑区
    handelNote() {
      this.$router.push({ path: "/myApps" });
    },
    //过滤多余的add
    filterAdd(data) {
      let copyData = JSON.parse(JSON.stringify(data));
      console.log(data);
      data.forEach((dataPage, page) => {
        dataPage["tabData"].forEach((dataArray, i) => {
          dataArray.forEach((item, index) => {
            if (item.name == "add") {
              copyData[page]["tabData"][i].splice(index, 1);
            }
          });
        });
      });

      return copyData;
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  display: flex;
  align-items: center;
  .header-tip {
    width: 5px;
    height: 17px;
    background-color: #e61a23;
  }
  .header-name {
    margin-left: 15px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    margin-right: 15px;
  }
  .fullscreen {
    margin-left: auto;
    margin-right: 20px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .editNote {
    margin-left: 5px;
    margin-top: 3px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFang SC;
    cursor: pointer;
    img {
      margin-right: 5px;
    }
  }
}

.note-wraper {
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  height: 100%;
  background: #fff;
  .note-header {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid rgba(97, 92, 97, 0.26);
    .note-header-name {
      font-size: 18px;
      padding-left: 10px;
    }
    .note-right {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 5px;
      .note-edit {
        display: flex;
        margin-right: 5px;
        width: 50px;
        height: 50px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        .note-icon {
          display: inline-block;
          color: rgb(209, 75, 22);
        }
        .text {
          margin-top: 3px;
          display: inline-block;
        }
      }
      .note-full {
        display: flex;
        width: 50px;
        height: 50px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        .note-icon {
          margin-top: 2px;
          display: inline-block;
          color: rgb(147, 162, 209);
        }
        .text {
          margin-top: 3px;
          display: inline-block;
        }
      }
      .note-save {
      }
    }
  }
  .note-slide {
    // position: absolute;
    // left: 0;
    // bottom: 0;
  }
}
.note-slide /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  color: rgb(117, 171, 221);
  border-bottom: 4px solid rgb(117, 171, 221);
  box-sizing: border-box;
}
.note-slide /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  transition: color 0.3s;
}
.note-slide /deep/ .el-tabs__nav .el-tabs__item:nth-child(1) span {
  display: none;
}
.note-slide /deep/ .el-tabs--bottom .el-tabs__header.is-bottom {
  margin-top: 0px;
}
.note-slide /deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
</style>
