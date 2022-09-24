<template>
  <el-row class="Feedback">
    <my-card color="cyan">
      <template #header>
        <div class="card-header">
          <i class="el-icon-chat-line-round"></i>
          <span>用户反馈</span>
        </div>
      </template>
      <el-form
        :model="feedbackForm"
        :rules="rules"
        ref="feedbackForm"
        status-icon
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="feedbackForm.email"
            placeholder="请输入邮箱作为您的联系方式"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="feedbackForm.content"
            placeholder="请输入您的反馈内容 (长度控制在 10 到 50 个字符)"
            :autosize="autosize"
          ></el-input>
        </el-form-item>
        <div class="buttonGroup">
          <el-button
            type="info"
            icon="el-icon-delete"
            round
            @click="resetForm('feedbackForm')"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-check"
            round
            @click="submitForm('feedbackForm')"
            :disabled="isSubmitted"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </my-card>
  </el-row>
</template>

<script>
import request from '@/utils/request'
import { errorMsg, successMsg, infoMsg } from '@/utils/msgsettings.js'
export default {
  name: 'Feedback',
  props: {
    post: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isSubmitted: false,
      feedbackForm: {
        email: '',
        content: '',
      },
      autosize: {
        minRows: 2,
        maxRows: 4,
      },
      rules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        content: [
          {
            required: true,
            message: '请输入反馈内容',
            trigger: 'blur',
          },
          {
            min: 10,
            max: 50,
            message: '长度在 10 到 50 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(
            `<${this.feedbackForm.email}> : ${this.feedbackForm.content}`,
            '是否确认提交?',
            {
              confirmButtonText: '提交',
              cancelButtonText: '取消',
              iconClass: 'el-icon-s-opportunity',
              roundButton: true,
            }
          )
            .then(() => {
              request
                .post(this.post, this.feedbackForm)
                .then((response) => {
                  let msg = response.data.msg
                  if (response.data.res === '1') {
                    successMsg(msg)
                    this.resetForm('feedbackForm')
                    this.isSubmitted = true
                  } else {
                    errorMsg(msg)
                  }
                })
                .catch(() => {})
            })
            .catch(() => {
              infoMsg('取消提交反馈～')
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="less">
@import '../assets/styles/feedback';
</style>
