<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    router
    v-if="isCollapsed"
  >
    <el-menu-item
      v-for="(item, index) in items"
      :key="index"
      :index="item.path"
    >
      {{ item.displayName }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import routes from '@/router/routes'
export default {
  name: 'MyHeader',
  props: {
    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeIndex: this.$route.path,
      items: routes[0].children,
    }
  },
}
</script>

<style lang="less">
@import '../assets/styles/my-header';
</style>
