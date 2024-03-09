<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import Papa from 'papaparse'
import { storeToRefs } from 'pinia'

import { useDDialog } from '@/stores/dialog.store'

import type { UploadProps } from 'element-plus'

const gstins = ref('')
const dialog = useDDialog()

const { model } = storeToRefs(dialog)

const onRemove: UploadProps['onRemove'] = () => {
  gstins.value = ''
  model.value.data.gstins = ''
}

const handleRequest: UploadProps['httpRequest'] = (options) => {
  return new Promise((resolve, reject) => {
    Papa.parse(options.file, {
      header: true,
      step(row) {
        const gstin = (row.data as { [key: string]: string })['GST IN']
        if (gstin && /\d{2}[A-Z]{5}\d{4}[A-Z][\dA-Z]Z[\dA-Z]/.test(gstin)) {
          gstins.value += `${gstin},`
        }
      },
      complete() {
        gstins.value = gstins.value.replace(/,\s*$/, '')
        model.value.data.gstins = gstins.value

        resolve('All done!')
      },
      error: () => {
        reject('Something went wrong!')
      }
    })
  })
}
</script>

<template>
  <el-upload
    class="w-full"
    accept="text/csv"
    drag
    multiple
    action=""
    :limit="1"
    :http-request="handleRequest"
    :on-remove="onRemove"
  >
    <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
    <div class="el-upload__text">
      Drop CSV file here or <em>click to upload</em>
    </div>
  </el-upload>
  <el-input
    v-model="gstins"
    :autosize="{ minRows: 4, maxRows: 6 }"
    type="textarea"
    placeholder="Please input"
  />
</template>
