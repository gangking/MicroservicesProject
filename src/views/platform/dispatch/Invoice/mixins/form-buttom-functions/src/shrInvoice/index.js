import CryptoJS from 'crypto-js/crypto-js';
import store from '@/store'; // 存储
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeSingle');

const DEFAULT_KEY = '@#$%^6a7';
function getAdminNameByAES() {
    let userName = store.state.ibps.user.account;
    return encryptAES(DEFAULT_KEY, DEFAULT_KEY, userName + ',' + new Date().getTime());
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
    computed: {
        ...mapState(['current_final_form_data']),
    },
    methods: {
        getRrturnUrl(title) {
            let obj = {
                BX: "rpt_rep_fi_query_link",
                JK: "rpt_csh_fi_query_link",
                FK: "rpt_acp_fi_query_link"
            }
            return obj[title];
        },
        //SHR单号
        shrDoc(message) {
            let shrId = this.current_final_form_data.SHR_NEX
            let shrNo = this.current_final_form_data.SHR_NUB
            if (shrId && shrNo) {
                const url = `http://shr.sany.com.cn:6890/emsPrint/shr/loginhr.jsp?billID=${shrId}&billNO=${shrNo}`
                window.open(url);
            } else {
                this.$message({
                    message: '缺少SHR编号或SHRId',
                    type: 'warning'
                });
            }
            return false;
        },
        //SHR附件
        shrEnclosure(message) {
            let shrId = this.current_final_form_data.SHR_NEX
            if (shrId) {
                const url = `http://shr.sany.com.cn:6890/emsPrint/shr/emsAttachment.jsp?billId=${shrId}`
                window.open(url);
            } else {
                this.$message({
                    message: '缺少SHRId',
                    type: 'warning'
                });
            }
            return false;
        },
        //ems单据
        emsBill() {
            const sso_token = getAdminNameByAES();
            console.log("current_final_form_data", this.current_final_form_data)
            let return_url = this.getRrturnUrl(this.current_final_form_data.DOC_NUMBER.slice(0, 2))
            let doc_id = this.current_final_form_data.DOC_ID
            if (sso_token && sso_token !== 'undefined' && doc_id) {
                const url = `http://nems.sany.com.cn/newems/sso_login.screen?sso_token=${sso_token}&return_url=${return_url}&source_sys=fssc&doc_id=${doc_id}`
                window.open(url);
            } else {
                this.$message({
                    message: '缺少单据id',
                    type: 'warning'
                });
            }
            return false;
        },

    },
}