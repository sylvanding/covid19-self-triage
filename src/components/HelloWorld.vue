<template>
  <el-container class="HelloWorld">
    <el-header>
      <my-header :isCollapsed="!isCollapsed"></my-header>
    </el-header>
    <el-container>
      <el-aside width="480px" v-if="isCollapsed">
        <notice :get="urls.notice"></notice>
        <contacts-check :post="urls.contactsCheck"></contacts-check>
        <regions-search :post="urls.regionsSearch"></regions-search>
        <feedback :post="urls.feedback"></feedback>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>
      <my-footer></my-footer>
    </el-footer>
  </el-container>
</template>

<script>
import Statistics from '@/components/Statistics.vue'
import Notice from '@/components/Notice.vue'
import Feedback from '@/components/Feedback.vue'
import ContactsCheck from '@/components/ContactsCheck.vue'
import RegionsSearch from '@/components/RegionsSearch.vue'
import MyHeader from '@/components/MyHeader.vue'
import MyFooter from '@/components/MyFooter.vue'
const urls = require('@/utils/urls')
export default {
  name: 'HelloWorld',
  data() {
    return {
      urls,
      clientWidth: null,
      minCollapsedWidth: 1024,
    }
  },
  computed: {
    isCollapsed: function() {
      return this.clientWidth >= this.minCollapsedWidth
    },
  },
  watch: {
    isCollapsed: function(val) {
      if (
        val &&
        this.$route.path !== '/' &&
        this.$route.path !== '/statistics'
      ) {
        this.$router.push('/statistics')
      }
    },
  },
  components: {
    statistics: Statistics,
    notice: Notice,
    feedback: Feedback,
    'contacts-check': ContactsCheck,
    'regions-search': RegionsSearch,
    'my-header': MyHeader,
    'my-footer': MyFooter,
  },
  mounted() {
    this.clientWidth = document.body.clientWidth
    // register window resize event
    window.onresize = () => {
      this.clientWidth = document.body.clientWidth
    }
    // send a warning
    this.sendWarning()
  },
  methods: {
    sendWarning() {
      this.$message({
        message:
          '本网站所提供的信息，只供参考之用，不保证信息的准确性、有效性、及时性和完整性，更多内容请查看国家卫健委网站！',
        type: 'warning',
        duration: 5000,
        showClose: true,
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/styles/hello-world';
</style>
