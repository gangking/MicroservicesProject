import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
export default {

    methods: {
        ...mapActions(['copyOutlineTableData', 'flexibleUploadFunc', 'downloadExcelFunc', 'removeOutlineTableFormData']),
        removeMultiOutlineTableData(item) {
            const { target: { multipleSelection, multiline } } = item;
            if (multipleSelection.length < 1) {
                this.$message({
                    type: "info",
                    message: "请选择要删除的项目"
                });
                return;
            }
            this.$confirm("此操作将永久删除数据吗？, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: false
            })
                .then(() => {

                    this.removeOutlineTableFormData({
                        stepVal: multiline.stepVal,
                        outlineTableSelections: multipleSelection
                    }).then(res => {

                        if (res) {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            item.target.LoadTableDefineAndData(0, true);
                        } else {
                            this.$message({
                                type: "error",
                                message: "删除失败"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
            return false;
        },
        copyMultiOutlineTableData(item) {
            const { target: { multipleSelection, multiline } } = item;
            if (multipleSelection.length < 1) {
                this.$message({
                    type: "info",
                    message: "请选择要复制的项目"
                });
                return;
            }
            this.copyOutlineTableData({
                stepVal: multiline.stepVal,
                outlineTableSelections: multipleSelection
            }).then(res => {

                if (res) {
                    this.$message({
                        message: "复制成功",
                        type: "success"
                    });
                    multiline.reloadOutlineTableData(-1, true);
                } else {
                    this.$message({
                        type: "error",
                        message: "复制失败"
                    });
                }
            });
            return false;
        },
        // 灵活上载
        flexibleUpload(val) {
            console.log("灵活上载数据", val, val.file);
            const { target: { multiline } } = val;
            this.flexibleUploadFunc({
                file: val.file,
                stepVal: multiline.stepVal
            }).then(res => {
                console.log("灵活上载结果", res);
                if (res) {

                    if ((res.state = 200)) {
                        this.$message({
                            message: "上传成功",
                            type: "success"
                        });
                        multiline.reloadOutlineTableData(-1, true);
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message ? res.message : "上传失败"
                        });
                    }
                } else {

                    this.$message({
                        type: "error",
                        message: "上传失败"
                    });
                }
            });
            return false;
        },

        // flexibleDownload(val) {
        //     console.log("ls....", val)
        //     val.tabItems = {
        //         label: '灵活下载',
        //         name: "invoice-flexible-download",
        //         componentType: 'invoice-flexible-download',
        //         key: 'invoice-flexible-download',
        //     }
        //     val.openComponentType = 'native'
        //     return val;
        // },
        // 开始灵活下载
        confirmDownload(val) {
            this.downloadExcelFunc(val).then(res => {
                // console.log('灵活下载结果',res)
                if (!res) {
                    this.$message({
                        type: "error",
                        message: "下载失败"
                    });
                }
            });
            return false;
        },
        detailDerivation() {

        }
    },
}