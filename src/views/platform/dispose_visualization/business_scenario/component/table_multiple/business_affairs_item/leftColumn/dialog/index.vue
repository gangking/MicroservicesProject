<template>
  <div class="dialogBox">
    <!-- 效果预览弹窗preview -->
    <el-dialog append-to-body :title="dialogTitle" :visible.sync="dialogPreview" width="40%" :before-close="handleClose">
      <div class="preview">
        <previewStyle :formLabelAlign="formLabelAlign" :dialogPreview="dialogPreview" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPreview = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 字体设置弹窗 -->
    <el-dialog append-to-body :title="dialogTitle" :visible.sync="dialogFontSet" width="40%" :before-close="handleClose">
      <fontSet />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFontSet = false">取 消</el-button>
        <el-button type="primary" @click="dialogFontSet = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图标设置弹窗 -->
    <el-dialog append-to-body :title="dialogTitle" :visible.sync="dialogIconSet" width="40%" :before-close="handleClose">
      <iconSet/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogIconSet = false">取 消</el-button>
        <el-button type="primary" @click="dialogIconSet = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加或编辑业务事务弹窗 -->
    <el-dialog append-to-body top="5vh" :title="dialogTitle" :visible.sync="dialogAddEdit" width="40%" :before-close="handleClose">
      <addEdit :deliverInfo="deliverInfo"  @closedialogAddEdit="dialogAddEdit = false" @savedialogAddEdit="savedialogAddEdit" />
    </el-dialog>
    <!-- BO字段查看及设置弹窗 -->
    <el-dialog append-to-body :title="dialogTitle" :visible.sync="dialogBO" width="40%" :before-close="handleClose">
      <span>BO字段查看及设置弹窗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBO = false">取 消</el-button>
        <el-button type="primary" @click="dialogBO = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import previewStyle from './preview';
import addEdit from './addEdit';
import fontSet from './fontSet';
import iconSet from './iconSet';
export default {
  components: {
    previewStyle,
    addEdit,
    fontSet,
    iconSet
  },
  props: {
    dialogType: {
      type: String,
      default: ''
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    deliverInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formLabelAlign: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    dialogFlag: {
      handler(val) {
        switch (this.dialogType) {
          case 'dialogPreview':
            this.dialogPreview = true;
            break;
          case 'dialogFontSet':
            this.dialogFontSet = true;
            break;
          case 'dialogIconSet':
            this.dialogIconSet = true;
            break;
          case 'dialogAddEdit':
            this.dialogAddEdit = true;
            break;
          case 'dialogBO':
            this.dialogBO = true;
            break;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogPreview: false,
      dialogFontSet: false,
      dialogIconSet: false,
      dialogAddEdit: false,
      dialogBO: false
    };
  },
  methods: {
    handleClose() {
      switch (this.dialogType) {
        case 'dialogPreview':
          this.dialogPreview = false;
          break;
        case 'dialogFontSet':
          this.dialogFontSet = false;
          break;
        case 'dialogIconSet':
          this.dialogIconSet = false;
          break;
        case 'dialogAddEdit':
          this.dialogAddEdit = false;
          break;
        case 'dialogBO':
          this.dialogBO = false;
          break;
      }
    },
    // 保存字段
    savedialogAddEdit(info) {
      console.log('保存字段', info);
      this.dialogAddEdit = false;
      this.$emit('savedialogAddEdit',info)
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__body {
    .el-form {
      .el-form-item__label {
        padding: 0;
      }
    }
  }
}
// 编辑新增业务事务
// 字体设置
// 图标设置
// BO字段
</style>