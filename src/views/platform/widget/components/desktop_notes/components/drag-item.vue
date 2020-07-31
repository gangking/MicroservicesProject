<template>
  <div>
    <ul class="notes">
      <li v-for="(item,index) in listData" :key="index">
        <div class="notes-item" @click="routeTo(item)">
          <!-- <div class="note-icon">

            <i :class="`iconfont tab-icon icon-${item.icon}`" />
          </div>-->

          <div
            class="note-icon"
            :style="{backgroundColor:'rgb('+Math.floor(Math.random() * 180)+','+Math.floor(Math.random() * 180)+','+Math.floor(Math.random() * 180)+')'}"
          >
            <i :class="`iconfont tab-icon icon-${item.icon}`" />
          </div>
          <div class="note-name">{{ item.name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Utils from "@/utils/util";
export default {
  name: "drag-item",
  props: {
    noteData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState("ibps/page", ["opened"]),
    dragOptions() {
      return {
        animation: 200,
        group: "people",
        disabled: false,
        ghostClass: "blue-background-class"
      };
    }
  },
  data() {
    return {
      listData: []
    };
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  watch: {
    noteData: {
      handler(n) {
        this.listData = n;
      },
      immediate: true
    },
    listData() {
      // console.log(this.listData);
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.listData = this.noteData;
    });
  },
  methods: {
    /* 路由跳转 */
    routeTo(tab) {
      if (Utils.IS_PAYABLE_FORM.test(tab.path)) {
        this.ibpsPayable.setPayableParams(Utils.queryToJson(tab.path));
      } else {
        this.$router.push({ path: tab.path });
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.blue-background-class {
  background: red;
}
.notes {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 10px 30px;
  li {
    .notes-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      // margin-left: 10px;
      // margin-bottom: 15px;
      width: 120px;
      height: 120px;
      background: #fff;
      text-align: center;

      border-radius: 3px;

      box-sizing: border-box;
      transition: 0.3s all;
      &:hover {
        // box-shadow: 0px 2px 8px 0px #4684a1;
      }
      .note-icon {
        width: 70px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        color: #fff;
        background: #7a85af;
        border-radius: 15px;
        transition: 0.3s all;
        &:hover {
          box-shadow: 0px 2px 8px 0px #3d4d55;
        }
        .tab-icon {
          font-size: 32px;
        }
      }
      .note-name {
        font-size: 14px;
        color: rgb(78, 72, 72);
        height: 32px;
      }
      .delete {
        position: absolute;
        display: inline-block;
        z-index: 3;
        right: 14px;
        top: 0px;
        font-weight: bold;
        color: rgb(235, 41, 41);
        box-sizing: border-box;
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
