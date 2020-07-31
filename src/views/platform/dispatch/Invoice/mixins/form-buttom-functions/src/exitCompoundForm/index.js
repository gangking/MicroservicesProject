import { createNamespacedHelpers, mapGetters as rootMapGetters } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeDolog');
const { mapGetters: baseMapGetters, mapState: baseMapState, mapActions: baseMapActions } = createNamespacedHelpers('ibps/compositeBase');
const { mapActions: multiMapAction } = createNamespacedHelpers('ibps/compositeMultiline');
const { mapActions: singleMapAction, mapState: singleMapState } = createNamespacedHelpers('ibps/compositeSingle');
import {
    BASE_GATEWAY_API,
    BASE_PHOTO_UPLOAD,
    BASE_PHOTO_PREVIEW
} from "@/api/baseUrl";
import request from "@/utils/request";

export default {
    inject: ['outerSkin'],
    computed: {
        ...mapGetters(['isHasFormExceptions']),
        ...baseMapGetters(['businessSceneName', 'businessSceneId']),
        ...rootMapGetters(['userInfo']),
        ...baseMapState(['tableHeaderId']),
        ...singleMapState(['current_tag_form_data'])

    },
    methods: {
        ...singleMapAction({
            'saveSingleFormData': 'saveFormData'
        }),

        ...mapActions(['getFormException']),
        ...multiMapAction(['multilineProcessSubmit']),
        ...baseMapActions(['getProcessInfo']),
        exitCompoundForm() {
            this.$confirm("您确定退出当前表单吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.outerSkin.handleClose();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消退出提示"
                    });
                });
            return false
        },

        onSingleFormButtonSave(item) {
            const { args: [value, data], target: { stepVal } } = item;
            console.log("保存单行表单", value, data, stepVal)
            return this.saveSingleFormData({ value, data, stepVal })
        },

        uploadWorkForm() {
            const { formData: { CONTRACTNO: contract_id }, formData } = this.current_tag_form_data;
            //获取appId 为SCFM01_BS0开头传合同号id
            var billNoTemp = "";
            var conStr = this.appId.slice(0, 10);
            //console.log(`this.appId--`, this.current_tag_form_data);
            if (conStr === "SCFM01_BS0") {
                billNoTemp = contract_id;
            } else if (this.docNumber) {
                billNoTemp = this.docNumber;
            }
            // console.log(`this.contract_id--`,this.contract_id);
            const uploadData = {
                billNo: billNoTemp,
                type: "01",
                source: "FSSC",
                businessTypeCode: "01",
                businessTypeName: "01",
                billTypeCode: this.businessSceneId,
                billTypeName: this.businessSceneName,
                singleName: this.userInfo.user.fullname,
                singleCode: this.userInfo.user.id,
                companyName: formData.BUTXT,
                companyCode: formData.BUKRS
            };

            return request({
                baseURL: BASE_GATEWAY_API,
                url: "/uploadimagebill/submit",
                method: "post",
                data: uploadData
            });


        },

        pushCompoundForm(val) {
            return (new Promise((resolve, reject) => {
                this.uploadWorkForm();
                return this.multilineProcessSubmit(val).then(res => {
                    const { state, message, cause } = res;
                    // console.log("sfdfdsf")
                    if (state == 500) {
                        this.$message({
                            message: res.cause,
                            type: "error"
                        });
                        return reject(res);
                    }
                    resolve(res);
                });
            })).then(({ state }) => {
                console.log('我感觉有点小奇怪')
                this.ibpsPayable.$emit("process-event", "multilineProcessSubmit");
                this.outerSkin.handleClose();
                this.$message({
                    message: "提交成功",
                    type: "success"
                });
            });
        },

        //重置提交表单
        resetPushForm({ buttonCode }) {
            /*  {"appId":"SCTX01_BS02_633254482108481536","instId":"642283623889764352","taskId":"642283786897195009","status":"approverProcess","bsiCode":"BSI02","buttonCode":"B0022","headId":"642283621578702848","opinion":"重新提交","actionName":"agree"} */

            const params = {
                buttonCode,
                headId: this.tableHeaderId,
                processParams: {
                    opinion: "重新提交",
                    actionName: "agree"
                }
            };
            return this.getProcessInfo(params).then(() => {
                this.ibpsPayable.$emit("process-event", "multilineProcessSubmit");
                this.outerSkin.handleClose();
                this.$message({
                    message: "提交成功",
                    type: "success"
                });
            });
        }

    },
}