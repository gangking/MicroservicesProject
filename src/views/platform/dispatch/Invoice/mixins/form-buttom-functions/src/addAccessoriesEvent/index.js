import {
    BASE_PHOTO_UPLOAD,
    BASE_PHOTO_PREVIEW,
    BASE_GATEWAY_API

} from "@/api/baseUrl";
import request from '@/utils/request'
import { showLoading, hideLoading } from '@/utils/loading'
import { createNamespacedHelpers, mapGetters as rootGetters } from 'vuex';
export default {
    computed: {
        ...rootGetters(["userId", "userInfo"]),
    },
    methods: {
        addAccessoriesEvent(item) {
            const { buttonName } = item;
            if (this.docNumber) {
                item.tabItems = {
                    label: buttonName,
                    name: "invoice-addAccessoriesEvent",
                    componentType: 'invoice-tab-frame',
                    key: 'invoice-addAccessoriesEvent',
                    closable: true,
                };
                item.value = BASE_PHOTO_UPLOAD +
                    "/#/files/imageCollect?userId=" +
                    this.userId +
                    "&billNo=" +
                    this.docNumber +
                    "&mode=" + (this.taskId ? 1 : 0);
                window.open(item.value)
                //return 
            } else {
                this.$message.error("请先保存单据！");
            }
            return false;
        },

        previewAccessoriesEvent(item) {
            const { buttonName } = item;
            if (this.docNumber) {
                window.open(
                    BASE_PHOTO_PREVIEW +
                    "/open-api/image/showImages?billNo=" +
                    this.docNumber
                );
                return false;
                // item.tabItems = {
                //     label: buttonName,
                //     name: "invoice-previewAccessoriesEvent",
                //     componentType: 'invoice-tab-frame',
                //     key: 'invoice-previewAccessoriesEvent',
                //     closable: true,
                // };
                // item.value = BASE_PHOTO_PREVIEW +
                //     "/open-api/image/showImages?billNo=" +
                //     this.docNumber;
                // return item
            } else {
                this.$message.error("请先保存单据！");
            }
            return false;
        },
        // 影像撤销
        fallbackAccessoriesEvent(item) {
            console.log('影像撤销', this.docNumber)
            if (this.docNumber) {
                showLoading()
                return request({
                    baseURL: BASE_GATEWAY_API,
                    url: "/imageBillCancel/revocation?billNo=" + this.docNumber,
                    method: "get"
                }).then(res => {
                    hideLoading();
                }).catch(req => {
                    hideLoading();
                });
            } else {
                this.$message.error('影像撤销失败，单据号为空。');
            }
            return false;
        },
    },
}