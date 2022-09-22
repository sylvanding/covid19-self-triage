<template>
  <el-row>
    <my-card color="blue">
      <template #header>
        <div class="card-header">
          <i class="el-icon-message-solid"></i>
          <span>疫情防控-通知公告</span>
        </div>
      </template>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(notice, index) in notices"
          :key="index"
          :name="index + ''"
        >
          <template slot="title">
            {{ notice.title }}
          </template>
          <div>
            {{ notice.abstract }}
          </div>
          <el-row type="flex" class="notice-btm">
            <el-col>
              <el-tag class="notice-time">
                {{ notice.time }}
              </el-tag>
            </el-col>
            <el-col class="notice-link-col">
              <el-link
                type="primary"
                class="notice-link"
                :href="notice.link"
                target="_blank"
              >
                查看详情
              </el-link>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </my-card>
  </el-row>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Notice',
  props: {
    get: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      notices: {},
      activeNames: ['0'],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      request
        .get(this.get)
        .then((response) => {
          this.notices = response.data
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less">
@import '../assets/styles/notice';
</style>
