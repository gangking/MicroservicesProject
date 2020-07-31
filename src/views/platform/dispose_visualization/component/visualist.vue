<template>
  <div class="visuaList">
    <ul class="list">
      <li class="add" @click="addVisual">
        <i class="el-icon-plus"></i>
      </li>
      <li v-for="(item,index) in list" :key="index">
        <div class="name">
          {{item.bsDescribe}}
          <br />
          {{item.bsCode}}
        </div>
        <i class="symbol-icon ibps-icon-table" @click="viewDetails(item)"></i>
        <div class="setting">
          <!-- <i class="ibps-icon-cog el-dropdown-selfdefine"></i> -->
          <el-dropdown @command="editOrDeleteVisual">
            <span class="el-dropdown-link">
              <i class="ibps-icon-cog el-dropdown-selfdefine"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" :command="{type:'编辑',item}">编辑</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" :command="{type:'删除',item}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
    </ul>

    <!-- 新增业务场景 -->
    <el-dialog title="创建业务场景" top="5vh" :visible.sync="dialogVisible" width="60%">
      <div class="div" style="height: 380px;padding: 0 10px;box-sizing: border-box;overflow: hidden;}">
        <el-form :model="sceneForm" label-position="top" :rules="rules" ref="sceneForm" label-width="130px" class="demo-sceneForm">
          <el-form-item label="业务场景编码" prop="sceneCode">
            <el-input v-model="sceneForm.sceneCode"></el-input>
          </el-form-item>
          <el-form-item label="业务场景描述" prop="sceneDesc">
            <el-input v-model="sceneForm.sceneDesc"></el-input>
          </el-form-item>
          <el-form-item label="业务对象" prop="sceneObj">
            <div class="sceneObjBox">
              <div class="newSelect" @click="innerVisible=true">
                <el-tag @close="closeScenario(item)" v-for="item in sceneForm.sceneObj" :key="item.code" closable :type="item.code">
                  {{item.name}}
                </el-tag>
              </div>
              <!-- <el-select @focus="innerVisible=true" multiple v-model="sceneForm.sceneObj" placeholder="请选择业务对象">
              <el-option v-for="(item) in sceneObjList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select> -->
            </div>
          </el-form-item>
          <el-form-item label="服务目录分类" prop="serviceDirecClass">
            <div class="sceneObjBox">
              <el-select @focus="innerVisibleTwo=true" multiple v-model="sceneForm.serviceDirecClass" placeholder="请选择服务目录分类">
                <el-option v-for="(item) in serviceDirecClassList" :key="item.typeKey" :label="item.name" :value="item.typeKey"></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFunc('sceneForm')">取 消</el-button>
        <el-button type="primary" @click="confirmFunc('sceneForm')">确 定</el-button>
      </span>
      <el-dialog width="30%" title="请选择服务目录分类" :visible.sync="innerVisibleTwo" append-to-body>
        <div class="treeBox" style="height:300px;overflow:auto;">
          <serviceDirecTree :treeData="treeData" :treeOptions="treeOptions" @handleNodeClick="handleNodeClick" />
        </div>

      </el-dialog>

      <el-dialog width="65%" title="选择业务对象" top="5vh" :visible.sync="innerVisible" append-to-body @close="userclose">
        <scenarioList :flag="innerVisible" :bsaList="sceneForm.sceneObj" @activeSceneObj="activeSceneObj" @userclose="userclose" />
      </el-dialog>

      <!-- <dialogComponent :visible="innerVisible" title="业务对象选择器" @action-event="activeSceneObj" @close="innerVisible=false" /> -->
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'ibps/frontVisualizations'
);
import scenarioList from './scenario';
import dialogComponent from '@/business/platform/bo/def/dialog.vue';
import serviceDirecTree from './serviceDirecTree';
import TreeUtils from '@/utils/tree';
export default {
  components: {
    dialogComponent,
    serviceDirecTree,
    scenarioList
  },
  props: {
    sceneDescProps: {
      type: String,
      default: ''
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    sceneIdProps: {
      type: String,
      default: ''
    }
  },
  computed: {
    treeData() {
      if (!this.serviceDirecClassArry || this.serviceDirecClassArry.length === 0) return [];
      return TreeUtils.transformToArrayFormat(
        JSON.parse(JSON.stringify(this.serviceDirecClassArry)),
        {
          idKey: this.treeOptions['node-key'],
          pIdKey: this.pidKey,
          childrenKey: this.treeOptions['props']['children']
        }
      );
    },
    treeOptions() {
      const defaultOptions = {
        rootPId: null,
        'node-key': 'id',
        'pid-key': 'parentId',
        'default-expand-all': false,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name'
        }
      };
      return Object.assign(defaultOptions, this.options);
    },
    pidKey() {
      return this.treeOptions['pid-key'];
    }
  },
  data() {
    return {
      list: [],
      dialogVisible: false, // 是否弹窗
      dialogTitle: '创建业务场景', // 编辑业务场景
      sceneId: '', // 业务场景主键
      // 业务场景弹窗数据
      sceneForm: {
        sceneCode: '', // 业务场景编码
        sceneDesc: '', // 业务场景名称
        sceneObj: [], // 业务对象
        serviceDirecClass: [] // 服务目录分类
      },
      rules: {
        sceneDesc: [{ required: true, message: '请输入业务场景名称', trigger: 'blur' }],
        sceneCode: [{ required: true, message: '请输入业务场景编码', trigger: 'blur' }],
        sceneObj: [{ required: true, message: '请选择业务对象', trigger: 'blur' }],
        serviceDirecClass: [{ required: true, message: '请选择服务目录分类', trigger: 'blur' }]
      },
      sceneObjList: [], // 业务对象列表
      innerVisible: false, // 业务对象弹窗标识
      serviceDirecClassArry: [], // 服务目录分类列表
      serviceDirecClassList: [], // 服务目录分类列表
      innerVisibleTwo: false // 业务对象弹窗标识
    };
  },
  watch: {
    isSearch() {
      this.getQueryPageList({
        desc: this.sceneDescProps,
        key: this.sceneIdProps
      });
    }
  },
  created() {
    // this.list = require('./list.json').list;
    this.onload();
  },
  methods: {
    ...mapActions([
      'queryPageList',
      'findTreeDataType',
      'businessObjectFunc',
      'businessPageSave',
      'businessPageRemove'
    ]),
    onload() {
      this.getQueryPageList({
        desc: '',
        key: ''
      });
      // 获取服务目录分类
      this.findTreeDataType().then(res => {
        this.serviceDirecClassArry = res;
      });
    },
    // 选中服务目录
    handleNodeClick(data) {
      console.log('选中的选中服务目录', data);
      if (data.name != '服务目录') {
        this.innerVisibleTwo = false;
        this.serviceDirecClassList = [data];
        this.sceneForm.serviceDirecClass = [data];
      }
    },
    // 选中的业务对象
    activeSceneObj(data) {
      console.log('选中的业务对象', data);
      if (data.length == 1) {
        this.sceneObjList = data;
        this.sceneForm.sceneObj = data;
        this.userclose();
      } else {
        this.$message.error('仅支持选择一个业务对象。');
      }
    },
    userclose() {
      this.innerVisible = false;
    },
    // 清除单个业务对象
    closeScenario(info) {
      var arry = JSON.parse(JSON.stringify(this.sceneForm.sceneObj));
      for (var i = 0; i < arry.length; i++) {
        if (info.code == arry[i].code) {
          arry.splice(i, 1);
        }
      }
      this.$set(this.sceneForm, 'sceneObj', arry);
    },
    getQueryPageList(info) {
      // console.log('获取业务场景请求参数',info)
      // 获取业务场景
      this.queryPageList({
        parameters: [
          { key: 'Q^BS_DESCRIBE_^SL', value: info.desc },
          { key: 'Q^SC_KEY_^S', value: info.key }
        ],
        requestPage: { pageNo: 1, limit: 100, totalCount: null },
        sorts: []
      }).then(res => {
        console.log('获取业务场景', res);
        this.list = res.dataResult;
      });
    },
    // 新增业务场景
    addVisual() {
      this.dialogTitle = '创建业务场景';
      this.sceneForm = {
        sceneCode: '', // 业务场景编码
        sceneDesc: '', // 业务场景名称
        sceneObj: [], // 业务对象
        serviceDirecClass: [] // 服务目录分类
      };
      this.sceneId = '';
      this.dialogVisible = true;
    },
    // 编辑/删除业务场景
    editOrDeleteVisual(info) {
      console.log('编辑/删除业务场景', info);
      var sceneObjName = '';
      if (info.type == '编辑') {
        this.sceneId = info.item.id;
        // 更新服务目录数组
        this.serviceDirecClassList = [
          {
            name: info.item.scDescribe,
            typeKey: info.item.scId,
            id: info.item.scKey
          }
        ];
        this.businessObjectFunc({
          parameters: [{ key: 'Q^code_^SL', value: info.item.topBo }],
          requestPage: { pageNo: 1, limit: 200, totalCount: null },
          sorts: []
        }).then(res => {
          sceneObjName = res.dataResult[0].name;
          this.sceneObjList = res.dataResult[0];
          this.sceneForm = {
            sceneCode: info.item.bsCode, // 业务场景编码
            sceneDesc: info.item.bsDescribe, // 业务场景名称
            // 业务对象
            sceneObj: [
              {
                code: info.item.topBo,
                name: sceneObjName
              }
            ],
            // 服务目录分类
            serviceDirecClass: this.serviceDirecClassList
          };
        });
        console.log('编辑的服务目录数组', this.serviceDirecClassList, this.sceneForm);
        this.dialogVisible = true;
      } else {
        // 执行删除
        this.$confirm('确认是否删除业务场景？')
          .then(_ => {
            this.businessPageRemove({
              ids: info.item.id
            }).then(res => {
              this.sceneId = '';
              // 刷新业务场景列表
              this.getQueryPageList({
                desc: '',
                key: ''
              });
            });
          })
          .catch(_ => {});
      }
    },
    // 业务场景详情
    viewDetails(info) {
      this.$emit('viewDetails', info);
    },
    // 保存业务场景
    confirmFunc(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          // 要保存的参数
          console.log('要保存的参数', this.sceneForm);
          this.businessPageSave({
            bsCode: this.sceneForm.sceneCode,
            bsDescribe: this.sceneForm.sceneDesc,
            scDescribe: this.sceneForm.serviceDirecClass[0].name,
            scId: this.sceneForm.serviceDirecClass[0].typeKey,
            scKey: this.sceneForm.serviceDirecClass[0].id,
            scType: this.sceneForm.serviceDirecClass[0].typeKey,
            topBo: this.sceneForm.sceneObj[0].code,
            id: this.sceneId
          }).then(res => {
            console.log('保存结果反馈', res);
            // 刷新业务场景列表
            this.getQueryPageList({
              desc: '',
              key: ''
            });
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    cancelFunc(formName) {
      this.$refs[formName].resetFields(); // 重置
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.visuaList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .list {
    float: left;
    overflow: hidden;
    margin: 0;
    padding: 0;
    .add {
      font-size: 28px;
      color: #8c939d;
    }
    li {
      float: left;
      width: 170px;
      height: 200px;
      text-align: center;
      line-height: 200px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      margin: 0 10px 10px 0;
      position: relative;
      color: #409eff;
      font-size: 40px;
      cursor: pointer;
      .name {
        position: absolute;
        left: 5px;
        top: 5px;
        height: 40px;
        line-height: 20px;
        text-align: left;
        font-size: 14px;
        color: #606266;
      }
      >i{
        padding: 60px;
      }
      .setting {
        position: absolute;
        right: 20px;
        bottom: 5px;
        width: 2px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
  // 弹窗样式
  /deep/ .el-dialog__wrapper {
    .el-dialog__body {
      .el-form {
        .el-form-item__label {
          padding: 0;
        }
      }
      .el-select {
        width: 100%;
      }
      .sceneObjBox {
        width: 100%;
        height: 32px;
        .newSelect {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          border: 1px dashed #ccc;
          overflow: auto;
        }
        input {
          border-radius: 4px;
          border: 1px dashed #ccc;
          box-sizing: border-box;
          cursor: pointer;
        }
        .el-input__suffix {
          display: none;
        }
      }
    }
  }
}
</style>