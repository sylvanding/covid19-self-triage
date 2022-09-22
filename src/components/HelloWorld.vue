<template>
  <el-container>
    <el-header>
      header
    </el-header>
    <el-container>
      <el-aside width="480px">
        <notice get="/notice.json"></notice>
        <contacts-check post="/contacts_check_safe.json"></contacts-check>
        <regions-search post="/regions_search.json"></regions-search>
        <feedback post="/feedback_success.json"></feedback>
      </el-aside>
      <el-main>
        <statistics get="/statistics.json"></statistics>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Statistics from '@/components/Statistics.vue'
import Notice from '@/components/Notice.vue'
import Feedback from '@/components/Feedback.vue'
import ContactsCheck from '@/components/ContactsCheck.vue'
import RegionsSearch from '@/components/RegionsSearch.vue'
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  components: {
    statistics: Statistics,
    notice: Notice,
    feedback: Feedback,
    'contacts-check': ContactsCheck,
    'regions-search': RegionsSearch,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/styles/hello-world';
</style>
