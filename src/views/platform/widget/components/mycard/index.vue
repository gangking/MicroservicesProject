<template>
  <el-card class="mycard">
    <div>
      <span class="myname">您好, {{ name }}</span>
      <!-- <a href="#" @click="dialogVisible">
        <img src="@/assets/images/desktop/mycard/edit.png" class="edit" />
      </a>-->
    </div>
    <div class="myinfo" @click="dialogVisible">
      <img :src="photo" class="headportrait" />
      <!-- <p>当前信息完成度</p>
      <p>58%</p>-->
    </div>
    <div class="mydetail">
      <p>工号</p>
      <p>职位</p>
      <p>部门</p>
      <p>部门领导</p>
      <p v-if="hideCredit">我的信用分</p>
      <!-- <p>我的余额</p> -->
    </div>
    <div class="myproject">
      <p>{{ jobnum }}</p>
      <p>{{ job }}</p>
      <el-popover placement="top-start" width="200" trigger="hover" :content="bm">
        <p class="bm" slot="reference">{{ bm }}</p>
        <!-- <el-button slot="reference">hover 激活</el-button> -->
      </el-popover>
      <p>{{ leader }}</p>
      <p v-if="hideCredit">
        <span @click="handelCredit" class="blue">{{creditNum}}分</span>
      </p>
      <!-- 金额 -->
      <!-- <p>
        <span @click="handelBalance" class="blue">{{banancetNum}}</span>
      </p>-->
    </div>
    <!-- <basicinfo
      :avaimg="avaphoto"
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      @handleClose="handleClose"
      @photopath="newphoto"
    ></basicinfo>-->
    <avatarupload :msg.sync="parentMsg" :visible="dialogTableVisible" :dialogVisible="dialogTableVisible" @handleClose="handleClose" @photopath="newphoto"></avatarupload>

    <credit-dialog :creditObj="creditObj" :visible.sync="dialogCreditVisible" :userNo="jobnum" />
    <balance-details :visible.sync="dialogBalanceVisible" />
  </el-card>
</template>

<script>
import request from '@/utils/request';
import { getSumFz } from '@/api/platform/credit/score';
import { rem } from '@/assets/js/rem.js';
import basicinfo from './basicinfo';
import { getToken } from '@/utils/auth';
import avatarupload from './avatarupload';

import { BASE_GATEWAY_API, BASE_PHOTO_API } from '@/api/baseUrl';
import creditDialog from '@/views/platform/widget/components/mycard/dialog';
import balanceDetails from '@/views/platform/widget/components/mycard/dialog/balance_details';
const avatarImgage = require('@/assets/images/mycard/avatar.png');
export default {
  created() {
    this.getInfo();
    this.getuserToken();
  },
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    componInfo: {
      handler(val) {
        // console.log(val, "传入的值来自自定义的信息11118888");
      },
      immediate: true
    }
  },
  components: {
    basicinfo,
    avatarupload,
    creditDialog,
    balanceDetails
  },
  data() {
    return {
      hideCredit: false,
      dialogBalanceVisible: false,
      creditNum: '',
      banancetNum: '10.0',
      creditObj: {},
      dialogCreditVisible: false, //信用分
      dialogTableVisible: false,
      parentMsg: 'test',
      name: '',
      job: '',
      bm: '',
      leader: '',
      photo: '',
      avaphoto: '',
      jobnum: '',
      userid: this.$store.getters.userId,
      options: [
        {
          imgUrl: require('@/assets/images/desktop/banner/banner1.png')
        },
        {
          imgUrl: require('@/assets/images/desktop/banner/banner2.png')
        },
        {
          imgUrl: require('@/assets/images/desktop/banner/banner3.png')
        },
        {
          imgUrl: require('@/assets/images/desktop/banner/image2.png')
        },
        {
          imgUrl: require('@/assets/images/desktop/banner/image4.png')
        }
      ]
    };
  },
  methods: {
    handelBalance() {
      this.dialogBalanceVisible = true;
    },
    handelCredit() {
      this.dialogCreditVisible = true;
    },
    newphoto(val1) {
      this.getInfo();
    },
    getuserToken() {
      getToken();
    },
    dialogVisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
    },
    remmeth() {
      rem();
    },
    getphotoUrl(url) {
      var reg = /http[s]?\:/gi,
        local_url = process.env.VUE_APP_BASE_PHOTO_API,
        default_url = avatarImgage;

      return url ? (reg.test(url) ? url : local_url + url) : default_url;
    },
    getInfo() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: 'user/v3/employee/getSuper?subPid=' + this.userid,
        method: 'get'
      }).then(res => {
        //  console.log("res", res);
        this.name = res.data.user != null ? res.data.user : '暂无数据';
        this.job = res.data.position != null ? res.data.position : '暂无数据';
        this.leader = res.data.superName != null ? res.data.superName : '暂无数据';
        this.jobnum = res.data.userId != null ? res.data.userId : '暂无数据';
        this.bm = res.data.group != null ? res.data.group : '暂无数据';
        // 修改默认图片
        this.photo = this.getphotoUrl(res.data.photo);
        this.avaphoto = res.data.photo;
        getSumFz({ userNo: res.data.userId }).then(result => {
          if (result.data) {
            this.hideCredit = true;
            this.creditNum = result.data.xyzf;
            this.creditObj = result.data;
          }
        });
      });
    }
  },

  mounted() {}
};
</script>

<style lang="scss" scoped>
.mycard {
  background: url('../../../../../assets/images/mycard/mycardbg.png') no-repeat;
  background-size: 100% 100%;
  cursor: default;
}
.myname {
  font-size: 20px;
  font-weight: 700;
}
.edit {
  width: 12px;
  height: 12px;
  margin-left: 12%;
}
.myinfo {
  position: absolute;
  right: 40px;
  top: 10px;
  cursor: pointer;
  img {
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin: 0 auto;
  }
  p {
    margin: 3px 0;
    font-size: 10px;
    text-align: center;
    color: #96989b;
  }
}
.mydetail {
  display: inline-block;
  width: 33%;
  color: #757679;
  font-weight: 550;
  font-size: 14px;
  margin-top: 10px;
}
.myproject {
  display: inline-block;
  width: 35%;
  color: #939598;
  font-size: 14px;
  margin-top: 10px;
  > p {
    white-space: nowrap;
    .blue {
      color: #2d96ff;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  a {
    color: #2d96ff;
    text-decoration: underline !important;
  }
  .bm {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.mycard /deep/ .el-card__body {
  padding: 6% 12% 0 !important;
  overflow: hidden;
}
</style>

