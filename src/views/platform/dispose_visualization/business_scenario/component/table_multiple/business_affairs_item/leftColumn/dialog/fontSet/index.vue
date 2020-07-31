<template>
  <div class="fontBox">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="字体设置">
        <el-select v-model="form.fontStyle" placeholder="请选择">
          <el-option label="微软雅黑" value="微软雅黑"></el-option>
          <el-option label="黑体" value="黑体"></el-option>
          <el-option label="宋体" value="宋体"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字号设置">
        <el-radio-group v-model="form.fontSize">
          <el-radio label="">默认</el-radio>
          <el-radio label="medium">中</el-radio>
          <el-radio label="small">小</el-radio>
          <el-radio label="mini">迷你</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置设置">
        <div class="position">
          <el-radio-group v-model="form.fontPosition">
            <el-radio-button label="left">居左</el-radio-button>
            <el-radio-button label="center">居中</el-radio-button>
            <el-radio-button label="right">居右</el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="颜色设置">
        <div class="color">
          <el-radio-group v-model="form.fontColor">
            <el-radio-button label="#5E6671"><i class="el-icon-check"></i></el-radio-button>
            <el-radio-button label="#649EFF"><i class="el-icon-check"></i></el-radio-button>
            <el-radio-button label="#13CE66"><i class="el-icon-check"></i></el-radio-button>
            <el-radio-button label="#FF4949"><i class="el-icon-check"></i></el-radio-button>
            <el-radio-button label="#FFAA00"><i class="el-icon-check"></i></el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fontStyle: '',
        fontSize: '',
        fontPosition: '',
        fontColor: ''
      }
    };
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form {
  .position {
    .el-radio-group {
      .el-radio-button {
        margin: 0 10px;
        &:first-child {
          margin-left: 0;
        }
        .el-radio-button__inner {
          border-radius: 4px;
          border-left: 1px solid #ccc;
        }
      }
    }
  }
  .color {
    .el-radio-group {
      .el-radio-button {
        border-radius: 4px;
        margin: 0 10px;
        &:first-child {
          margin-left: 0;
          .el-radio-button__inner {
            background-color: #5e6671;
          }
        }
        &:nth-child(2) {
          .el-radio-button__inner {
            background-color: #649eff;
          }
        }
        &:nth-child(3) {
          .el-radio-button__inner {
            background-color: #13ce66;
          }
        }
        &:nth-child(4) {
          .el-radio-button__inner {
            background-color: #ff4949;
          }
        }
        &:nth-child(5) {
          .el-radio-button__inner {
            background-color: #ffaa00;
          }
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          color: white;
        }
        .el-radio-button__inner {
          display: block;
          width: 46px;
          height: 32px;
          text-align: center;
          line-height: 12px;
          border-radius: 0px;
          font-size: 18px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0);
          border-left: 1px solid #ccc;
        }
      }
    }
  }
}
</style>