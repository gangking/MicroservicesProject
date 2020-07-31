<template>
  <div class="show_eg">
    <div class="content" v-loading="loading">
      <table class="tableStyle">
        <tr style="background:#F7F7F7">
          <th>
            <el-checkbox v-model="allActive" @change="allActiveChange" />
          </th>
          <th>状态</th>
          <th>消息类型</th>
          <th>消息类别</th>
          <th>消息号</th>
          <th class="txlft">消息内容</th>
        </tr>
        <tr v-for="(item, index) in msgList" :key="index" class="infinite-list-item" :style="item.active ? 'background: #f5f7fa' : 'background: white'">
          <td>
            <div v-if="item.title == '警告'">
              <el-checkbox v-model="item.active" @change="itemActiveChange(item, index)" />
            </div>
            <div v-else title="非警告消息">
              ---
            </div>
          </td>
          <td>
            <div v-if="item.title == '警告'" title="非警告消息">
              {{ item.status == "Y" ? "已读" : "未读" }}
            </div>
            <div v-else>
              ---
            </div>
          </td>
          <td class="msgType" :title="item.title">
            <i :class="item.msgtyIcon" :style="item.msgtyColor" />
          </td>
          <td>{{ item.msgid }}</td>
          <td>{{ item.msgno }}</td>
          <td :style="item.msgtxColor" class="txlft">{{ item.msgtx }}</td>
        </tr>
      </table>
    </div>
    <div class="btnRight">
      <el-button type="success" @click="btnSave" plain>
        <i class="iconfont icon-yidu" />
        标记为已读</el-button>
      <el-button type="primary" @click="btnClickCheck" plain>
        <i class="iconfont icon-uniE17A" />
        检查刷新</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { bsCheckStepQuery, saveCheck } from '@/api/platform/invoice/index.js';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeDolog');
