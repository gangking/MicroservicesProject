<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div>
      <div class="tabs-title">
        <ibps-icon name="commenting" />
        <span>{{ title }}</span>
      </div>
      <div class="tabs-toolbar">
        <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
      </div>
      <div ref="body">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="内部" name="innerMessage">
            <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
              <ibps-list-group v-if="data && data.innerMessage && data.innerMessage.length >0">
                <ibps-list v-for="(d,i) in data.innerMessage" :key="i" :title="d.name" :extra="`${d.createTime}`">
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
          </el-tab-pane>
          <el-tab-pane label="外部" name="system">
            <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
              <ibps-list-group v-if="data && data.system && data.system.length >0">
                <ibps-list v-for="(d,i) in data.system" :key="i" :title="d.name" :extra="`${d.createTime}`">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>

</template>
