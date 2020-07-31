import { showLoading, hideLoading } from "@/utils/loading";
import _ from 'lodash'
export default () => {
  return {
    methods: {
      // 用于切换多行表单和业务类型
      selectBusinessType(val, dataId = null) {
        this.containerType = 'multilineDynamicForm';
        this.manageTabs = {};
        this.tabs = [
          {
            name: 'multilineDynamicForm',
            type: 'multilineDynamicForm',
            key: 'businessType' + Math.random(),
            label: val.showName,
            closable: false,
            btype: val,
            dataId
          }
        ]
      },

      createMultiFormSave(val, data) {
        showLoading();
        return this.multilineSaveFormData({ val, data }).then(res => {
          hideLoading();
          return res;

        })
      },

      // 多行表单保存
      multiFormSave(value, data) {
        // console.log("多行表单保存", value, data);
        showLoading();
        const info = {
          val: value,
          data: data
        };
        return this.multilineSaveFormData(info).then(res => {
          // console.log("表单保存结果返回", res);
          hideLoading();
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.reloadOutlineTableData(0, false, true)
          } else {
            this.$message({
              type: "error",
              message: "保存失败"
            });
          }
          return res;
        });
      },
      // 新增项目
      businessTypeDataCreate(val) {
        this.setBusinessTypeComponents();
      },
      // 点击摘要行
      selectBusinessTypeData(...info) {
        let { ywlxId, id } = info[0];
        console.log("byTypeList:", this.businessData)
        let btypeList = _.values(this.businessData).reduce((total, item) => {
          return total.concat(item);
        }, []);
        
        let currentBtype = {};
        if (btypeList.length>0) {
          currentBtype = btypeList.find((item) => {
            return item.id == ywlxId
          })
        } else {
          currentBtype = {
            id: ywlxId,
            showName: info[0].BC_DESC
          }
        }
        
        this.selectBusinessType(currentBtype, id);
      },
      // 复制项目
      copyMultiOutlineTableData() {
        if (this.outlineTableSelections.length < 1) {
          this.$message({
            type: "info",
            message: "请选择要复制的项目"
          });
          return;
        }
        showLoading();
        this.copyOutlineTableData({
          stepVal: this.stepVal,
          outlineTableSelections: this.outlineTableSelections
        }).then(res => {
          // console.log("复制是否成功", res);
          hideLoading();
          if (res) {
            this.$message({
              message: "复制成功",
              type: "success"
            });
            this.reloadOutlineTableData(-1, true);
          } else {
            this.$message({
              type: "error",
              message: "复制失败"
            });
          }
        });
      },
      // 删除项目
      removeMultiOutlineTableData() {
        if (this.outlineTableSelections.length < 1) {
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
            showLoading();
            this.removeOutlineTableFormData({
              stepVal: this.stepVal,
              outlineTableSelections: this.outlineTableSelections
            }).then(res => {
              hideLoading();
              if (res) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.reloadOutlineTableData(0, true);
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
      },
      // 灵活上载
      flexibleUpload(val) {
        console.log("灵活上载数据", val, val.file);
        this.flexibleUploadFunc({
          file: val.file,
          stepVal: this.stepVal
        }).then(res => {
          console.log("灵活上载结果", res);
          if (res) {
            hideLoading();
            if ((res.state = 200)) {
              this.$message({
                message: "上传成功",
                type: "success"
              });
              // 刷新摘要表
              this.updateFlag = this.updateFlag ? false : true;
            } else {
              this.$message({
                type: "error",
                message: res.message ? res.message : "上传失败"
              });
            }
          } else {
            hideLoading();
            this.$message({
              type: "error",
              message: "上传失败"
            });
          }
        });
      },
      // 灵活下载
      flexibleDownload(val) {
        console.log("灵活下载", val);
        // 打开下载弹窗
        this.dialogflexible = true;
      },
      // 开始灵活下载
      confirmDownload(val) {
        // console.log('开始灵活下载',val)
        showLoading();
        this.downloadExcelFunc(val).then(res => {
          hideLoading();
          // console.log('灵活下载结果',res)
          if (!res) {
            this.$message({
              type: "error",
              message: "下载失败"
            });
          }
        });
      }
    }
  };
};
