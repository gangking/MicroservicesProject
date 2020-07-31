<template>
  <el-card class="box-card">
    <div ref="body" :style="{height:getHeight(),width:'100%'}">
      <ibps-item class="ibps-item-content">
        <div v-if="data&&data.fullname">
          欢迎您{{ data.fullname }}，祝你天天开心!
        </div>
        <div v-if="data&&data.org&&data.org.orgName&&data.pos&&data.pos.posName" slot="label">
          {{ data.org.orgName }}-{{ data.pos.posName }}<br><br>
          登陆时间：{{ data.loginTime }}<br><br>
          联系电话：{{ data.mobile }}
        </div>
        <div v-if="data&&data.picture" slot="icon">
          <img :src="data.picture">
        </div>
      </ibps-item>
    </div>
  </el-card>
</template>
