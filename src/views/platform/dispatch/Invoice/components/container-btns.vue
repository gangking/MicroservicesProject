<template>
  <el-row class="elrow">
    <el-col v-if="computedLeft.length > 0" :span="spanbtn">
      <div class="btnList">
        <span v-for="(val, key) in leftBtnsList" :key="key">
          <el-button v-if="val.buttonName != '灵活上载'" :type="val.styleType" size="mini" :plain="getIsPlain(val)" @click="onButtonClick(val)">
            <i :class="'iconfont icon-'+val.buttonIcon " />
            {{ val.buttonName }}
          </el-button>
          <el-upload v-else class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :before-upload="handleChange" :http-request="httpRequest" :on-success="handleSuccess(val)" :on-error="handleError" :file-list="fileList" :multiple="false" accept=".xls,.xlsx" :show-file-list="false">
            <el-button :type="val.styleType" size="mini" :plain="getIsPlain(val)" @click="uploadBtn = val">
              <i :class="'iconfont icon-'+val.buttonIcon " />
              {{val.buttonName}}
            </el-button>
          </el-upload>
        </span>
        <span v-if="leftMoreBtns.length > 0">
          <el-dropdown trigger="click" @command="onButtonClickDropdown">
            <span class="el-dropdown-link">
              <i class="'iconfont icon-uniE1D3" />
              更多处理
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in leftMoreBtns" :key="index" :command="item" :icon="'iconfont icon-'+item.buttonIcon">{{ item.buttonName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </el-col>

    <el-col v-if="computedRight.length > 0 " :span="spanbtn">
      <div class="btn-col">
        <span v-if="rightMoreBtns.length > 0">
          <el-dropdown trigger="click" @command="onButtonClickDropdown">
            <span class="el-dropdown-link">
              <i class="'iconfont icon-uniE1D4" />
              更多意见
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in rightMoreBtns" :key="index" :command="item" :icon="'iconfont icon-'+item.buttonIcon">{{ item.buttonName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span v-for="(val, key) in rightBtnsList" :key="key">
          <el-button v-if="(val.buttonName != '显示例外')" :type="val.styleType" :plain="getIsPlain(val)" size="mini" @click="onButtonClick(val)">
            <i :class="'iconfont icon-'+val.buttonIcon " />
            {{ val.buttonName }}
          </el-button>
          <!-- 显示例外按钮 -->
          <span v-else-if="val.buttonName == '显示例外' && (!val.btnlist)" class="liWai">
            <el-badge v-if="val.buttonName == '显示例外'" :value="formExceptionsCount" class="item">
              <el-button :type="val.styleType" size="mini" @click="onButtonClick(val)">
                <i :class="'iconfont icon-'+val.buttonIcon " />
                {{ val.buttonName }}
              </el-button>
            </el-badge>
          </span>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeBase');
const filterData = ['审计线索', '询问'];
import { uploadFile, remove } from '@/api/platform/file/avatarupload';
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  name: 'container-btus',

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    rightBtns: {
      type: Array,
      default() {
        return [];
      }
    },
    footer: {
      type: String,
      default: 'no'
    }
  },
  data() {
    return {
      leftbtnList: [],
      rightbtnList: [],
      fileList: [], // 上传文件列表
      uploadBtn: {} // 上传按钮信息
    };
  },
  computed: {
    ...mapState(['formExceptionsCount']),
    spanbtn() {
      return this.computedRight.length > 0 && this.computedLeft.length > 0 ? 12 : 24;
    },
    computedRight() {
      return [
        ...this.rightBtns.slice(0, 1),
        ...this.data
          .filter(item => {
            return filterData.includes(item.buttonName);
          })
          .reverse(),
        ...this.rightBtns.slice(1)
      ];
    },

    computedLeft() {
      // console.log('按钮的长度:', this.data.length, this.data)
      return this.data.filter(item => {
        return !filterData.includes(item.buttonName);
      });
    },

    leftBtnsList() {
      return this.computedLeft.slice(0, this.computedLeft.length > 6 ? 5 : 6);
    },
    leftMoreBtns() {
      return this.computedLeft.slice(this.computedLeft.length > 6 ? 5 : 6);
    },

    reverseRightBtns() {
      return this.computedRight.reverse();
    },
    rightBtnsList() {
      return this.reverseRightBtns.slice(0, this.reverseRightBtns.length > 6 ? 5 : 6);
    },
    rightMoreBtns() {
      return this.reverseRightBtns.slice(this.reverseRightBtns.length > 6 ? 5 : 6);
    }
  },

  methods: {
    // 点击上传文件之前
    handleChange(file) {
      console.log('点击上传文件之前', file);
      showLoading();
      // this.fileList = fileList.slice(-3);
    },
    /**
     * 文件上传
     */
    httpRequest(options) {
      return uploadFile(options.file, {});
    },
    // 上传成功
    handleSuccess(val) {
      return (response, file, fileList) => {
        //console.log('上载成功了....');
        hideLoading();
        const { bindFunction: action } = val;
        val.file = file.raw;
        this.$emit('click', action, val);
      };
      // console.log('上传按钮信息', this.uploadBtn);
      // hideLoading();
    },
    // 上传失败
    handleError(err, file, fileList) {
      console.log('上传失败', err, file, fileList);
      this.$message.error('上传失败');
      hideLoading();
    },
    onButtonClick(val) {
      const { bindFunction: action } = val;
      console.log('点击按钮1', action, val);
      this.$emit('click', action, val);
    },
    onButtonClickDropdown(val) {
      this.onButtonClick(val);
    },
    getIsPlain(val) {
      const { stylePlain } = val;
      // console.log("buttonPlain === '1'", buttonPlain + '' == '1', buttonPlain, val)
      return String(stylePlain) == '1';
    }
  }
};
</script>

