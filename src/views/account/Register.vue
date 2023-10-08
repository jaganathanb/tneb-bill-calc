<script lang="ts" setup>
import { router } from '@/router'
import { useAlertStore, useAuthStore, type RegistrationForm } from '@/stores'
import { computed, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const registerForm = ref<RegistrationForm>({} as RegistrationForm)
const regForm = ref<FormInstance>()

const validatePass = async (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/.test(
        value
      )
    ) {
      return callback(new Error('Please input valid password'))
    }
    if (registerForm.value.confirmPassword !== '') {
      if (!registerForm.value) return
      await regForm.value?.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== registerForm.value.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const res = await formEl.validate()
  if (res) {
    const authStore = useAuthStore()
    const alertStore = useAlertStore()
    try {
      await authStore.createUser({
        email: registerForm.value.email,
        firstName: registerForm.value.firstName,
        password: registerForm.value.password,
        lastName: registerForm.value.lastName
      } as RegistrationForm)

      await router.push('/auth/login')

      alertStore.success('Registration successful.')
    } catch (error: unknown) {
      alertStore.error(error as string)
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
    <ElCard header="Sign up">
      <ElForm
        ref="regForm"
        :rules="registrationRules"
        :model="registerForm"
        label-position="top"
        label-width="auto"
        status-icon
      >
        <ElSpace class="username">
          <ElFormItem label="First name" prop="firstName">
            <ElInput v-model="registerForm.firstName" />
          </ElFormItem>
          <ElFormItem label="Last name" prop="lastName">
            <ElInput v-model="registerForm.lastName" />
          </ElFormItem>
        </ElSpace>
        <ElFormItem label="Email" prop="email">
          <ElInput v-model="registerForm.email" />
        </ElFormItem>
        <ElSpace class="passwords">
          <ElFormItem label="Password" prop="password" style="width: 100%">
            <ElInput
              v-model="registerForm.password"
              type="password"
              autocomplete="off"
            />
          </ElFormItem>
          <ElFormItem
            label="Confirm password"
            prop="confirmPassword"
            style="width: 100%"
          >
            <ElInput
              v-model="registerForm.confirmPassword"
              type="password"
              autocomplete="off"
            />
          </ElFormItem>
        </ElSpace>
        <ElSpace class="actions">
          <ElSpace class="link">
            <ElLink href="/auth/login">Sign in</ElLink>
          </ElSpace>
          <ElButton @click="resetForm(regForm)">Reset</ElButton>
          <ElButton type="primary" @click="submitForm(regForm)"
            >Submit</ElButton
          >
        </ElSpace>
      </ElForm>
    </ElCard>
  </ElSpace>
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
