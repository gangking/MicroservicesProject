
<template>
  <div class="note-wraper" v-loading="loading" element-loading-text="加载中" id="note-wraper2">
    <!-- 工作台头部 -->
    <div class="note-header">
      <div class="note-header-name">
        <span v-if="hideInput" @click="toggleInput">{{desktopMynotes.name}}</span>
        <el-input v-else v-model="desktopMynotes.name" placeholder="请输入工作台名字"></el-input>
      </div>
      <div class="note-right">
        <!-- <div style="margin-right:15px;">
          <i class="el-icon-folder-add" style="cursor: pointer" @click="addTab(editableTabsValue)"></i>
        
        </div>-->
        <!-- <div style="margin-right:10px;">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addItem(editableTabsValue)"
          >添加项目</el-button>
        </div>
        <div style="margin-right:10px;">
          <el-button
            type="primary"
            icon="el-icon-folder-add"
            @click="addTab(editableTabsValue)"
          >新增一页</el-button>
        </div>
        <div style="margin-right:10px;">
          <el-button type="primary" @click="reviseName" icon="el-icon-edit-outline">修改页签名字</el-button>
        </div>-->
        <div style="margin-right:20px;">
          <el-tooltip class="item" effect="dark" content="修改页签名字" placement="bottom">
            <i class="el-icon-edit" style="cursor: pointer;font-size:20px;" @click="reviseName"></i>
          </el-tooltip>

          <!-- <el-button type="primary" @click="reviseName" icon="el-icon-edit-outline">修改页签名字</el-button> -->
        </div>
        <div class="node-save" style="margin-right:5px;">
          <el-button type="success" icon="el-icon-upload2" @click="saveData">保存</el-button>
        </div>
        <div class="node-exit">
          <el-button type="info" icon="icon-uniE1BD" @click="exit">退出</el-button>
        </div>
      </div>
    </div>
    <!-- tab页面主体 -->
    <div class="note-slide">
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" :tab-position="tabPosition" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in noteData" :key="item.name" :label="item.title" :name="item.name">
          <drag-slide :pageNum="index" :noteData="item.tabData" :slideWidth="slideWidth" :slideHeight="slideHeight" :style="{width:slideWidth,height:slideHeight}" @dragList="dragList" @add="add" @deleteId="deleteId"></drag-slide>
        </el-tab-pane>
      </el-tabs>
    </div>
    <menu-select :visible="dialogVisible" @close="visible => dialogVisible = visible" @selctData="selctData" />
    <note-name :noteNameDialog="noteNameDialog" :allData="noteData" @closeNote="visible1 => noteNameDialog = visible1" @changeTab="changeTab" />
  </div>
</template>

