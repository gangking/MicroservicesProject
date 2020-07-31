<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <ibps-icon name="commenting" />
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <ibps-list-group v-if="data&&data.interior && data.interior.length >0">
        <ibps-list v-for="(d,i) in data.interior" :key="i" :title="d.name" :extra="`${d.createTime}`">
          <div slot="icon"><ibps-icon name="bolt" style="color:#5cb85c" /></div>
        </ibps-list>
      </ibps-list-group>
      <el-alert
        v-else
        :closable="false"
        title="当前没有记录。"
        type="warning"
      />
    </div>
  </el-card>
</template>
