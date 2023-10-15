<script lang="ts" setup>
import { router } from '@/router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

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
  const alertStore = useAlertStore()

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
  <ElSpace alignment="center" direction="vertical" fill>
    <ElCard header="Sign in">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        label-width="auto"
        hide-required-asterisk
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="loginForm.email" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
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
    </ElCard>
  </ElSpace>
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
