<template>
  <div class="info">
    <el-dialog
      :visible.sync="dialogVisible"
      title="上传头像"
      width="50%"
      :before-close="handleClose"
      style="height: 600px;"
      append-to-body
      top="63px"
      :modal="true"
    >
      <span>
        <el-row>
          <!-- el-button -->
          
          <input
            type="file"
            id="uploads"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event,1)"
            class="el-button"
            style="margin-bottom:15px"
          />
          
        </el-row>
        <el-row>
          <el-col :span="16">
            <!-- 裁剪 -->
            <vueCropper
              style="width:100%;height:300px"
              ref="cropper"
              :img="attach.customaryUrl"
              :autoCrop="options.autoCrop"
              :fixedBox="options.fixedBox"
              :canMoveBox="options.canMoveBox"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :centerBox="options.centerBox"
              @realTime="realTime"
            ></vueCropper>
          </el-col>
          <el-col :span="8">
            <h2 align="center">头像预览</h2>
            <div class="show-preview">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="footerBtn" align="center">
          <div class="changebtn">
            <el-button
              type="success"
              class="oper"
              title="放大"
              @click="changeScale(1)"
              style="font-size"
            >+</el-button>
            <el-button type="success" class="oper" title="缩小" @click="changeScale(-1)">－</el-button>
            <el-button type="success" class="oper" title="左旋转" @click="rotateLeft">↺</el-button>
            <el-button type="success" class="oper" value="↻" title="右旋转" @click="rotateRight">↻</el-button>
          </div>
          <el-button type="primary" @click="cut('blob')">确认</el-button>
          <el-button type="primary" @click="handleClose">取消</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fileUrl } from "@/api/platform/file/attachment";
import IbpsUploader from "@/business/platform/file/uploader";
import { getFile } from "@/utils/avatar";
import { VueCropper } from "vue-cropper";
import { uploadFile, remove } from "@/api/platform/file/avatarupload";
import request from "@/utils/request";
import { SYSTEM_URL } from "@/api/baseUrl";
import { BASE_GATEWAY_API } from "@/api/baseUrl";
export default {
  computed: {
    image() {
      return getFile(this.formData.photo);
    }
  },
  watch: {
    data() {
      this.formData = this.data;
      // console.log("formData: ", this.formData);
    },
    formData: {
      handler: function(val, oldVal) {},
      deep: true
    }
  },

  data() {
    return {
      msg1: this.msg,
      imgpath: "",
      formData: {},
      dialogFormVisible: false,
      limit: 1, // 规定上传个数
      options: {
        autoCrop: true, //默认生成截图框
        fixedBox: true, //固定截图框大小
        canMoveBox: false, //截图框不能拖动
        autoCropWidth: 180, //截图框宽度
        autoCropHeight: 180, //截图框高度
        centerBox: false //截图框被限制在图片里面
      },
      previews: {}, //实时预览图数据
      attach: {
        //后端附件表
        id: "",
        userId: "",
        customaryUrl: "", //原图片路径
        laterUrl: "", //裁剪后图片路径  /static/logo.png
        attachType: "photo" //附件类型
      },
      fileName: "", //本机文件地址
      uploadImgRelaPath: "" //上传后图片地址
    };
  },
  props: {
    msg: String,
    dialogVisible: Boolean,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // handleConfirm() {
    //   this.$emit("photopath");
    //   this.$emit("handleClose", false);
    // },
    // 放大缩小
    changeScale(num) {
      // console.log("changeScale");
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    //右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    handleClose() {
      this.$emit("handleClose", false);
    },
    closeDialog() {
      this.$emit("handleClose", false);
    },
    realTime(data) {
      this.previews = data;
    },
    //加载头像信息
    find() {
      this.userId = sessionStorage.getItem("userId");
      this.$axios.post("/api/attach/find", this.attach).then(res => {
        // console.log(res);
      });
    },
    //选择本地图片
    uploadImg(e, num) {
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      // console.log(e.target.result);
      //fileReader 接口，用于异步读取文件数据
      var reader = new FileReader();
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = e => {
        let data = e.target.result;
        this.attach.customaryUrl = data;
      };
    },
    //确认截图,上传
    cut(type) {
      var formData = new FormData();
      this.$refs.cropper.getCropBlob(res => {
        //res是裁剪后图片的bolb对象
        formData.append("file", res, this.userId);

        // console.log("data:", formData);
        // console.log("file:", type);
        // console.log("fileres:", res);
        return request({
          baseURL: BASE_GATEWAY_API,
          url: SYSTEM_URL + "/file/upload/photo",
          method: "post",
          data: formData
        }).then(response => {
          this.imgpath = response.message;
          // console.log("this.imgpath:", this.imgpath);
          this.$emit("photopath", this.imgpath);
          this.$emit("handleClose", false);
        });
      });
    }
  },
  created() {
    this.isSuper = this.$store.getters.isSuper;
  },
  mounted() {
    this.formData = this.data;
    // console.log("data: ", this.formData);
  },
  components: {
    IbpsUploader,
    vueCropper: VueCropper
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 90% !important;
}

/deep/ .vue-cropper {
  width: 400px !important;
  height: 300px !important;
}
.show-preview {
  display: flex;
  justify-content: center;
}
.preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}
.footerBtn {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  .changebtn {
    margin: 0 55px;
    .el-button {
      margin: 0 10px;
      width: 50px;
      font-size: 16px;
    }
  }
  .el-button {
    margin: 0 15px;
    width: 70px;
  }
}
.labelfile{
  border: 1px solid red;
}
.change{
   opacity: 0;
}
</style>