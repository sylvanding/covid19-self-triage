<template>
  <el-row>
    <my-card span="24" color="orange">
      <template #header>
        <el-row type="flex" justify="space-between">
          <el-col class="header-left">
            <div class="card-header">
              <i class="el-icon-share"></i>
              <span>疫情实时大数据报告</span>
            </div>
          </el-col>
          <el-col class="header-right">
            <clock></clock>
          </el-col>
        </el-row>
      </template>
      <el-table
        :data="tableData"
        :default-sort="{ prop: 'total', order: 'descending' }"
        row-class-name="el-table-row"
        header-cell-class-name="el-table-header-cell"
        :cell-style="
          ({ columnIndex }) =>
            columnIndex === 3 ? { 'font-weight': 'bold' } : {}
        "
      >
        <el-table-column prop="province" label="地区"> </el-table-column>
        <el-table-column prop="local" label="新增本土"> </el-table-column>
        <el-table-column prop="foreign" label="新增境外"> </el-table-column>
        <el-table-column
          prop="total"
          label="新增总数"
          sortable
          :sort-method="compare"
          :sort-orders="sort_orders"
        >
        </el-table-column>
      </el-table>
    </my-card>
  </el-row>
</template>

<script>
import request from '@/utils/request'
import Clock from '@/components/Clock.vue'
export default {
  name: 'Statistics',
  props: {
    get: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tableData: [],
      sort_orders: ['ascending', null, 'descending'],
    }
  },
  components: {
    clock: Clock,
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      request
        .get(this.get)
        .then((response) => {
          this.tableData = response.data
        })
        .catch(() => {})
    },
    compare(a, b) {
      return parseInt(a.total) - parseInt(b.total)
    },
  },
}
</script>

<style lang="less">
@import '../assets/styles/statistics';
</style>
