<template>
  <div class="setting-export-container">
    <!-- 扩展属性 -->
    <div class="panel-footer">扩展属性</div>
    <el-form label-position="top">
      <el-form-item label="数据标题：">
        <el-button type="primary" @click="setDataTitle('data')">设置数据标题</el-button>
      </el-form-item>
      <el-form-item label="导出字段：">
        <el-button type="primary" @click="setDataTitle('expand')">设置导出字段</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      class="edit-dialog"
      top="5vh"
      width="60%"
      append-to-body
      @close="closeDialog"
    >
      <template v-if="title === title_data">
        <el-radio v-model="data.radio" label="first" style="display:block;margin-bottom:10px">第一个字段的值</el-radio>
        <el-radio v-model="data.radio" label="custom">自定义标题</el-radio>
        <el-select
          v-if="data.radio === 'custom'"
          v-model="data.customGroup"
          style="width:60%;"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择字段"
        >
          <el-option
            v-for="item in customGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span
              style="font-weight:bold"
              :style="{color: item.icon === 'S' ? '#23c6c8': (item.icon === 'D' ? '#1c84c6': 'red' )}"
            >
              {{ item.icon }}
            </span>
            <span>{{ item.label }}</span>
          </el-option>
        </el-select>
      </template>
      <template v-if="title === title_export">
        <div style="margin:0 0 20px 0;">
          <span>导出时选择字段：</span>
          <el-radio v-model="data.select_field" label="Y">是</el-radio>
          <el-radio v-model="data.select_field" label="N">否</el-radio>
          <span style="margin-left:30px">导出数据形式
            <el-tooltip class="item" effect="light" placement="bottom">
              <div slot="content" style="line-height:1.5;">
                数据库元数据:数据库存什么数据就导出什么数据；<br>
                界面形式数据:界面展示格式是什么样就导出；<br>
                例：用户选择器在数据库保存的是json格式数据，<br>
                数据库元数据导出就直接导出json，<br>
                界面形式数据就导出用户姓名。
              </div>
              <i class="el-icon-warning" />
            </el-tooltip>
            ：
          </span>
          <el-radio v-model="data.export_type" label="db">数据库元数据形式</el-radio>
          <el-radio v-model="data.export_type" label="page">界面形式数据</el-radio>
        </div>
        <div>
          <el-table
            max-height="400px"
            :data="data.fields"
            style="width: 100%"
            border
          >
            <el-table-column
              width="240"
              align="center"
              prop="date"
              label="字段"
            />
            <el-table-column
              prop="name"
            >
              <template slot="header">
                <span style="margin-right:40px;">权限</span>
                <el-button size="mini" @click="setDataTitle('all')">所有人</el-button>
                <el-button size="mini" @click="setDataTitle('none')">无</el-button>
                <el-button size="mini" @click="setDataTitle('editor')">编辑</el-button>
              </template>
              <template v-slot="scope">
                <el-tag
                  v-for="tag in scope.row.name"
                  :key="tag.index"
                  :closable="tag === '无' ? false : true"
                  :type="tag === '无' ? 'info' : ''"
                  @close="handleDeleteTag(tag,scope.$index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <div style="display:inline-block;float:right;">
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  />
                  <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="handleRefresh(scope.$index)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <config-selector
            :visible="configSelectorVisible"
            title="导出字段授权"
            @close="visible => configSelectorVisible = visible"
          />
        </div>
      </template>
      <div slot="footer" class="el-dialog--center">
        <el-button type="primary" @click="saveData">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { customGroupOptions } from '../constants/editor-column'
import { tableDataOptions } from '../constants/editor-column'
import ConfigSelector from '@/business/platform/rights/config'
export default {
  components: {
    ConfigSelector
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          radio: 'first',
          customGroup: [],
          select_field: 'Y',
          export_type: 'db',
          fields: tableDataOptions
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogRightsVisible: false,
      configSelectorVisible: false,
      buttonType: 'info',
      title: '',
      title_data: '设置数据标题',
      title_export: '导出字段',
      customGroupOptions
    }
  },
  methods: {
    setDataTitle(type) {
      console.log(type)
      this.dialogVisible = true
      if (type === 'data') {
        this.title = this.title_data
      } else if (type === 'expand') {
        this.title = this.title_export
      } else if (type === 'all') {
        this.buttonType = 'info'
        for (const tags of this.data.fields) {
          tags.name = ['所有人']
        }
      } else if (type === 'none') {
        for (const tags of this.data.fields) {
          tags.name = ['无']
        }
      } else if (type === 'editor') {
        console.log('bianji')
        this.configSelectorVisible = true
      }
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.configSelectorVisible = true
    },
    handleRefresh(index) {
      console.log(index)
      this.data.fields[index].name = ['无']
    },
    handleDeleteTag(tag, index, row) {
      console.log(tag, index, row,)
      if (row.name.length > 1) {
        this.data.fields[index].name.splice(this.data.fields[index].name.indexOf(tag), 1)
      } else {
        this.data.fields[index].name.splice(this.data.fields[index].name.indexOf(tag), 1, '无')
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    saveData() {
      // 数据存储未完成
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.setting-export-container {
  .el-form {
    margin: 10px 0 0 20px;
  }
  .el-form-item__label {
    line-height: 12px;
  }
  .el-button {
    width: 100%;
  }
}

body /deep/ .el-message .el-icon-warning i{
  font-size: 3px !important;
}
</style>

