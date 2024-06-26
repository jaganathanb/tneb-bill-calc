<script lang="ts" setup>
import { ref } from 'vue'

import { router } from '@/router'
import SvgImg from '@/components/svg-img.vue'
import { type RegistrationForm, useAuthStore } from '@/stores/auth.store'
import { useFeedbackStore } from '@/stores/feedback.store'

import type { FormInstance, FormRules } from 'element-plus'

const registerForm = ref<RegistrationForm>({} as RegistrationForm)
const regForm = ref<FormInstance>()

const validatePass = async (_rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\s\w:])(\S){8,16}$/.test(value)
    ) {
      return callback(new Error('Please input valid password'))
    }
    if (registerForm.value.confirmPassword !== '') {
      if (!registerForm.value) return
      await regForm.value?.validateField('confirmPassword', () => {})
    }
    callback()
  }
}
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value === registerForm.value.password) {
    callback()
  } else {
    callback(new Error("Two inputs don't match!"))
  }
}

const registrationRules: FormRules = {
  email: [
    {
      required: true,
      message: 'Please enter valid email',
      trigger: 'blur',
      pattern: /.+@.+\..+/
    }
  ],
  firstName: [
    {
      required: true,
      message: 'Please enter first name',
      trigger: 'blur'
    }
  ],
  lastName: [
    {
      required: true,
      message: 'Please enter last name',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      asyncValidator: validatePass,
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      validator: validatePass2,
      trigger: 'blur'
    }
  ]
}

const submitForm = async (formElement: FormInstance | undefined) => {
  if (!formElement) return
  const result = await formElement.validate()
  if (result) {
    const authStore = useAuthStore()
    const alertStore = useFeedbackStore()
    try {
      const name = await authStore.register({
        email: registerForm.value.email,
        firstName: registerForm.value.firstName,
        password: registerForm.value.password,
        lastName: registerForm.value.lastName,
        username: registerForm.value.email
      } as RegistrationForm)

      await router.push('/auth/login')

      alertStore.setMessage({
        message: `Thank you ${name}!, Registration successful.`,
        type: 'success'
      })
    } catch (error: unknown) {
      alertStore.setMessage({
        message: error as string,
        type: 'error'
      })
    }
  }
}

const resetForm = (formElement: FormInstance | undefined) => {
  if (!formElement) return
  formElement.resetFields()
}
</script>

<template>
  <el-container class="h-full w-full justify-center" direction="vertical">
    <el-row align="middle" class="w-full justify-center">
      <SvgImg :name="'DhuruvahApps'" :width="250" :height="250" />
    </el-row>
    <el-row style="height: 50px" />
    <el-row align="middle" class="w-full justify-center">
      <el-card header="Sign up">
        <el-form
          ref="regForm"
          :rules="registrationRules"
          :model="registerForm"
          label-position="top"
          label-width="auto"
          status-icon
        >
          <el-space class="username">
            <el-form-item label="First name" prop="firstName">
              <ElInput v-model="registerForm.firstName" />
            </el-form-item>
            <el-form-item label="Last name" prop="lastName">
              <ElInput v-model="registerForm.lastName" />
            </el-form-item>
          </el-space>
          <el-form-item label="Email" prop="email">
            <ElInput v-model="registerForm.email" />
          </el-form-item>
          <el-space class="passwords">
            <el-form-item label="Password" prop="password" style="width: 100%">
              <ElInput
                v-model="registerForm.password"
                type="password"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="Confirm password"
              prop="confirmPassword"
              style="width: 100%"
            >
              <ElInput
                v-model="registerForm.confirmPassword"
                type="password"
                autocomplete="off"
              />
            </el-form-item>
          </el-space>
          <el-space class="actions">
            <el-space class="link">
              <el-link href="/auth/login">Sign in</el-link>
            </el-space>
            <el-button type="primary" @click="submitForm(regForm)"
              >Submit</el-button
            >
            <el-button @click="resetForm(regForm)">Reset</el-button>
          </el-space>
        </el-form>
      </el-card>
    </el-row>
  </el-container>
</template>

<style lang="scss">
.actions {
  justify-content: flex-end;
  width: 100%;
  margin-top: 18px;

  > div:first-child {
    width: 100%;
  }
}

.username,
.passwords {
  width: 100%;

  > div {
    width: 100%;
  }
}
</style>
