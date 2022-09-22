<template>
  <el-col :span="span | parseInt">
    <div :class="['my-card', color]">
      <div class="my-card-header">
        <slot name="header"></slot>
      </div>
      <div class="my-card-body">
        <slot></slot>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'MyCard',
  props: {
    span: {
      default: 24,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  filters: {
    parseInt: (value) => parseInt(value),
  },
}
</script>

<style lang="less">
@import '../assets/styles/my-card';
</style>
