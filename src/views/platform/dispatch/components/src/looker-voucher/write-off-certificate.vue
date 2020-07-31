<template>
  <el-dialog v-loading="loading" title="冲销凭证" :visible.sync="isflag" width="50%" append-to-body :before-close="handleClose">
    <div>
      <div class="main" ref="main">
        <el-form :model="form" ref="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="单据编号" :label-width="formLabelWidth">
                <el-input v-model="form.seqno" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="凭证编号" :label-width="formLabelWidth">
                <el-input style="width: 100%;" v-model="form.belnr" auto-complete="off" :disabled="true" class="input"></el-input>
                <!-- <el-select v-model="offVoucherNum" multiple clearable filterable  @change="currentOffVoucherNum">
                  <el-option v-for="(item,index) in form.belnr" :key="index" :label="item" :value="item"></el-option>
                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="过账期间" :label-width="formLabelWidth" prop="monat">
                <el-date-picker type="month" v-model="form.monat" style="width: 100%;" value-format="yyyy-MM"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="过账日期" :label-width="formLabelWidth" prop="budat">
                <el-date-picker type="date" v-model="form.budat" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="公司代码" :label-width="formLabelWidth" prop="bukrs">
                <el-input v-model="form.bukrs" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="冲销原因" :label-width="formLabelWidth" prop="writeOffReason">
                <el-select v-model="writeOffReason" @change="currentReason">
                  <el-option v-for="item in form.stgrd" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="消息类型" :label-width="formLabelWidth">
                <el-input v-model="form.messageType" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="消息文本" :label-width="formLabelWidth">
                <el-input v-model="form.messageText" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="单据编号" :label-width="formLabelWidth" prop="seqno">
                <el-input v-model="form.seqno" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="冲销凭证编号" :label-width="formLabelWidth">
                <el-input v-model="form.reNumber" auto-complete="off" :disabled="true" class="input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import util from '@/utils/util';
import {
  checkVoucherData,
  checkWriteOffCertData
} from '@/api/platform/invoice/writeOffCertificate';

export default {
  name: 'write-off-certificate',
  props: {
    isflag: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    isflag(val) {
      this.isDialogWriteOffCert = val;
      if (val) {
        this.onload();
        this.getNowTime();
        this.getNowMonth();
      }
      immediate: true;
    }
  },
  data() {
    return {
      isDialogWriteOffCert: false,
      formLabelWidth: '120px',
      loading: false,
      form: {
        seqno: '', // 单据编号
        belnr: '', // 凭证编号
        monat: '', // 过账期间
        budat: '', // 过账日期
        stgrd: [
          // 冲销原因
          {
            name: '01当前期间回转',
            value: '01'
          },
          {
            name: '02关闭期间回转',
            value: '02'
          },
          {
            name: '03当前期间的实际回转',
            value: '03'
          },
          {
            name: '04关闭期间实际回转',
            value: '04'
          },
          {
            name: '05应计/递延过账',
            value: '05'
          }
        ], // 冲销原因
        reNumber: '', // 冲销凭证编号
        bukrs: '', // 公司代码
        messageType: '',
        messageText: '',
        gjahs: '' // 公司年份
      },
      // offVoucherNum: "",
      writeOffReason: '',
      rules: {
        bukrs: [{ required: true, message: '公司代码', trigger: 'blur' }],
        stgrd: [{ required: true, message: '请填写冲销原因', trigger: 'blur' }],
        seqno: [{ required: true, message: '流水号（单据号码）', trigger: 'blur' }],
        belnr: [{ required: true, message: '凭证编号', trigger: 'blur' }],
        monat: [{ required: true, message: '过帐期间', trigger: 'blur' }],
        budat: [{ required: true, message: '过帐日期', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.writeOffReason = this.form.stgrd[0].value;
  },
  methods: {
    currentReason() {
      console.log(this.writeOffReason);
    },
    // clearDefault() {
    //   for (const key in this.form) {
    //     if (this.form.hasOwnProperty(key)) {
    //       this.$set(this.form, key, "");
    //     }
    //   }
    // },
    onload() {
      // 获取弹窗的表单信息数据
      this.loading = true;
      // this.clearDefault();
      checkVoucherData({
        instId: this.$store.state.ibps.compositeBase.instId || ''
        // instId: "656062410100047872" // 707609570192654336
      })
        .then(res => {
          this.loading = false;
          if (res.state === 200) {
            // console.log('查询接口数据gjahs',res.data)
            this.form.seqno = res.data.seqno || ''; // 单据编号
            // if(typeof(res.data.belnr)=='string'){
            //   this.form.belnr.push(res.data.belnr)
            // }else {

            //   this.form.belnr = []; // 凭证编号
            // }

            this.form.belnr = res.data.belnr || ''; // 凭证编号
            this.form.reNumber = res.data.reNumber || ''; // 冲销凭证编号
            this.form.bukrs = res.data.bukrs || ''; // 公司代码
            this.form.gjahs = res.data.gjahs || ''; // 公司年份

            // this.form.messageType = res.state || "";
            // this.form.messageText = res.message || "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取今天的月份
    getNowMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      month = month + 1;
      month = month.toString().padStart(2, '0');
      let defaultMonth = `${year}-${month}`;
      this.$set(this.form, 'monat', defaultMonth);
    },
    // 获取今天的日期
    getNowTime() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth();
      let date = now.getDate();
      month = month + 1;
      month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      let defaultDate = `${year}-${month}-${date}`;
      this.$set(this.form, 'budat', defaultDate);
    },
    handleClose() {
      this.isDialogWriteOffCert = false;
      this.$emit('closeWriteOffCertificate', false);
    },
    // 获取所有信息
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          checkWriteOffCertData({
            bukrs: this.form.bukrs,
            stgrd: this.writeOffReason,
            seqno: this.form.seqno,
            belnr: this.form.belnr,
            monat: this.form.monat.split('-')[1],
            budat: this.form.budat,
            gjahs: this.form.gjahs
          }).then(response => {
            console.log('冲销凭证', response);
            this.isDialogWriteOffCert = false;
            this.$emit('closeWriteOffCertificate', false);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: center;
  button {
    margin: 0 10px;
  }
}
</style>
