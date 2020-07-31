<template>
  <div class="info">
    <el-dialog :visible.sync="dialogVisible" title="上传头像" width="50%" :before-close="handleClose" style="height: 600px;" append-to-body top="63px" :modal="true">
      <el-col>
        <div>
          <span class="photo-area" @click="dialogFormVisible = !readonly">
            <!-- <img :src="image" class="avatar" /> -->
            <img v-if="formData.photo" :src="photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </span>
        </div>
        <span v-if="!readonly " class="operation">点击上方进行头像操作</span>
        <ibps-uploader :visible="dialogFormVisible" :limit="limit" :accept="accept" @action-event="uploaderAction" @close="visible => dialogFormVisible = visible" />
      </el-col>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fileUrl } from '@/api/platform/file/avatarupload';
import IbpsUploader from '@/business/platform/file/avatarupload';
import { getFile } from '@/utils/avatar';
export default {
  computed: {
    // image() {
    //   // return getFile(this.formData.photo);
    //   // console.log('aaa',getFile(this.formData.photo));
    //   // return getFile(this.formData.photo);
    //   let photo ="http://172.18.3.81:8080/" + this.formData.photo
    //   console.log('photo:',photo);
    //   return photo
    // }
  },
  watch: {
    data() {
      this.formData = this.data;
      // console.log("formData: ", this.formData);
    },
    formData: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          // if (this.formData.id && !this.readonly) {
          //   this.rules.password[0].required = false;
          // } else {
          this.rules.password[0].required = true;
          // }
          this.handleEmitEvent();
        }
      },
      deep: true
    }
  },
  created() {
    this.isSuper = this.$store.getters.isSuper;

    // this.avaphoto = this.avaimg;
    // console.log("data: ", this.formData);
    // console.log("avaphoto11:", this.avaimg);
  },
  mounted() {
    this.formData = this.data;
  },
  data() {
    return {
      photo: '',
      formData: {},
      dialogFormVisible: false,
      avaphoto: '',
      limit: 1, // 规定上传个数
      accept: 'image/jpeg,image/gif,image/png,image/jpg',
      toolbars: [
        { key: 'confirm' }
        // { key: "cancel" }
      ]
    };
  },
  props: {
    // avaimg: String,
    dialogVisible: Boolean,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getimg() {
      getFile(this.formData.photo);
    },
    handleClose() {
      this.$emit('handleClose', false);
    },
    uploaderAction(buttonKey, data) {
      this.formData.photo = data;
      // console.log("uploaderAction:",this.formData.photo);

      this.photo = this.getphotoUrl(data);
      this.dialogFormVisible = false;
    },
    getphotoUrl(url) {
      var reg = /http[s]?\:/gi,
        local_url = process.env.VUE_APP_BASE_PHOTO_API,
        default_url = local_url + 'group1/M00/00/00/rBIDUV2CI4qAHw7sAAC9EywxXfc62.jpeg';

      return url ? (reg.test(url) ? url : local_url + url) : default_url;
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm();
          break;
        case 'cancel':
          this.closeDialog();
          break;
        default:
          break;
      }
    },
    closeDialog() {
      this.$emit('handleClose', false);
    },
    handleConfirm() {
      this.$emit('photopath', this.formData.photo);
      this.$emit('handleClose', false);
    },
    handleEmitEvent() {
      this.$emit('input', this.formData);
    }
  },
  mounted() {},
  components: {
    IbpsUploader
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 70% !important;
  // margin-left: 80px;
  .photo-area {
    margin: 0 auto;
    cursor: pointer;
  }
  .operation {
    text-align: center;
    margin: 20px auto;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
  }
  .photo-area:hover > .handle-photo-buttons {
    display: block;
  }
}
</style>