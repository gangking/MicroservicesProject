<template>
  <el-card
    v-loading.body="loading"
    :style="{height:getDashboardHeight(),width:'100%'}"
    :element-loading-text="$t('common.loading')"
    class="ibps-desktop-dashboard"
  >
    <el-row ref="row" :gutter="12">
      <template v-for="item in data">
        <el-col :key="item.id" :span="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div :style="{background:item.color}" class="item">
            <div class="item-header">
              <p>{{ item.title }}</p>
              <span>{{ item.subtitle }}</span>
            </div>
            <div class="item-body">
              <h2><count-to :end-val="item.count" :duration="4000" /></h2>
            </div>
            <p class="item-tip">{{ item.key }}</p>
          </div>
        </el-col>
      </template>
    </el-row>
  </el-card>
</template>