<style lang="scss" scoped>
.elbadge-container {
  .el-badge__content.is-fixed {
    position: absolute;
    top: 10px;
    right: 22px;
  }
}

.btn-col {
  //padding-right: 5px;
  text-align: right;
  span {
    // display: inline-block;
    //float: left;
    margin-right: 5px;
  }
  /deep/ .el-dropdown {
    display: inline-block;
    width: 80px;
    height: 22px;
    line-height: 24px;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    position: relative;
    .el-icon-paperclip {
      display: inline-block;
      width: 12px;
      height: 12px;
      font-size: 12px;
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
    .el-dropdown-link {
      color: #409eff !important;
      //   margin-right: 0px;
      float: none;
      padding-left: 18px;
      i {
        position: absolute;
        top: 5px;
        left: 5px;
      }
    }
    &:hover {
      background: #409eff;
      .el-dropdown-link {
        color: white !important;
      }
    }
  }
  .btnStyleTwo {
    /deep/ .el-button--mini {
      border: 0;
      background: white;
      color: black;
      i {
        color: #f56c6c;
      }
      &:hover {
        color: #f56c6c;
      }
    }
  }
  .liWai {
    /deep/ .el-button {
      border: 0;
      &:hover {
        background-color: white;
        color: red;
      }
      &:focus {
        color: black;
        background-color: white;
      }
      &:active {
        color: black;
        background-color: white;
      }
    }
    i {
      color: red;
    }
    /deep/ .el-badge__content {
      top: 2px;
      right: 12px;
    }
  }
  /deep/ .el-button--mini {
    width: 80px;
    height: 24px;
    position: relative;
    text-align: center;
    line-height: 7px;
    span {
      height: 13px;
      padding-left: 10px;
      i {
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 2px;
      }
    }
  }
}

.liwai-btn {
  padding-right: 1px;
  border: none;
  width: 82px;
  padding-left: 0px;
  text-align: center;
}

.vux-badge {
  position: absolute;
}

.elrow {
  // margin-top: 20px;
  // margin-left: 20px;
  display: flex;
  justify-content: space-around;
}

.elrow i {
  vertical-align: text-bottom;
  margin-right: 4px;
}

.btnList {
  margin-left: 5px;
  height: 100%;
  span {
    // display: inline-block;
    float: left;
    margin-right: 5px;
  }
  .dropdownSpan {
    width: 80px;
    height: 100%;
    position: relative;
  }
  /deep/ .el-dropdown {
    display: inline-block;
    width: 80px;
    height: 22px;
    line-height: 24px;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    position: absolute;
    top: 50%;
    margin-top: -12.5px;
    .el-icon-paperclip {
      display: inline-block;
      width: 12px;
      height: 12px;
      font-size: 12px;
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
    .el-dropdown-link {
      color: #409eff !important;
      //   margin-right: 0px;
      float: none;
      padding-left: 18px;
      i {
        position: absolute;
        top: 5px;
        left: 5px;
      }
    }
    &:hover {
      background: #409eff;
      .el-dropdown-link {
        color: white !important;
      }
    }
  }
  /deep/ .el-button--mini {
    padding: 4px;
    width: 80px;
    height: 24px;
    position: relative;
    box-sizing: border-box;
    span {
      height: 13px;
      padding-left: 10px;
      i {
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 2px;
      }
    }
  }
}

/deep/ .elrow i {
  display: inline-block;
  width: 7px;
  height: 11px;
  font-size: 12px;
}

/deep/ .el-dialog__header {
  //   display: none;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
