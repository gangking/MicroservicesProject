<template>
  <div class="container-header">
    <el-row>
      <el-col :span="4">
        <div class="block-left">
          <div class="sany-logo">
            <!-- 文思logo -->
            <img :src="headerVal.logo ? headerVal.logo : formLogoVal">
          </div>
          <div class="line">
            <span />
          </div>
          <div class="user-avatar">
            <el-avatar :size="35" :src="photo" />
          </div>
          <div class="user-info">
            <p>
              <span :title="headerVal.homeUserPo.user?headerVal.homeUserPo.user:'无名'">{{ headerVal.homeUserPo.user?headerVal.homeUserPo.user:'无名' }}</span>
              <span :title="headerVal.homeUserPo.group?headerVal.homeUserPo.group:'未知公司'">{{ headerVal.homeUserPo.group?headerVal.homeUserPo.group:'未知公司' }}</span>
              <span :title="headerVal.homeUserPo.position?headerVal.homeUserPo.position:'未知部门'">{{ headerVal.homeUserPo.position?headerVal.homeUserPo.position:'未知部门' }}</span>
            </p>
          </div>
        </div>
      </el-col>
      <!--  <el-col :span="1">
        <div class="step-icon">
          <i class="p-icon" @click="setStepv" :class="{'icon-hengzhuanshu':!payable.stepDirectionIsVertical, 'icon-shuzhuangheng':payable.stepDirectionIsVertical}"></i>
        </div>
      </el-col> -->
      <el-col :span="12">
        <div class="invoice-block-title">
          <p>{{ headerVal.name }}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="sub-actitve">
          <div>
            <i class="iconfont icon-uniE19B" />
            <span>状态：{{ headerVal.docStatus?headerVal.docStatus:'未提交' }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="qr-code">
          <canvas id="canvas" ref="qrCanvasCode" style="width:45px;height:45px;" />
          <p>{{ headerVal.docNumber?headerVal.docNumber:'未生成' }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import QRCode from 'qrcode';
import { createNamespacedHelpers } from 'vuex';
// 文思logo
import formLogo from '@/assets/sany/images/sany-logo.png';
const { mapState } = createNamespacedHelpers('ibps/compositeBase');

export default {
  name: 'container-header',
  components: {
    QRCode: QRCode
  },
  inject: ['payable'],
  data() {
    return {
      formLogoVal: formLogo,// 文思logo
      activities: [],
      logo: '',
      photo: '',
      headerVal: {
        name: '',
        key: '',
        bsKey: '',
        bsCode: '',
        scKey: null,
        scId: '',
        scDescribe: '',
        scParentId: '',
        scParentDescribe: '',
        topBo: '',
        logo: '',
        avatar: 'Y',
        leftInfo: null,
        midInfo: null,
        qrCode: null,
        homeUserPo: {
          name: null,
          position: '',
          midInfo: null,
          userId: '',
          user: '',
          superName: '',
          photo: '',
          group: '',
          sanyUrl: ''
        },
        docNumber: null,
        docStatus: null,
        defId: ''
      }
    };
  },
  computed: {
    ...mapState(['headerInfo'])
  },
  watch: {
    headerInfo: {
      handler(val) {
        // console.log('headerVal数据改变了', val)
        if (val) {
          this.headerVal = val;
          this.photo = this.getphotoUrl(val.homeUserPo.photo);
          var container = val.qrCode ? val.qrCode : '未生成';
          this.useqrcode(container);
        }
      },
      immediate: true
    }
  },
  methods: {
    getphotoUrl(url) {
      var reg = /http[s]?\:/gi,
        local_url = process.env.VUE_APP_BASE_PHOTO_API,
        default_url = local_url + 'group1/M00/00/00/rBIDUV2CI4qAHw7sAAC9EywxXfc62.jpeg';

      return url ? (reg.test(url) ? url : local_url + url) : default_url;
    },
    useqrcode(container) {
      setTimeout(() => {
        var canvas = this.$refs.qrCanvasCode;
        console.log('二维码DOM是的:', canvas);
        QRCode.toCanvas(canvas, container, function(error) {
          if (error) console.error(error);
          console.log('QRCode success!');
        });
      }, 10);
    },
    setStepv() {
      this.payable.stepDirectionIsVertical = !this.payable.stepDirectionIsVertical;
    }
  }
};
</script>
<style lang="scss">
.step-icon {
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 20px;
  align-items: center;
  .p-icon {
    cursor: pointer;
  }
}
#canvas {
  width: 45px !important;
  height: 45px !important;
}
$container-title-height: 100%;
.container-header {
  height: $container-title-height;
  .el-row {
    // display: flex;
    // justify-content: flex-end;
    height: $container-title-height;
    .el-col {
      height: $container-title-height;
      .block-left {
        min-width: 500px;
        height: $container-title-height;
        line-height: $container-title-height;
        vertical-align: center;
        display: flex;
        margin-left: 15px;
        .sany-logo {
          height: $container-title-height;
          width: 96px;
          position: relative;
          margin-right: 2px;
          img {
            position: absolute;
            width: 96px;
            height: 29px;
            top: calc(50% - 14.5px);
          }
        }
        .line {
          text-align: center;
          padding: 10px 1px;
          span {
            display: inline-block;
            width: 1.5px;
            height: 100%;
            margin: 0 5px;
            background: linear-gradient(white, #ccc, white);
          }
        }
        .user-avatar {
          position: relative;
          width: 35px;
          span {
            display: block;
            position: absolute;
            top: calc(50% - 17.5px);
          }
        }

        .user-info {
          margin-left: 3px;
          line-height: normal;
          padding: 3px 0;
          height: $container-title-height;
          display: table;
          p {
            margin: 0;
            // padding: 2px 0;
            font-size: 12px;
            white-space: nowrap;
            // display: table-cell;
            width: 100%;
            height: 100%;
            // vertical-align: bottom;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            span {
              display: block;
              width: 100px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
      .invoice-block-title {
        font-size: 22px;
        font-weight: 700;
        height: $container-title-height;
        line-height: $container-title-height;
        width: 100%;
        text-align: center;
        vertical-align: middle;
      }
      .sub-actitve {
        // display: table;
        height: $container-title-height;
        text-align: center;
        position: relative;
        div {
          // display: table-cell;
          // vertical-align: bottom;
          // height: $container-title-height;
          // width: 100%;
          display: flex;
          position: absolute;
          bottom: 10px;
          margin-left: 97px;
          i {
            color: #0f8de8;
            margin-right: 2px;
            font-size: 20px;
            vertical-align: middle;
          }
          span {
            position: relative;
            // bottom: 4px;
            color: #535e75;
            font-size: 14px;
            line-height: 20px;
            white-space: nowrap;
          }
        }
      }
      .qr-code {
        text-align: center;
        vertical-align: center;
        height: 50px;
        padding-left: 28px;
        font-size: 12px;
        canvas {
          position: relative;
          top: 5px;
        }
        img {
          padding-top: 5px;
          height: 55px;
          width: 53px;
        }
        p {
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 100;
        }
      }
    }
  }
}
</style>
