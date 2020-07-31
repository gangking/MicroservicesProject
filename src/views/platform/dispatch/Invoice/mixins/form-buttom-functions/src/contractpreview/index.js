import {
    BASE_GATEWAY_API,
    BASE_PHOTO_UPLOAD,
    BASE_PHOTO_PREVIEW,
    COMP_URL
} from "@/api/baseUrl";

import { createNamespacedHelpers, mapGetters as rootGetters } from 'vuex';
const { mapActions: singleMapAction, mapGetters, mapState } = createNamespacedHelpers('ibps/compositeSingle');

export default {
    computed: {
        ...mapState({ 'singleFormData': 'current_tag_form_data' }),

        ...rootGetters(["userId", "userInfo"]),

    },
    methods: {
        //...singleMapAction(['changeContractSubmit']),
        // 合同预览
        contractpreview(item) {
            const { buttonName } = item;
            const { formData } = this.singleFormData
            let {
                CONTRACTNO = null,
                CONTRACT_NO = null,
                CONTRACTNUM,
                SOURCE_SYSTEM
            } = formData;
            var preConId = SOURCE_SYSTEM == 'GSP' ? CONTRACTNUM : (CONTRACTNO || CONTRACT_NO);
            if (preConId) {
                item.tabItems = {
                    label: buttonName,
                    name: "invoice-multi-form-contract-preview",
                    componentType: 'invoice-tab-frame',
                    key: 'invoice-multi-form-contract-preview',
                    closable: true,
                };

                item.value = BASE_PHOTO_PREVIEW + "/open-api/image/showImages?billNo=" + preConId;

                window.open(item.value);
                // return item;
            } else {
                this.$message.error('提示合同号不能为空');
                // this.$message.error('preConId为空，无法预览合同');
            }
            return false;
        },

        // 变更合同
        changeInformation(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-multi-form-form-contract",
                componentType: 'invoice-form-contract',
                key: 'invoice-multi-form-form-contract',
                closable: true,
            };
            item.openComponentType = "native"
            return item;
        },

        multiFormContractPreview(item) {
            const { args: [value, data], buttonName } = item;
            let {
                CONTRACTNO = null,
                CONTRACT_NO = null,
                CONTRACTNUM,
                SOURCE_SYSTEM
            } = value;

            var preConId = SOURCE_SYSTEM == 'GSP' ? CONTRACTNUM : (CONTRACTNO || CONTRACT_NO);
            /*  describe: "合同预览",
             tabEnhance: "contractpreview",
             tagVal: BASE_PHOTO_PREVIEW + "/#/imageDetailOut?billNo=" + preConId */
            //    console.log("合同预览...:", value, preConId)
            if (preConId) {
                item.tabItems = {
                    label: buttonName,
                    name: "invoice-multi-form-contract-multiFormContractPreview",
                    componentType: 'invoice-tab-frame',
                    key: 'invoice-multi-form-contract-multiFormContractPreview',
                    closable: true,
                };
                item.value = BASE_PHOTO_PREVIEW + "/open-api/image/showImages?billNo=" + preConId;

                window.open(item.value);


            } else {
                this.$message.error('提示合同号不能为空');
                // this.$message.error('preConId为空，无法预览合同');
            }
            return false;
        },
        // 添加合同
        cmupdatingfiles(item) {
            const { buttonName } = item;
            // var addconId = this.current_tag_form_data.formData.CONTRACTNO;
            const { formData } = this.singleFormData
            let {
                CONTRACTNO = null,
                CONTRACT_NO = null,
                CONTRACTNUM,
                SOURCE_SYSTEM
            } = formData;

            var addconId = SOURCE_SYSTEM == 'GSP' ? CONTRACTNUM : (CONTRACTNO || CONTRACT_NO);
            if (addconId) {

                item.tabItems = {
                    label: buttonName,
                    name: "invoice-multi-form-contract-cmupdatingfiles",
                    componentType: 'invoice-tab-frame',
                    key: 'invoice-multi-form-contract-cmupdatingfiles',
                    closable: true,
                };
                item.value = BASE_PHOTO_UPLOAD +
                    "/#/files/imageCollect?userId=" +
                    this.userId +
                    "&billNo=" +
                    addconId
                window.open(item.value);
                //  return item;
            } else {
                this.$message.error("请先保存单据！");
            }
            return false
        },
    },
}