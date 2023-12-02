<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import BaseDatePicker from '@/components/table/base-datepicker.vue'

const props = defineProps<{
  value: Bill
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', value: Bill): void
  (e: 'cancel'): void
}>()

const form = reactive(props.value)
const position = ref<'left' | 'right' | 'top'>('right')
const billFormRef = ref<FormInstance>()

const rules: FormRules = {
  startDate: [
    { required: true, message: 'Start date is required', trigger: 'blur' }
  ],
  endDate: [
    { required: true, message: 'End date is required', trigger: 'blur' }
  ],
  amount: [{ required: true, message: 'Amount is required', trigger: 'blur' }],
  units: [{ required: true, message: 'Units is required', trigger: 'blur' }]
}

onMounted(() => {
  if (window.screen.width < 767) {
    position.value = 'top'
  }
})

watchEffect(() => {
  Object.assign(form, props.value)
  nextTick(() => {
    billFormRef.value!.clearValidate()
  })
})

const handleSubmit = () => {
  billFormRef.value!.validate((valid) => {
    if (valid) {
      emit('submit', { ...form })
    }
  })
}

const handleCancel = () => {
  billFormRef.value!.clearValidate()
  emit('cancel')
}
</script>
<template>
  <el-form
    ref="billFormRef"
    :model="form"
    :rules="rules"
    class="save-form"
    label-width="80px"
    :label-position="position"
  >
    <el-form-item label="Start date" prop="startDate">
      <BaseDatePicker v-model="form.startDate" />
    </el-form-item>
    <el-form-item label="End date" prop="endDate">
      <BaseDatePicker v-model="form.endDate" />
    </el-form-item>
    <el-form-item label="Bill Id" prop="billId">
      <el-input v-model="form.billId" clearable></el-input>
    </el-form-item>
    <el-form-item label="Amount" prop="amount">
      <el-input v-model="form.amount" clearable></el-input>
    </el-form-item>
    <el-form-item label="Units" prop="units">
      <el-input v-model="form.units" clearable></el-input>
    </el-form-item>
    <el-form-item class="footer-item">
      <el-button @click="handleCancel"> Cancel </el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss">
.save-form {
  .el-input {
    width: 100%;
  }

  .footer-item {
    margin-bottom: 0;

    .el-form-item__content {
      justify-content: flex-end;
    }
  }
}
</style>
