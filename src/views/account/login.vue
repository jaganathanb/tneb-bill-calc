<script lang="ts" setup>
import { StarFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import { router } from '@/router'
import SvgImg from '@/components/svg-img.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useFeedbackStore } from '@/stores/feedback.store'

import type { FormInstance, FormRules } from 'element-plus'
import type { AxiosError } from 'axios'

const loginForm = ref({
  username: '',
  password: ''
})
const authStore = useAuthStore()
const alertStore = useFeedbackStore()
const route = useRoute()

const loginFormReference = ref<FormInstance>()

const loginRules: FormRules = {
  username: [
    {
      required: true,
      message: 'Please enter your username',
      pattern: /.+@.+\..+/,
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' }
  ]
}

const submitForm = async (formElement: FormInstance | undefined) => {
  if (!formElement) return
  const result = await formElement.validate()

  if (result) {
    try {
      await authStore.signIn(loginForm.value)

      const redirect = route.query?.['redirect']?.toString()
      await (redirect ? router.push(redirect) : router.push('/'))
    } catch (error: any) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'ERR_NETWORK') {
        alertStore.setMessage({
          message: `Please check your connection and try again.`,
          type: 'error'
        })
      } else if (
        (axiosError.response?.data as any).error === 'record not found'
      ) {
        alertStore.setMessage({
          message: `You (${loginForm.value.username}) are not registered with us yet. Please join us by signing up.`,
          type: 'error'
        })
      } else {
        alertStore.setMessage({
          message: `Please check your input and try again.`,
          type: 'error'
        })
      }
    }
  }
}

const resetForm = (formElement: FormInstance | undefined) => {
  if (!formElement) return
  formElement.resetFields()
}
</script>

<template>
  <el-container class="h-full w-full">
    <el-col :span="11">
      <el-row align="middle" class="justify-center h-full">
        <SvgImg :name="'DhuruvahApps'" :width="700" :height="500" />
      </el-row>
    </el-col>
    <el-col :span="2" :push="2">
      <el-divider direction="vertical" style="height: 100%">
        <el-icon><StarFilled /></el-icon>
      </el-divider>
    </el-col>
    <el-col :span="11">
      <el-row align="middle" class="justify-center h-full">
        <el-card header="Sign in">
          <el-form
            ref="loginFormReference"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            label-width="auto"
            hide-required-asterisk
          >
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="loginForm.username"
                type="text"
                autocomplete="off"
                @keyup.enter="submitForm(loginFormReference)"
              />
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                autocomplete="off"
                @keyup.enter="submitForm(loginFormReference)"
              />
            </el-form-item>
            <ElSpace class="actions">
              <el-button type="primary" @click="submitForm(loginFormReference)"
                >Submit</el-button
              >
              <el-button @click="resetForm(loginFormReference)"
                >Reset</el-button
              >
            </ElSpace>
            <ElSpace class="links">
              <ElLink href="/auth/register">Sign up</ElLink>
            </ElSpace>
          </el-form>
        </el-card>
      </el-row>
    </el-col>
  </el-container>
</template>

<style lang="scss">
.actions,
.links {
  justify-content: flex-end;
  width: 100%;
  margin-top: 18px;
}

.links {
  justify-content: center;
}
</style>