<script>
// import _throttle from "lodash/throttle";
import { saveNotes, getNotes } from '@/api/platform/desktop/notes';
import MenuSelect from '@/components/fssc-menu-select';
import NoteName from '@/views/platform/notes/components/note-name';
import DragSlide from './components/drag-slide';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'notes',
  components: {
    DragSlide,
    MenuSelect,
    NoteName
  },
  props: {},
  data() {
    return {
      hideInput: true, //头部名字的显示和隐藏
      loading: true,
      tabPosition: 'bottom', //tab标签位置
      desktopMynotes: {
        createBy: null,
        createTime: null,
        dataStatus: null,
        dbtype: null,
        designHtml: 'fssc',
        id: '',
        ip: null,
        layoutId: null,
        name: '工作台',
        pk: '',
        sysAlias: 'fssc',
        templateHtml: '',
        tenantId: null,
        updateBy: null,
        updateTime: null,
        userId: this.$store.getters.userId
      },
      dialogVisible: false, // 选择菜单显示隐藏。
      noteNameDialog: false, // 修改名字dialog显示隐藏
      noteArray: [[{ name: 'add' }]],
      noteData: [
        {
          title: '标签页1',
          name: '1',
          tabName: 'tab1',
          tabData: []
        }
      ],
      selectIndex: 0,
      editableTabsValue: '1', //当前激活的tab name
      tabIndex: 1,
      activeTab: 0,
      closable: false, //选择
      slideWidth: '', //轮播图宽度
      slideHeight: '', // 轮播图高度
      maxPageNum: '' //每一个slide可容纳的数量
    };
  },
  watch: {
    activeTab() {
      //console.log(this.activeTab);
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
    //轮播图的宽度
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
    noteData: {
      handler(n) {
        //  console.log(n);
      },
      deep: true
    }
  },
  computed: {
    pageNum(index) {
      return `当前第${index + 1}页`;
    },
    ...mapState('ibps/menu', {
      asideShow: state => state.asideShow,
      toggleSlide: state => state.toggleSlide
    }),
    ...mapState('ibps/page', {
      menuAllData: state => state.menuAllData
    })
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.slideHeight =
    //     document.querySelector("#note-wraper2").clientHeight - 100 + "px";
    // });
    // setTimeout(() => {
    //   this.calculateHeight();
    // }, 1000);
    window.addEventListener('resize', () => {
      this.throttle(this.calculateHeight, 100);
    });

    this.getData();
  },
  methods: {
    // 删除某一项
    deleteId(pageNum, swiper, id) {
      this.noteData[pageNum].tabData[swiper].forEach((item, index) => {
        if (item.id == id) {
          console.log(index);
          this.noteData[pageNum].tabData[swiper].splice(index, 1);
        }
      });
    },
    // 添加工作台项目
    add(index, swiper) {
      this.addItem(this.editableTabsValue);
    },
    ...mapMutations('ibps/page', ['menuTabDele', 'menuAllDataDele']),

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
    /* 拖动排序位置  动态改变主数据  */
    dragList(data, index, swiperIndex) {
      this.noteData[index].tabData[swiperIndex].splice(0);
      data.forEach(i => {
        this.noteData[index].tabData[swiperIndex].push(i);
      });
    },
    /* 计算每一个的个数 分配每个slide个数 */
    calculateSlideNum(width, height) {
      const rowNumber = Math.floor((width - 60) / 120);
      const columnNumber = Math.floor((height - 20) / 120);
      this.maxPageNum = rowNumber * columnNumber - 1;
    },

    // 计算swiper高度宽度
    calculateHeight() {
      var element = document.querySelector('#note-wraper2');
      if (element) {
        this.slideWidth = element.clientWidth + 'px';
        this.slideHeight = element.clientHeight - 100 + 'px';
        //this.slideHeight = element.clientHeight - 400 + "px";
      }
    },
    //点击修改tab名字 弹窗
    reviseName() {
      this.noteNameDialog = true;
    },
    // 修改好的名字
    changeTab(obj) {
      for (let key in obj) {
        this.noteData.forEach((note, index) => {
          if (note.tabName == key) {
            this.$set(this.noteData[index], 'title', obj[key]);
          }
        });
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
    //官网api属性
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.addTab(targetName);
      }
      if (action === 'remove') {
        this.removeTab(targetName);
      }
    },
    /* 添加新的一页 */
    addTab(targetName) {
      this.noteArray = [[{ name: 'add' }]];
      let mathNum = parseInt(Math.random() * 1000000);
      //  console.log(mathNum);
      let newTabName = this.tabIndex + mathNum + '';
      console.log(newTabName);
      this.noteData.push({
        title: '新页签' + ++this.tabIndex,
        name: newTabName,
        tabName: 'tab' + newTabName,
        content: 'New Tab content',
        tabData: this.noteArray
      });
      this.editableTabsValue = newTabName;
      let indexNew = this.tabIndex;
      console.log(this.noteData);
    },
    /* 删除tab页面 */
    removeTab(targetName) {
      if (this.noteData.length == 1) {
        this.$message({
          showClose: true,
          message: '工作台至少要保留一个',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作将删除此页签下的所有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // tabs页面的所有的id
          let removeData = this.noteData.filter(e => e.name === targetName);
          console.log(removeData);
          this.menuTabDele(removeData);
          //前端删除tab页
          let tabs = this.noteData;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.noteData = tabs.filter(tab => tab.name !== targetName);
          console.log(this.noteData);
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    /* 添加项目 弹窗*/
    addItem(targetName) {
      this.dialogVisible = true;
    },
    /* menu-tree 选择的数据 */
    selctData(selectData) {
      let activeTab = this.getTabIndex(this.editableTabsValue);
      let onedDimension = selectData.concat(...this.noteData[activeTab].tabData);
      let newSplice = this.againGroup(onedDimension, this.maxPageNum);
      this.noteData[activeTab].tabData.splice(0);
      newSplice.forEach((eArr, i) => {
        this.noteData[activeTab].tabData.push([]);
        eArr.forEach(e => {
          this.noteData[activeTab].tabData[i].push(e);
        });
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
      this.noteData.forEach((element, index) => {
        this.onedDimension = [].concat(...element.tabData);
        //console.log(this.onedDimension);
        this.noteData[index].tabData.splice(0);
        let newSplice = this.againGroup(this.onedDimension, this.maxPageNum);
        //console.log(newSplice);
        newSplice.forEach((eArr, i) => {
          this.noteData[index].tabData.push([]);
          eArr.forEach(e => {
            this.noteData[index].tabData[i].push(e);
          });
        });
      });
    },
    /* 保存全部数据 到后台*/
    saveData() {
      this.closable = false;
      this.desktopMynotes.templateHtml = JSON.stringify(this.noteData);
      saveNotes(this.desktopMynotes).then(response => {
        this.$alert('保存成功');
        this.$router.replace('/refresh');
      });
    },
    // 获取工作台数据
    getData() {
      getNotes(this.$store.getters.userId)
        .then(response => {
          console.info(response);
          if (response.data.dataResult.length > 0) {
            this.noteData = JSON.parse(response.data.dataResult[0].templateHtml);
            this.menuAllDataDele(this.noteData);
            // console.log(this.noteData);
            this.noteData.forEach((item, index) => {
              if (item.tabData.length == 0) {
                this.noteData[index].tabData.push([{ name: 'add' }]);
              }
            });
            //  console.log(this.tabData);
            this.desktopMynotes.name = response.data.dataResult[0].name;
            this.editableTabsValue = this.noteData[0].name;
          } else {
            this.noteData = [
              {
                title: '标签页1',
                name: '1',
                tabName: 'tab1',
                tabData: [[{ name: 'add' }]]
              }
            ];
            this.desktopMynotes.name = '工作台';
          }

          this.calculateHeight();
          this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toggleInput() {
      this.hideInput = !this.hideInput;
    },
    exit() {
      this.$router.push({ path: '/home' });
    }
  }
};
</script>

<style scoped lang="scss">
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
      font-size: 20px;
      padding-left: 10px;
      font-weight: bold;
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
        margin-right: 10px;
      }
      .node-exit {
        margin-right: 10px;
      }
    }
  }
  .note-slide {
    // position: absolute;
    // left: 0;
    // bottom: 0;
  }
}
.node-exit /deep/ .el-button {
  display: flex;
  justify-content: center;
  align-items: center;
  > i {
    font-size: 12px;
    margin-right: 3px;
  }
}

.note-slide /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  color: rgb(117, 171, 221);
  border-bottom: 4px solid rgb(117, 171, 221);
  box-sizing: border-box;
}
// .note-slide /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
//   transition: color 0s;
// }
// .note-slide /deep/ .el-tabs__nav .el-tabs__item:nth-child(1) span {
//   display: none;
// }
.note-slide /deep/.el-tabs__new-tab {
  margin-right: 5px;
}
</style>
