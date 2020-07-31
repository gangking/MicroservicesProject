<template>
  <ibps-container-frame :src="pageurl" />
</template>
<script>
import Utils from '@/utils/util';
import store from '@/store'; // 存储
import CryptoJS from 'crypto-js/crypto-js';

const urlParamsFunction = {
  getAdminNameByAES() {
    let userName = store.state.ibps.user.account;
    //return encryptDES(DEFAULT_KEY, DEFAULT_KEY, userName + ',' + new Date().getTime());
    return encryptAES(DEFAULT_KEY, DEFAULT_KEY, userName + ',' + new Date().getTime());
  }
};
const DEFAULT_KEY = '@#$%^6a7';
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
function checkUrlParams(url) {
  let reg = new RegExp('\\{(\\w+)\\}', 'g');
  let macths = url.match(reg);
  if (macths) {
    macths.forEach(item => {
      let str_field = item.substring(1, item.length - 1),
        _callParams = urlParamsFunction[str_field];
      if (_callParams) {
        let _param = Utils.isFunction(_callParams) ? _callParams() : _callParams;
        url = url.replace(new RegExp(escapeRegExp(item), 'g'), _param);
      }
    });
  }

  return url;
}
function encryptDES(key, iv, word) {
  var _word = CryptoJS.enc.Utf8.parse(word),
    _key = CryptoJS.enc.Utf8.parse(key),
    _iv = CryptoJS.enc.Utf8.parse(iv);
  var encrypted = CryptoJS.DES.encrypt(_word, _key, {
    iv: _iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return CryptoJS.enc.Base64.parse(encrypted).toString();
}
function encryptAES(key, iv, word) {
  var _word = CryptoJS.enc.Utf8.parse(word),
    _key = CryptoJS.enc.Utf8.parse(key),
    _iv = CryptoJS.enc.Utf8.parse(iv);
  var encrypted = CryptoJS.AES.encrypt(_word, _key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
}
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.pageurl = checkUrlParams(vm.$route.meta.defaultUrl);
      //console.log('pssssss..1', vm.pageurl);
    });
  },

  data() {
    return {
      pageurl: ''
    };
  }
};
</script>