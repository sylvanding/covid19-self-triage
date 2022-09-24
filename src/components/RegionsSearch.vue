<template>
  <el-row class="RegionsSearch">
    <my-card color="berry">
      <template #header>
        <div class="card-header">
          <i class="el-icon-location-outline"></i>
          <span>全球疫情中高风险地区检索</span>
        </div>
      </template>
      <el-form
        :model="regionsSearchForm"
        ref="regionsSearchForm"
        hide-required-asterisk
        label-width="auto"
      >
        <el-row
          v-for="(item, index) in regionsSearchForm.values"
          :key="item.key"
          class="el-form-items"
        >
          <el-form-item
            label="时间"
            :prop="'values.' + index + '.date'"
            :rules="rules.date"
          >
            <el-date-picker
              v-model="item.date"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :value-format="valueFormat"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="地址"
            :prop="'values.' + index + '.place'"
            :rules="rules.place"
          >
            <el-autocomplete
              v-model="item.place"
              :fetch-suggestions="querySearchAsync"
              @select="
                (address) => {
                  handleSelect(address, index)
                }
              "
              @change="
                () => {
                  inputChange(index)
                }
              "
              @blur="inputBlur(index)"
              @focus="inputFocus()"
              placeholder="请输入地址(省/市/地/县)"
              :trigger-on-focus="false"
              :clearable="true"
              prefix-icon="el-icon-place"
            ></el-autocomplete>
          </el-form-item>
        </el-row>
        <div class="buttonGroup">
          <el-button
            type="success"
            icon="el-icon-circle-plus-outline"
            circle
            @click="addItem"
          >
          </el-button>
          <el-button
            type="info"
            icon="el-icon-remove-outline"
            circle
            @click="removeItem"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-discover"
            round
            plain
            @click="submitForm('regionsSearchForm')"
          >
            检索
          </el-button>
        </div>
      </el-form>
    </my-card>
  </el-row>
</template>

<script>
import request from '@/utils/request'
import { errorMsg, infoMsg } from '@/utils/msgsettings.js'
export default {
  name: 'RegionsSearch',
  props: {
    maxItemPlugNum: {
      type: Number,
      default: 2,
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    post: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      itemNum: 0,
      regionsSearchForm: {
        values: [],
      },
      addresses: [],
      timeout: null,
      inputTipsOpen: true,
      results: [],
      notifyPromise: Promise.resolve(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      rules: {
        date: [
          {
            required: true,
            message: '请输选择日期',
            trigger: 'blur',
          },
        ],
        place: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  created() {
    this.addItem()
  },
  methods: {
    querySearchAsync(queryString, cb) {
      this.addresses.splice(0, this.addresses.length)
      this.inputTips(queryString)
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(this.addresses)
      }, 600)
    },
    inputTips(queryString) {
      // ! frequency limit: 5,000 times per day
      // https://lbs.amap.com/api/webservice/guide/api/inputtips
      request
        .request({
          url: '/inputtips',
          baseURL: 'https://restapi.amap.com/v3/assistant/',
          params: {
            keywords: queryString,
            datatype: 'poi',
            key: 'fdfb60635a509cd63bd5db298be7dc28',
          },
        })
        .then((response) => {
          var { status, info, tips } = response.data
          if (status === '1') {
            this.addresses = tips.map((value) => {
              // {value, id, name, district, adcode, location, address}
              return {
                value: `${value.district}${value.name}`,
                ...value,
              }
            })
          } else {
            if (this.inputTipsOpen) {
              errorMsg(info)
              this.inputTipsOpen = false
            }
          }
        })
        .catch(() => {})
    },
    handleSelect(address, index) {
      this.regionsSearchForm.values[index].source = address
      this.regionsSearchForm.values[index].selected = true
    },
    inputChange(index) {
      this.regionsSearchForm.values[index].selected = false
    },
    inputBlur(index) {
      if (
        !this.regionsSearchForm.values[index].selected &&
        this.addresses.length !== 0
      ) {
        this.regionsSearchForm.values[index].place = this.addresses[0].value
        this.handleSelect(this.addresses[0], index)
      }
    },
    inputFocus() {
      this.addresses.splice(0, this.addresses.length)
    },
    addItem() {
      if (this.itemNum <= this.maxItemPlugNum) {
        this.regionsSearchForm.values.push({
          date: '',
          place: '',
          key: Date.now(),
          source: {},
          selected: false,
        })
        this.itemNum++
      } else {
        infoMsg(`已达检索地址新增上限：${this.maxItemPlugNum}.`)
      }
    },
    removeItem() {
      if (this.itemNum > 1) {
        this.regionsSearchForm.values.splice(this.itemNum - 1, 1)
        this.itemNum--
      } else {
        infoMsg('检索地址已达减少下限！')
      }
    },
    notify() {
      const h = this.$createElement
      for (let item of this.results) {
        let isSafe = item.result.isSafe === '1'
        // to solve the problem of overlapping notifications
        this.notifyPromise = this.notifyPromise.then(() => {
          this.$notify({
            title: item.place,
            type: isSafe ? 'success' : 'error',
            duration: isSafe ? 3600 : 0,
            showClose: !isSafe,
            message: h(
              'div',
              { class: 'regions-search-notify', danger: !isSafe },
              [
                h(
                  'p',
                  { class: 'date', attrs: { danger: !isSafe } },
                  `日期：${item.date}`
                ),
                h(
                  'p',
                  { class: 'msg', attrs: { danger: !isSafe } },
                  item.result.msg
                ),
              ]
            ),
          })
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request
            .post(
              this.post,
              this.regionsSearchForm.values.map((value) => {
                let { date, place, source } = value
                return {
                  date,
                  place,
                  source,
                }
              })
            )
            .then((response) => {
              this.results = response.data
              this.notify()
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less">
@import '../assets/styles/regions-search';
</style>
