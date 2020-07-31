<template>
  <div class="widget-form-container">
    <div v-if="data.fields.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
    <div class="form-header" @click="$emit('select-field')">
      <div class="title">{{ data.name||'未设置表单标题' }}</div>
      <div v-if="data.desc" class="desc">{{ data.desc }}</div>
    </div>
    <el-form
      :size="data.attrs.size"
      :label-suffix="data.attrs ? (data.attrs.colon ? ':' : '') : ''"
      :label-position="data.attrs.labelPosition"
      :label-width="data.attrs.labelWidth +( data.attrs.labelWidthUnit?data.attrs.labelWidthUnit:'px')"
      :status-icon="data.attrs.statusIcon"
    >
      <draggable
        v-model="data.fields"
        v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.fields">
            <!--栅格布局-->
            <template v-if="element.field_type === 'grid'">
              <el-row
                v-if="element && element.id"
                :key="element.id+index"
                class="widget-col widget-view"
                type="flex"
                :class="{active: selectWidget&&selectWidget.id == element.id}"
                :gutter="element.field_options.gutter ? element.field_options.gutter : 0"
                :justify="element.field_options.justify"
                :align="element.field_options.align"
                @click.native="handleSelectWidget(index)"
              >
                <el-col
                  v-for="(col, colIndex) in element.field_options.columns"
                  :key="colIndex"
                  :span="col.span ? col.span : 0"
                >
                  <draggable
                    v-model="col.fields"
                    :no-transition-on-drag="true"
                    v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                    @end="handleMoveEnd"
                    @add="handleWidgetGridAdd($event, element, colIndex)"
                  >
                    <transition-group name="fade" tag="div" class="widget-col-list">
                      <template v-for="(el, i) in col.fields">
                        <widget-form-item
                          v-if="el && el.id"
                          :key="el.id+i"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="col"
                        />
                      </template>
                    </transition-group>
                  </draggable>
                </el-col>
                <div
                  v-if="selectWidget&&selectWidget.id == element.id"
                  class="widget-view-action widget-col-action"
                >
                  <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
                </div>

                <div
                  v-if="selectWidget&&selectWidget.id == element.id"
                  class="widget-view-drag widget-col-drag"
                >
                  <i class="ibps-icon-arrows drag-widget" />
                </div>
              </el-row>
            </template>
            <!--子表单-->
            <template v-else-if="element.field_type === 'table'">
              <div
                v-if="element && element.id"
                :key="element.id+index"
                :class="{active: selectWidget&&selectWidget.id === element.id}"
                class="widget-table widget-view"
                @click="handleSelectWidget(index)"
              >
                <div class="panel panel-info">
                  <div class="panel-heading ibps-clearfix" style="border-bottom:0;">
                    <div class="ibps-fl">{{ element.label }}</div>
                    <div class="ibps-fr">
                      <el-button-group disabled>
                        <el-button
                          v-for="(button,i) in element.field_options.buttons"
                          :key="i"
                          :type="button.style"
                          :icon="'ibps-icon-'+button.icon"
                          disabled
                        >{{ button.label }}</el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div class="panel-body ibps-p-0">
                    <div class="widget-table-wrapper">
                      <div class="widget-table-content">
                        <draggable
                          v-model="element.field_options.columns"
                          :no-transition-on-drag="true"
                          v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                          @end="handleMoveEnd"
                          @add="handleWidgetTableAdd($event, element)"
                        >
                          <transition-group
                            name="fade"
                            tag="div"
                            class="widget-table-col"
                            :style="{width: element.field_options.columns.length>0?'calc('+((element.field_options.columns.length+1) *200)+'px)':'200px'}"
                          >
                            <div
                              v-for="(el, i) in element.field_options.columns"
                              :key="el.id+i"
                              class="widget-table-view"
                              style="width:200px;"
                              :class="{active: selectWidget &&selectWidget.id == el.id}"
                              @click.stop="handleTableSelectWidget(index,i)"
                            >
                              <widget-form-table
                                :element="el"
                                :select.sync="selectWidget"
                                :index="i"
                                :data="element"
                              />
                            </div>
                          </transition-group>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="selectWidget&&selectWidget.id == element.id"
                  class="widget-view-action widget-table-action"
                >
                  <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
                </div>

                <div
                  v-if="selectWidget&&selectWidget.id == element.id"
                  class="widget-view-drag widget-table-drag"
                >
                  <i class="ibps-icon-arrows drag-widget" />
                </div>
              </div>
            </template>
            <!--其他字段-->
            <template v-else>
              <widget-form-item
                v-if="element && element.id"
                :key="element.id+index"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              />
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "./widget-form-item";
import WidgetFormTable from "./widget-form-table";
export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetFormTable
  },
  props: {
    data: Object, // 整个中间form表单的数据
    select: Object // 选择的组件数据
  },
  data() {
    return {
      selectWidget: this.select,
      tableData: [
        {
          name: ""
        }
      ]
    };
  },
  watch: {
    select(val) {
      //    监听父级选择的
      console.log(val);
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        //向父级传递值
        console.log(val);
        this.$emit("update:select", val);
      },
      deep: true
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget(index) {
      this.selectWidget = this.data.fields[index];
    },
    handleTableSelectWidget(index, colIndex) {
      this.data.fields[index].field_options.columns[
        colIndex
      ].code = this.data.fields[index].name;
      this.data.fields[index].field_options.columns[colIndex].isSub = true;
      this.selectWidget = this.data.fields[index].field_options.columns[
        colIndex
      ];
    },

    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex;

      // 为拖拽到容器的元素添加唯一 id
      const id = this.$utils.guid();

      this.$set(this.data.fields, newIndex, {
        ...this.data.fields[newIndex],
        field_options: {
          ...this.data.fields[newIndex].field_options
        },
        id
      });

      if (
        this.data.fields[newIndex].field_type === "radio" ||
        this.data.fields[newIndex].field_type === "checkbox" ||
        this.data.fields[newIndex].field_type === "select"
      ) {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          field_options: {
            ...this.data.fields[newIndex].field_options,
            options: this.data.fields[newIndex].field_options.options.map(
              item => ({
                ...item
              })
            )
          }
        });
      } else if (this.data.fields[newIndex].field_type === "grid") {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          field_options: {
            ...this.data.fields[newIndex].field_options,
            columns: this.data.fields[newIndex].field_options.columns.map(
              item => ({
                ...item
              })
            )
          }
        });
      } else if (this.data.fields[newIndex].field_type === "table") {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          field_options: {
            ...this.data.fields[newIndex].field_options,
            buttons: this.data.fields[newIndex].field_options.buttons.map(
              item => ({
                ...item
              })
            ),
            columns: this.data.fields[newIndex].field_options.columns.map(
              item => ({
                ...item
              })
            )
          },
          name: ""
        });
      }

      this.selectWidget = this.data.fields[newIndex];
    },
    /**
     * 栅格布局
     */
    handleWidgetGridAdd($event, row, colIndex) {
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf("data-grid") >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === "DIV" &&
          this.data.fields.splice(
            oldIndex,
            0,
            row.field_options.columns[colIndex].fields[newIndex]
          );

        row.field_options.columns[colIndex].fields.splice(newIndex, 1);
        return false;
      }

      const id = this.$utils.guid();

      this.$set(row.field_options.columns[colIndex].fields, newIndex, {
        ...row.field_options.columns[colIndex].fields[newIndex],
        field_options: {
          ...row.field_options.columns[colIndex].fields[newIndex].field_options
        },
        id
      });

      if (
        row.field_options.columns[colIndex].fields[newIndex].field_type ===
          "radio" ||
        row.field_options.columns[colIndex].fields[newIndex].field_type ===
          "checkbox" ||
        row.field_options.columns[colIndex].fields[newIndex].field_type ===
          "select"
      ) {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          field_options: {
            ...row.field_options.columns[colIndex].fields[newIndex]
              .field_options,
            options: row.field_options.columns[colIndex].fields[
              newIndex
            ].field_options.options.map(item => ({
              ...item
            }))
          }
        });
      }

      this.selectWidget = row.field_options.columns[colIndex].fields[newIndex];
    },
    /**
     * 子表单
     */
    handleWidgetTableAdd($event, row) {
      // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex;
      // const oldIndex = $event.oldIndex
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf("data-table") >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        // item.tagName === 'DIV' && this.data.fields.splice(oldIndex, 0, row.field_options.columns[colIndex])

        // row.field_options.columns[colIndex].splice(newIndex, 1)

        return false;
      }

      // console.log('from', item)

      const id = this.$utils.guid();
      const code = row.name;
      const isSub = true;

      this.$set(row.field_options.columns, newIndex, {
        ...row.field_options.columns[newIndex],
        field_options: {
          ...row.field_options.columns[newIndex].field_options
        },
        id,
        code,
        isSub
      });

      if (
        row.field_options.columns[newIndex].field_type === "radio" ||
        row.field_options.columns[newIndex].field_type === "checkbox" ||
        row.field_options.columns[newIndex].field_type === "select"
      ) {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          field_options: {
            ...row.field_options.columns[newIndex].field_options,
            options: row.field_options.columns[
              newIndex
            ].field_options.options.map(item => ({
              ...item
            }))
          }
        });
      }
      this.selectWidget = row.field_options.columns[newIndex];
    },
    handleWidgetDelete(index) {
      if (this.data.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.fields[index - 1];
        }
      } else {
        this.selectWidget = this.data.fields[index + 1];
      }

      this.$nextTick(() => {
        this.data.fields.splice(index, 1);
      });
    }
  }
};
</script>
