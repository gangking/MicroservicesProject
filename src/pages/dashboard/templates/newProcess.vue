<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <transition name="draw">
      <div ref="body" :style="{height:showHeight,width:'100%'}">
        <ibps-list-group v-if="data && data.length >0">
          <ibps-list v-for="(d,i) in data" :key="i" :title="d.name" :extra="`版本：${d.version}`" :label="d.creator" />
        </ibps-list-group>
        <el-alert
          v-else
          :title="$t('common.noData')"
          :closable="false"
          type="warning"
        />
      </div>
    </transition>
  </el-card>
</template>
