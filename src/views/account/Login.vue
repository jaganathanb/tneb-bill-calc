<script lang="ts" setup>
import { router } from '@/router'
import { useAuthStore, useFeedbackStore } from '@/stores'
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { StarFilled } from '@element-plus/icons-vue'

import logoUrl from '../../assets/img/logo-520_x_520.png'

const loginForm = ref({
  email: '',
  password: ''
})

const loginFormRef = ref<FormInstance>()

const loginRules: FormRules = {
  email: [
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const res = await formEl.validate()

  const authStore = useAuthStore()
  const alertStore = useFeedbackStore()

  if (res) {
    try {
      await authStore.signIn(loginForm.value)

      await router.push('/')
    } catch (error) {
      alertStore.error('Please check your credentials and try again.')
    }
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <el-container class="h-full w-full">
    <el-col :span="11">
      <el-row align="middle" class="justify-center h-full">
        <el-image :src="logoUrl"></el-image>
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
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            label-width="auto"
            hide-required-asterisk
          >
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="loginForm.email"
                type="text"
                autocomplete="off"
                @keyup.enter="submitForm(loginFormRef)"
              />
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                autocomplete="off"
                @keyup.enter="submitForm(loginFormRef)"
              />
            </el-form-item>
            <ElSpace class="actions">
              <el-button type="primary" @click="submitForm(loginFormRef)"
                >Submit</el-button
              >
              <el-button @click="resetForm(loginFormRef)">Reset</el-button>
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