export default {
  name: 'show_exception',
  props: {},
  data() {
    return {
      allActive: false, // 是否全选
      msgNum: 0,
      infoids: [],
      msgList: [],
      loading: false
    };
  },

  computed: {
    ...mapState(['formExceptions'])
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(['getFormException', 'hideException']),
    // 刷新
    refresh() {
      this.loading = true;
      this.getFormException().then(res => {
        console.log('例外消息返回值', res);
        this.loading = false;
        this.msgList = this.getMsgList(res);
      });
    },
    //   全选反选
    allActiveChange() {
      //console.log("是否全选", this.allActive);
      //   当反选时
      //   当全选时遍历列表，将所有警告且未读的消息id拼接到infoids中
      if (!this.allActive) {
        this.infoids = [];
        //console.log("取消全选了");
        this.msgList = this.msgList.map(item => {
          // 只有警告消息且未读时才设置是否选中
          if (item.msgty == 'W' && item.status != 'Y') {
            item.active = this.allActive;
          }
          return item;
        });
      } else {
        this.msgList = this.msgList.map(item => {
          // 只有警告消息且未读时才设置是否选中
          if (item.msgty == 'W' && item.status != 'Y') {
            item.active = this.allActive;
            if (this.allActive) {
              this.infoids.push(item.id);
            }
          }
          return item;
        });
        //console.log("全选后的数组", this.infoids);
      }
    },
    // 勾选行
    itemActiveChange(info, index) {
      this.trClick(info, index);
    },
    // 点击行
    trClick(info, index) {
      //console.log("当前点击的是", info, index, this.msgList[index]);
      var list = JSON.parse(JSON.stringify(this.msgList));
      if (info.status != 'Y') {
        list[index].active = list[index].active ? false : true;
      }
      this.msgList = list;
      //console.log("点击后的标识", list[index].active);
      if (list[index].active) {
        //   勾选
        //console.log("勾选");
        this.infoids.push(list[index].id);
        //console.log("勾选后的数组", this.infoids);

        //   判断是否已全选
        var flag = false;
        for (var j = 0; j < list.length; j++) {
          var item = list[j];
          if (!item.active) {
            flag = true;
          }
        }
        if (flag) {
          // 未全选
          this.allActive = false;
        } else {
          // 已全选
          this.allActive = true;
        }
      } else {
        // 取消勾选
        // 遍历当前已选的选项，然后根据id去删除
        //console.log("取消勾选", info.id);

        var index = null;
        for (var i = 0; i < this.infoids.length; i++) {
          var item = this.infoids[i];
          if (item == info.id) {
            index = i;
          }
        }
        this.infoids.splice(index, 1);
        this.allActive = false;
        //console.log("删除后的数组", this.infoids);
      }
    },
    btnClickCheck() {
      this.loading = true;
      this.getFormException().then(res => {
        console.log('例外消息返回值', res);
        this.loading = false;
        this.msgList = this.getMsgList(res);
      });
    },
    // 标记已读
    async btnSave() {
      console.log('标记已读11111');
      // 调保存接口
      this.loading = true;
      const params = {
        ids: ''
      };

      if (this.infoids.length < 1) {
        this.$message({
          message: '请先选择要标记的消息',
          type: 'warning'
        });
        this.loading = false;
        return;
      } else {
        params.ids = this.infoids.join(',');
      }

      var flag = await this.hideException(params);
      console.log('标记已读返回', flag);
      if (flag) {
        this.$message({
          message: '标记成功 !',
          type: 'success'
        });
        //   刷新数据
        this.btnClickCheck();
        this.allActive = false;
      } else {
        this.$message({
          message: '标记失败 !',
          type: 'error'
        });
        this.loading = false;
      }
      // this.hideException(params).then(res => {
      //   console.log('标记已读返回',res)
      //   if (res) {
      //     // this.loading = false;
      //     this.$message({
      //       message: '标记成功 !',
      //       type: 'success'
      //     });
      //     //   刷新数据
      //     this.btnClickCheck();
      //     this.allActive = false;
      //   } else {
      //     this.loading = false;
      //   }
      // });
    },
    //   获取例外消息
    getMsgList(data) {
      // console.log('例外消息data:', data);
      if (data.length < 1) {
        this.$message({
          message: '暂无例外消息 。',
          type: 'error'
        });
        return;
      }
      this.msgNum = data.pageResult.totalCount;
      for (var i = 0; i < data.dataResult.length; i++) {
        var item = data.dataResult[i];
        var icon = 'iconfont icon-';
        switch (item.msgty) {
          case 'E':
            // 错误
            icon += 'uniE1AC';
            item.msgtyColor = 'color: #F56C6C;';
            item.msgtxColor = 'color: #F56C6C;';
            item.title = '错误';
            break;
          case 'X':
            // 危险
            icon += 'uniE1AE';
            item.msgtyColor = 'color: #FF0000;';
            item.msgtxColor = 'color: #FF0000;';
            item.title = '危险';
            break;
          case 'W':
            // 警告
            icon += 'uniE201';
            item.active = false;
            item.msgtyColor = 'color: #E6A23C;';
            item.msgtxColor = 'color: #E6A23C;';
            item.title = '警告';
            break;
          case 'S':
            // 成功
            icon += 'uniE203';
            item.msgtyColor = 'color: #67C23A;';
            item.msgtxColor = 'color: #67C23A;';
            item.title = '成功';
            break;
          case 'I':
            // 提示
            icon += 'uniE202';
            item.msgtyColor = 'color: #1890FF;';
            item.msgtxColor = 'color: #1890FF;';
            item.title = '提示';
            break;
        }
        item.msgtyIcon = icon;
      }
      return data.dataResult;
    }
  }
};
</script>

<style lang="scss" scoped>
.show_eg {
  height: 100%;
  .content {
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 4px;
    padding-bottom: 10px;
    box-sizing: border-box;
    .infinite-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .tableStyle {
      width: 100%;
      tr {
        border-top: 1px solid #ebeef5;
        &:first-child {
          border-top: 0;
        }
        td,
        th {
          padding: 10px;
          text-align: center;
          min-width: 60px;
          &:first-child {
            min-width: 30px;
            padding: 0;
          }
        }
        .txlft {
          text-align: left;
        }
        &:hover {
          background: #f5f7fa !important;
        }
      }
    }
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /deep/ .el-badge__content {
      top: 8px;
      right: 16px;
    }
  }
  .btnRight {
    height: 32px;
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
</style>
