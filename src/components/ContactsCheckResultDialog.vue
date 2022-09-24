<template>
  <div class="ContactsCheckResultDialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="280px"
      :show-close="false"
      :custom-class="isContact === false ? '' : 'danger'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row class="el-dialog-content">
        <el-col class="icon-col" :span="24">
          <i
            id="rotate-icon-3d"
            :class="{
              'el-icon-circle-close': isContact,
              'el-icon-circle-check': !isContact,
            }"
          ></i>
        </el-col>
        <el-col :span="24">
          <span class="icon-text">{{ iconTextContent }}</span>
        </el-col>
      </el-row>
      <el-row slot="footer">
        <el-col :span="24">
          <el-tag :type="elType" size="small">
            <span>{{ number }}</span>
            <span>{{ date }}</span>
          </el-tag>
        </el-col>
        <el-col :span="24">
          <span class="tip-text">{{ message }}</span>
        </el-col>
        <el-col :span="24">
          <el-button @click="confirm" :type="elType" round>
            {{ buttonTextContent }}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { errorMsg, successMsg } from '@/utils/msgsettings.js'
export default {
  name: 'ContactsCheckResultDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isContact: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: '',
    },
    number: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconTextContent() {
      return this.isContact === false ? '安 全' : '危 险'
    },
    elType() {
      return this.isContact === false ? 'success' : 'danger'
    },
    buttonTextContent() {
      return this.isContact === false ? '确 定' : '已 知 风 险'
    },
  },
  methods: {
    confirm() {
      this.$emit('hideDialog')
      if (this.isContact === false) {
        successMsg(this.message)
      } else {
        errorMsg(this.message)
      }
    },
  },
}
</script>

<style lang="less">
@import '../assets/styles/contacts-check-result-dialog';
</style>
