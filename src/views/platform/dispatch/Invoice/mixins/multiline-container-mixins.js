import {
    BASE_GATEWAY_API,
    BASE_PHOTO_UPLOAD,
    BASE_PHOTO_PREVIEW
} from "@/api/baseUrl";
export default {
    inject: ['payable'],
    computed: {
        docNumber() {
            return this.payable.docNumber
        }
    },
    methods: {
        // 附件预览
        previewAccessoriesEvent(a, b, c, d) {
            if (this.docNumber) {
                this.addTags({
                    label: '附件预览',
                    name: "previewAccessoriesEvent",
                    type: 'multiFormContractPreview',
                    key: 'previewAccessoriesEvent' + (d ? d._uid : ''),
                    tagVal: BASE_PHOTO_UPLOAD + "/open-api/image/showImages?billNo=" + this.docNumber
                });
            } else {
                this.$message.error("请先保存单据！");
            }

        },
        // 资产新建
        assetCreation(a, b, c, d) {
            this.addTags({
                label: '资产新建',
                describe: "资产新建",
                name: "assetCreation",
                type: "assetCreation",

                key: "assetCreation" + (d ? d._uid : '')
            });
        },
        multiFormContractPreview(value, data, c, d) {
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
            if (preConId) {
                this.addTags({
                    name: 'multiFormContractPreview',
                    type: 'multiFormContractPreview',
                    key: 'multiFormContractPreview' + (d ? d._uid : ''),
                    label: '合同预览',
                    tagVal: BASE_PHOTO_PREVIEW + "/open-api/image/showImages?billNo=" + preConId
                })

            } else {
                this.$message.error('提示合同号不能为空');
                // this.$message.error('preConId为空，无法预览合同');
            }
        }
    }

}