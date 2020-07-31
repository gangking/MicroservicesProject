<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <ibps-list-group v-if="data && data.length >0">
        <ibps-list v-for="(d,i) in data" :key="i" :extra="d.createTime">
          <span><el-tag :type="d.remindTimes===2?'info':(d.remindTimes===3?'warning': 'danger')" disable-transitions>催办{{ d.remindTimes }}次</el-tag>{{ d.subject }}</span>
          <el-avatar slot="icon" :src="d.creatorPhoto" :text="d.creator" shape="square" style="background-color: #87d068" />
          <span slot="label">{{ d.status }}</span>
        </ibps-list>
      </ibps-list-group>
      <el-alert
        v-else
        :title="$t('common.noData')"
        :closable="false"
        type="warning"
      />
    </div>
  </el-card>

</template>
