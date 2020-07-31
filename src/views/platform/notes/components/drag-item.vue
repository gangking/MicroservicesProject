<template>
  <div>
    <draggable
      v-model="listData"
      class="notes"
      tag="ul"
      v-bind="dragOptions"
      :move="checkMove"
      @start="drag = true"
      @end="dragEnd"
      @update="dragUp"
    >
      <!-- <li class="note-add" @click="handerAdd" key="9999">
        <img src="@/assets/images/desktop/note/add.png" />
      </li>-->

      <li v-for="(item,index) in listData" :key="index">
        <div v-if="showAdd(index)" key="9999" class="note-add" @click="handerAdd">
          <img src="@/assets/images/desktop/note/add.png">
        </div>
        <div v-else class="notes-item" @click="routeTo(item)">
          <transition name="fade-slide">
            <div class="delete" @click.stop.prevent="itemDelte(item,index)">
              <i class="el-icon-remove" />
            </div>
          </transition>
          <!-- :style="styleObject"  -->
          <div
            class="note-icon"
            :style="{backgroundColor:'rgb('+Math.floor(Math.random() * 180)+','+Math.floor(Math.random() * 180)+','+Math.floor(Math.random() * 180)+')'}"
          >
            <i :class="`iconfont tab-icon icon-${item.icon}`" />
          </div>

          <div class="note-name">{{ item.name }}</div>
        </div>
      </li>
      <!-- </transition-group> -->
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapMutations, mapState } from 'vuex'
import Utils from '@/utils/util'
export default {
    name: 'drag-item',
    props: {
        noteData: {
            type: Array,
            default: () => []
        },
        pageNum: {
            type: Number,
            default: () => 0
        },
        swiperIndex: {
            type: Number,
            default: () => 0
        }
    },
    computed: {
        ...mapState('ibps/page', ['opened']),
        dragOptions() {
            return {
                animation: 200,
                group: 'people',
                disabled: false,
                ghostClass: 'blue-background-class',
                filter: '.note-add'
            }
        },
        isShow() {
            return this.swiperIndex == 0
        },
        styleObject() {
            const color = this.backgroundRgb()
            console.log(color)
            return {
                background: `rgb${color}`
            }
        }
    },
    data() {
        return {
            drag: false,
            listData: [],
            copyData: []
        }
    },
    watch: {
        noteData: {
            handler(n) {
                if (n[0].name == 'add') {
                    this.listData = JSON.parse(JSON.stringify(this.noteData))
                    this.copyData = JSON.parse(JSON.stringify(this.noteData))
                } else if (n.length >= 2) {
                    console.log(n)
                    this.listData = JSON.parse(JSON.stringify(this.noteData))
                    this.copyData = JSON.parse(JSON.stringify(this.noteData))
                    this.listData.unshift({ name: 'add' })
                    this.copyData.unshift({ name: 'add' })
                    if (n[n.length - 1].name == 'add') {
                        this.listData.pop()
                        this.copyData.pop()
                    }
                } else {
                    this.listData = JSON.parse(JSON.stringify(this.noteData))
                    this.copyData = JSON.parse(JSON.stringify(this.noteData))
                    this.listData.unshift({ name: 'add' })
                    this.copyData.unshift({ name: 'add' })
                }
                // else if (n.length == 0) {
                //   this.listData = JSON.parse(JSON.stringify(this.noteData));
                //   this.copyData = JSON.parse(JSON.stringify(this.noteData));
                //   this.listData.unshift({ name: "add" });
                //   this.copyData.unshift({ name: "add" });
                // }

                // console.log(this.listData);
            },
            immediate: true
        },
        swiperIndex() {
            // console.log(this.swiperIndex);
        },
        listData() {
            // console.log(this.listData);
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.listData = this.noteData;
        })
    },
    inject: {
        ibpsPayable: {
            from: 'ibpsPayable',
            default() {
                return this
            }
        }
    },
    methods: {
    // 随机颜色
        backgroundRgb() {
            const r = Math.floor(Math.random() * 256)
            const g = Math.floor(Math.random() * 256)
            const b = Math.floor(Math.random() * 256)
            const rgb = '(' + r + ',' + g + ',' + b + ')'
            return rgb
        },
        // 是否显示添加图片
        showAdd(index) {
            // console.log(index ==0)
            return (
                index == 0
            )
        },
        handerAdd() {
            this.$emit('add', this.pageNum, this.swiperIndex)
        },
        dragEnd(e) {
            // console.log(this.listData);
            if (this.listData[0].name == 'add') {
                this.$emit(
                    'dragChange',
                    this.listData.splice(1),
                    this.pageNum,
                    this.swiperIndex
                )
                // console.log(this.listData);
            } else {
                this.$notify({
                    title: '警告',
                    message: '不可拖动该区域',
                    type: 'warning'
                })
                this.listData = JSON.parse(JSON.stringify(this.copyData))
            }
        },
        dragUp(e) {
            // console.log(this.listData);
        },
        // 拖动 如果为false则不拖动
        checkMove(e, originalEvent) {
            // console.log(e);
            const allowMove = originalEvent.target.className != 'note-add'
            //  console.log(allowMove);
            return allowMove
        },

        /* 路由跳转 */
        routeTo(tab) {
            if (Utils.IS_PAYABLE_FORM.test(tab.path)) {
                this.ibpsPayable.setPayableParams(
                    Utils.queryToJson(tab.path)
                )
            } else {
                this.$router.push({ path: tab.path })
            }
        },
        /* 删除每一项 */
        itemDelte(item, index) {
            console.log(index)
            console.log(this.listData.length)
            this.listData.splice(index, 1)
            console.log(this.listData.length)
            this.menuSingleDele(item.id)
            this.$emit('deleteId', this.pageNum, this.swiperIndex, item.id)
        },
        ...mapMutations('ibps/page', ['menuSingleDele'])
    },
    components: {
        draggable
    }
}
</script>

<style scoped lang="scss">
.blue-background-class {
  //background: red;
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
.note-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #fff;
  text-align: center;

  border-radius: 3px;

  box-sizing: border-box;
  cursor: pointer;
  img {
    width: 90px;
    height: 90px;
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
