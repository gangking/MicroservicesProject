<template>
  <div>
    <el-dialog
      title="关联角色对象"
      :visible.sync="dialogVisible"
      class="role_dialog"
      width="70%"
      append-to-body
      @open="openRole"
      @close="closeDialog"
      center
    >
      <div>
        <el-form ref="levelForm" :model="level" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称:" prop="aucode">
                <el-select
                  v-model="roleId"
                  filterable
                  remote
                  width="100%"
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="roleChange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色别名:" prop="roleAlias">
                <!-- <span>{{ level.auname }}</span> -->
                <el-input readonly v-model="roleAlias" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- <div class="role_search">
          <el-button type="primary" plain @click="searchRole">搜索</el-button>
        </div>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleComit">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRole } from "@/api/platform/data_authority/role_empower";
export default {
  name: "role_dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  data() {
    return {
      options: [], //远程搜索结果
      dialogVisible: false,
      loading: false,
      roleName:"",
      roleId: "",
      roleAlias: "",
      level: {
        aucode: "",
        auname: ""
      },
      rules: {
        aucode: [
          { required: false, message: this.$t("validate.required") },
          { trigger: "blur" }
        ],
        auname: [{ required: false, message: this.$t("validate.required") }]
      }
    };
  },
  mounted() {
    //this.getBussition();
  },
  methods: {
    remoteMethod(query) {
      this.getRoleList(query);
    },
    openRole() {
      let emptyText = "";
      this.getRoleList(emptyText);
    },
    getRoleList(val) {
      this.loading = true;

      getRole({
        parameters: [{ key: "Q^NAME_^SL", value: val }],
        requestPage: { pageNo: 1, limit: 10000, totalCount: 1 },
        sorts: []
      })
        .then(response => {
          this.loading = false;
          console.log(response);
          this.copyOption = response.data.dataResult;
          this.options = response.data.dataResult.map(item => {
            return { label: item.name, value: item.id };
          });
        })
        .catch(res => {
          this.options = [];
        });
    },
    /*保存  */
    handleSave() {
      // this.$refs["levelForm"].validate(valid => {
      //   if (valid) {
      //     this.saveData();
      //   } else {
      //     ActionUtils.saveErrorMessage();
      //   }
      // });
    },
    /* 取消 */
    handleCancel() {
      this.diologEmit();
    },
    handleComit() {
      this.diologEmit();
      this.$emit("getRole", this.roleId, this.roleName, this.roleAlias);
    },
    closeDialog() {
      this.diologEmit();
    },
    /* 关闭dialog */
    diologEmit() {
      this.$emit("close", false);
    },
    roleChange(val) {
      this.copyOption.forEach(element => {
        if (element.id == val) {
          
          this.roleAlias = element.roleAlias;
          this.roleName = element.name;
        }
      });
      console.log("al", this.roleAlias);
      this.roleId = val;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.role_search {
  text-align: center;
}
</style>
