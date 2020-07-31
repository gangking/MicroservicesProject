<template>
  <div class="ibps-mr-5">
    <el-popover
      placement="bottom-end"
      width="300"
      trigger="click"
      :disabled="messageCount === 0"
      popper-class="header-message-popper"
    >
      <!-- <el-tooltip
        v-if="messageCount === 0"
        slot="reference"
        :content="tooltipContent"
        effect="dark"
        placement="bottom"
      >
        <el-button class="ibps-ml-0 ibps-mr btn-text can-hover" type="text">
          <el-badge :max="99" :value="messageCount"> -->
            <!-- 更换图标 -->
            <!-- <i class="iconfont icon-mail icontop"></i> -->
            <!-- <ibps-icon
              name="bell-o"
              size="16"
            />-->
          <!-- </el-badge>
        </el-button>
      </el-tooltip> -->

      <!-- <el-button v-else slot="reference" class="ibps-ml-0 ibps-mr btn-text can-hover" type="text"> -->
      <el-button slot="reference" class="ibps-ml-0 ibps-mr btn-text can-hover" type="text">
        <el-badge :max="99" :value="messageCount">
          <!-- 更换图标 -->
          <i class="iconfont icon-mail icontop"></i>
          <!-- <ibps-icon name="bell-o" size="16" /> -->
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <div slot="header" style="font-size: 20px; font-weight: 600;">内部消息({{ messageCount }}条)</div>
        <div style="height:250px;">
          <el-scrollbar style="height: 100%;width:100%;">
            <ibps-list-group>
              <ibps-list
                v-for="(message,index) in messageList"
                :key="index"
                :title="message.subject"
                :label="message.ownerName"
                :extra="message.createTime|formatTime({'year':'yyyy-MM-dd'})"
              >
                <el-avatar
                  slot="icon"
                  :icon="message.messageType==='bulletin'?'ibps-icon-bullhorn':'ibps-icon-user'"
                  shape="circle"
                  style="background-color: #87d068"
                />
              </ibps-list>
            </ibps-list-group>
          </el-scrollbar>
        </div>
        <div class="message-more">
          <el-link type="primary" @click="clickMore">查看更多</el-link>
        </div>
      </el-card>
    </el-popover>
  </div>
</template>

<script>
import { getMsgList } from "@/api/platform/message/innerMessage";

export default {
  data() {
    return {
      messageList: [],
      messageCount: 0
    };
  },
  computed: {
    tooltipContent() {
      return this.messageCount === 0 ? "暂无消息" : "";
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载数据
    loadData() {
      // getMsgList()
      //   .then(response => {
      //     const data = response.data;
      //     this.messageList = data.dataResult;
      //     this.messageCount = data.pageResult ? data.pageResult.totalCount : 0;
      //   })
      //   .catch(() => {});
    },
    clickMore() {
      // TODO:更多消息
    }
  }
};
</script>
<style lang="scss" scoped>
.header-message-popper {
  padding: 0 !important;
  .message-more {
    padding: 15px 0;
    text-align: center;
    border-top: 1px solid #ebeef5;
  }
}
.imgtop {
  margin-top: 2px;
  width: 18px;
  height: 18px;
}
.icontop {
  display: inline-block;
  font-size: 17px;
  // margin-top: 1px;
}
</style>

