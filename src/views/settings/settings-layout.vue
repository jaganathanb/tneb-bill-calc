<script lang="ts" setup>
import { Calendar, Select, User } from '@element-plus/icons-vue'
import { CronElementPlus } from '@vue-js-cron/element-plus'
import { storeToRefs } from 'pinia'

import { useSettingsStore } from '@/stores/settings.store'
import { useAuthStore, useFeedbackStore } from '@/stores'

import type { FormInstance } from 'element-plus'

const settingsStore = useSettingsStore()
const feedback = useFeedbackStore()
const authStore = useAuthStore()
const settingsFormReference = ref<FormInstance>()

const { settings, progress } = storeToRefs(settingsStore)
const { currentUser } = storeToRefs(authStore)

const onUpdateSettings = (reference: FormInstance | undefined) => {
  if (!reference) {
    return
  }

  reference.validate(async (valid) => {
    if (valid) {
      progress.value = true
      settings.value.modifiedBy = currentUser.value?.id as number
      const value = await settingsStore.update(unref(settings))

      if (value) {
        feedback.setMessage({
          message: 'Updated settings successfully',
          type: 'success'
        })
      } else {
        feedback.setMessage({
          message: 'Update to settings failed',
          type: 'error'
        })
      }
    }
  })
}

onMounted(async () => {
  await settingsStore.getAll()
})
</script>

<template>
  <el-row class="flex-justify-end">
    <el-button
      v-loading="progress"
      class="m-2"
      :icon="Select"
      type="primary"
      @click="onUpdateSettings(settingsFormReference)"
      >Save</el-button
    >
  </el-row>
  <el-collapse :model-value="'1'" accordion>
    <el-collapse-item name="1">
      <template #title>
        <el-icon class="mr-2"><User /></el-icon>
        <el-text> GST Master User Detail </el-text>
      </template>
      <el-card>
        <el-form
          ref="settingsFormReference"
          :label-position="'top'"
          label-width="auto"
          :model="settings"
          style="max-width: 600px"
        >
          <el-form-item label="User name">
            <el-input v-model="settings.gstUsername" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="settings.gstPassword" />
          </el-form-item>
          <el-form-item label="Base url">
            <el-input v-model="settings.gstBaseUrl" />
          </el-form-item>
        </el-form>
      </el-card>
    </el-collapse-item>
    <el-collapse-item>
      <template #title>
        <el-icon class="mr-2"><Calendar /></el-icon>
        <el-text> Schedule GST Status Job </el-text>
      </template>
      <el-row>
        <cron-element-plus
          v-model="settings.crontab"
          :button-props="{ type: 'primary' }"
        />
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-col {
  margin-bottom: 8px;
}
</style>
