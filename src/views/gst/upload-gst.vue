<script setup lang="ts">
import { Delete, Plus, Switch, UploadFilled } from '@element-plus/icons-vue'
import Papa from 'papaparse'
import { storeToRefs } from 'pinia'
import { uniqBy } from 'lodash'

import { useDDialog } from '@/stores/dialog.store'
import { useFeedbackStore } from '@/stores/feedback.store'

import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus'

const dialog = useDDialog()
const feedback = useFeedbackStore()

const gstColumns = [
  { label: 'S.No', value: 'sno' },
  { label: 'F.No', value: 'fno' },
  { label: 'Gstin', value: 'gstin' },
  { label: 'Mobile number', value: 'mobileNumber' },
  { label: 'Trade name', value: 'tradeName' },
  { label: 'Email', value: 'email' }
]

const fileList = ref<UploadUserFile[]>()
const gsts: any[] = []
const gstins = ref('')
const xlColumns = ref<{ label: string; value: string }[]>([])
const columnMapForm = reactive({
  columns: [{ gst: '', xl: '' }]
})
const columnFormReference = ref<FormInstance>()

const { isOpen, inProgress } = storeToRefs(dialog)

const onRemove: UploadProps['onRemove'] = () => {
  xlColumns.value = []
}

const handleRequest: UploadProps['httpRequest'] = (options) => {
  return new Promise((resolve, reject) => {
    Papa.parse(options.file, {
      header: true,
      step(row) {
        const gstin = (row.data as { [key: string]: string })['GST IN']
        if (gstin && /\d{2}[A-Z]{5}\d{4}[A-Z][\dA-Z]Z[\dA-Z]/.test(gstin)) {
          gsts.push(row.data)
        }
      },
      complete() {
        xlColumns.value = Object.keys(gsts[0]).map((g) => ({
          label: g,
          value: g
        }))
        resolve('All done!')
      },
      error: () => {
        reject('Something went wrong!')
      }
    })
  })
}

const addAnotherRow = () => {
  columnMapForm.columns.push({ gst: '', xl: '' })
}

const removeRow = (rowIndex: number) => {
  if (rowIndex !== -1) {
    columnMapForm.columns.splice(rowIndex, 1)
  }
}

const submitGsts = async (formElement: FormInstance | undefined) => {
  if (!formElement) return

  let mappedGst: Gst[] = []

  if (fileList.value) {
    formElement.validate((valid) => {
      if (valid) {
        mappedGst = uniqBy(
          gsts.map(
            (g) =>
              ({
                sno: g[
                  columnMapForm.columns.find((c) => c.gst === 'sno')
                    ?.xl as string
                ],
                fno: g[
                  columnMapForm.columns.find((c) => c.gst === 'fno')
                    ?.xl as string
                ],
                gstin:
                  g[
                    columnMapForm.columns.find((c) => c.gst === 'gstin')
                      ?.xl as string
                  ],
                mobileNumber:
                  g[
                    columnMapForm.columns.find((c) => c.gst === 'mobileNumber')
                      ?.xl as string
                  ],
                name: g[
                  columnMapForm.columns.find((c) => c.gst === 'name')
                    ?.xl as string
                ],
                tradeName:
                  g[
                    columnMapForm.columns.find((c) => c.gst === 'tradeName')
                      ?.xl as string
                  ],
                email:
                  g[
                    columnMapForm.columns.find((c) => c.gst === 'email')
                      ?.xl as string
                  ]
              }) as Gst
          ),
          'gstin'
        )

        dialog.setData(mappedGst)
      } else {
        return false
      }
    })
  } else {
    const gstinIds = gstins.value
      .split(',')
      .map((g) => g.trim())
      .filter((g) => /\d{2}[A-Z]{5}\d{4}[A-Z][\dA-Z]Z[\dA-Z]/.test(g))
    if (gstinIds.length === 0) {
      feedback.setMessage({
        type: 'error',
        message: 'Atleast 1 GSTIN required to submit.'
      })
      return false
    } else {
      mappedGst = gstinIds.map((g) => ({ gstin: g }) as Gst)

      dialog.setData(mappedGst)
    }
  }
}
</script>

<template>
  <el-dialog
    v-model="isOpen"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    title="Add GST"
  >
    <template #default>
      <el-input
        v-model="gstins"
        :autosize="{ minRows: 4, maxRows: 6 }"
        type="textarea"
        clearable
        placeholder="Please enter comma (,) separated GSTINs"
      />
      <el-divider>OR</el-divider>
      <el-upload
        v-model:file-list="fileList"
        class="w-full"
        accept="text/csv"
        drag
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
      <p>Map the Excel columns</p>
      <el-container class="wrap">
        <el-form ref="columnFormReference" :model="columnMapForm">
          <div
            v-for="(obj, i) in columnMapForm.columns"
            :key="i"
            class="flex wrap mb-4"
          >
            <el-form-item
              :prop="'columns.' + i + '.gst'"
              :rules="{
                required: true,
                message: 'Can not be empty',
                trigger: 'blur'
              }"
            >
              <el-select-v2
                v-model="obj.gst"
                filterable
                :options="gstColumns"
                placeholder="Please select"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item class="ml-4 mr-4">
              <el-icon><Switch /></el-icon>
            </el-form-item>
            <el-form-item
              :prop="'columns.' + i + '.xl'"
              :rules="{
                required: true,
                message: 'Can not be empty',
                trigger: 'blur'
              }"
            >
              <el-select-v2
                v-model="obj.xl"
                filterable
                :options="xlColumns"
                placeholder="Please select"
                style="width: 240px"
            /></el-form-item>
            <el-button
              v-if="columnMapForm.columns.length > 1"
              class="ml-8"
              @click="removeRow(i)"
              ><el-icon class="danger"> <Delete /> </el-icon
            ></el-button>
          </div>
        </el-form>
        <div class="flex">
          <el-button class="ml-4" @click="addAnotherRow">
            <el-icon class="primary"> <Plus /> </el-icon>
          </el-button>
        </div>
      </el-container>
    </template>
    <template #footer>
      <span>
        <el-button type="danger" @click="isOpen = false"> Cancel </el-button>
        <el-button
          type="primary"
          :loading="inProgress"
          @click="submitGsts(columnFormReference)"
        >
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss">
.center {
  align-items: center;
  margin: 0 8px;
}

.wrap {
  flex-wrap: wrap;
}

.danger {
  color: var(--el-color-danger);
}

.primary {
  color: var(--el-color-primary);
}
</style>
