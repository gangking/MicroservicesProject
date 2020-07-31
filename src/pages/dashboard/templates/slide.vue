<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{key:'refresh'},{key:'fullscreen'},{key:'collapse'}]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(d,i) in data" :key="i">
          <img :src="d.picture" style="width:100%;height:90%;">
          <h3>{{ d.label }}</h3>
          <span>深圳文思海辉信息科技有限公司</span>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-card>
</template>
