<template>
  <el-row>
    <my-card color="red">
      <template #header>
        <div class="card-header">
          <i class="el-icon-search"></i>
          <span>新冠接触者自查</span>
        </div>
      </template>
      <el-form
        :model="contactsCheckForm"
        :rules="rules"
        ref="contactsCheckForm"
        hide-required-asterisk
        label-width="auto"
      >
        <el-form-item label="乘坐时间" prop="date">
          <el-date-picker
            v-model="contactsCheckForm.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            :value-format="valueFormat"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="乘坐班次" prop="number">
          <el-input
            v-model="contactsCheckForm.number"
            placeholder="请输入您当日乘坐的航班/列车号"
          ></el-input>
        </el-form-item>
        <div class="buttonGroup">
          <el-button
            type="danger"
            icon="el-icon-view"
            round
            plain
            @click="submitForm('contactsCheckForm')"
          >
            查询
          </el-button>
        </div>
      </el-form>
    </my-card>
    <contacts-check-result-dialog
      :dialogVisible="dialogVisible"
      :isContact="isContact"
      :date="contactsCheckForm.date"
      :number="contactsCheckForm.number"
      :message="result.msg"
      @hideDialog="dialogVisible = false"
    ></contacts-check-result-dialog>
  </el-row>
</template>

<script>
import request from '@/utils/request'
import ContactsCheckResultDialog from '@/components/ContactsCheckResultDialog.vue'
export default {
  name: 'ContactsCheck',
  props: {
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    post: {
      type: String,
      required: true,
    },
  },
  components: {
    'contacts-check-result-dialog': ContactsCheckResultDialog,
  },
  data() {
    return {
      dialogVisible: false,
      contactsCheckForm: {
        date: '',
        number: '',
      },
      result: {
        res: '',
        msg: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      rules: {
        date: [
          {
            required: true,
            message: '请输选择乘坐日期',
            trigger: 'blur',
          },
        ],
        number: [
          {
            required: true,
            message: '请输入航班/列车号',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    isContact() {
      return this.result.res === '1'
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request
            .post(this.post, this.contactsCheckForm)
            .then((response) => {
              this.result = response.data
              this.dialogVisible = true
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
@import '../assets/styles/contacts-check';
</style>
