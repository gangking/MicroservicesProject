
import Model from 'js-model'
import default_sany_logo from '@/assets/sany/images/sany-logo.png' //文思logo
// import default_sany_logo from '@/assets/sany/images/sany-logo3.png' //国网logo
// import default_sany_logo from '@/assets/sany/images/sany-logo2.png'

import default_sany_photo from '@/assets/sany/images/head-logo.png'  
import default_sany_QRCode from '@/assets/sany/images/QRCode.png'

const flowHeadInfoModel = new Model({
    logo: {
        type: String,
        default: default_sany_logo
    },
    // name: '往来核销单',
    name: '',
    // 二维码
    // qrCode: {
    //     type: String,
    //     default: default_sany_QRCode
    // },
    homeUserPo: {

        // 用户名
        name: {
            type: String
            // default: '游客'
        },
        // 部门
        group: {
            type: String
            // default: '企业财务'
        },
        // 岗位
        position: {
            type: String,
            // default: '泵送事业部'
            default: ''
        },
        // 头像
        photo: {
            type: String,
            default: default_sany_photo
        },
        // 中间标题
        midInfo: {
            type: String
            // default: '往来核销单'
        }
    }
})
export default flowHeadInfoModel
