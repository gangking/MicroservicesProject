<template>
  <div class="tree-main">
    <el-tree
      :data="menuData"
      show-checkbox
      :default-expand-all="false"
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
    ></el-tree>

    <div class="buttons">
      <!-- <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
      <!-- <el-button @click="resetChecked">重置选择</el-button> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "menu-tree",
  props: {},
  computed: {
    ...mapState("ibps/menu", ["aside", "allSide", "asideCollapse"]),
    ...mapState("ibps/page", ["menuDele", "menuTabs", "menuAllData"])
  },
  watch: {
    menuDele: {
      handler(id) {
        if (id) {
          this.changeMenuStatus(id);
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      immediate: true
    },
    menuData: {
      handler(n) {
        console.log(n);
      },
      immediate: true,
      deep: true
    },
    menuAllData: {
      handler(n) {
        if (n) {
          console.log(n);
          let noSelectIds = [];
          this.menuAllData.forEach(main => {
            main.tabData.forEach(item => {
              item.forEach(list => {
                if (list.id) {
                  noSelectIds.push(list.id);
                }
              });
            });
          });
          console.log(noSelectIds);
             console.log(this.menuData);
          noSelectIds.forEach(id => {
            this.menuData.forEach(item => {
              this.arraySpecs(item, id, true);
            });
          });
          console.log(this.menuData);
        }
      },
      immediate: true
    },
    menuTabs(tabs) {
      let ids = this.extractIds(tabs);
      ids.forEach(id => {
        this.menuData.forEach(item => {
          this.arraySpecs(item, id, false);
        });
      });
    }
  },
  data() {
    return {
      menuData: [],
      disabled: true,
      data: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted() {
    this.menuData = this.allSide;
 
    // console.log(this.menuData);
  },
  methods: {
    /* 处理传过来的tabs 提取id */
    extractIds(tabs) {
      let ids = [];
      tabs[0].tabData.forEach(item => {
        item.forEach(i => {
          ids.push(i.id);
        });
      });

      return ids;
    },
    /* 选择的节点 */
    setSelect(selectMenu) {
      // console.log(selectMenu);
      selectMenu.forEach((select, index) => {
        let menuId = select.id;
        this.menuData.forEach(item => {
          this.arraySpecs(item, menuId, true);
        });
      });
    },
    /* 递归函数  */
    arraySpecs(item, menuId, boolean) {
      if (item.children) {
        item.children.forEach(i => {
          this.arraySpecs(i, menuId, boolean);
        });
      } else {
        if (menuId == item.id) {
          // console.log(item.id);
          this.$set(item, "disabled", boolean);
        }
      }
    },
    /* 获取可选择的节点 */
    getCheckedNodes() {
      let selectMenu = this.$refs.tree.getCheckedNodes();
      selectMenu.forEach((select, index) => {
        if (select.children) {
          selectMenu.splice(index, 1);
        }
      });
      selectMenu.forEach((select, index) => {
        if (select.children) {
          selectMenu.splice(index, 1);
        }
      });
      selectMenu.forEach((select, index) => {
        if (select.children) {
          selectMenu.splice(index, 1);
        }
      });
      selectMenu.forEach((select, index) => {
        if (select.children) {
          selectMenu.splice(index, 1);
        }
      });
      //console.log(selectMenu);
      let filMenu = selectMenu.filter(item => {
        if (!item.hasOwnProperty("disabled") || item.disabled == false) {
          return item;
        }
      });
      this.setSelect(selectMenu);
      this.$refs.tree.setCheckedKeys([]);
      return filMenu;
    },

    /* 删除选择的项目 */
    changeMenuStatus(id) {
      this.menuData.forEach(item => {
        this.arraySpecs(item, id, false);
      });
    },

    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 9,
          label: "三级 1-1-1"
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.tree-main {
  height: 300px;
  overflow: auto;
}
</style>
