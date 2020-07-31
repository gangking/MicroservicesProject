<template>
  <div class="ibps-list-item">
    <div class="ibps-list-icon">
      <slot name="icon" />
    </div>
    <div class="ibps-list-main">
      <div class="ibps-list-title"><slot>{{ title }}</slot></div>
      <div class="ibps-list-label"><slot name="label">{{ label }}</slot></div>
    </div>
    <div class="ibps-list-footer">
      <span class="ibps-list-extra"><slot name="extra">{{ extra }}</slot></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    }
  }
}
</script>
