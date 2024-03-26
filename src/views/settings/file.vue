<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useSettingStore } from '../../stores/setting'
import { i18n } from '../../i18n'
import { ElMessage } from 'element-plus'

const settingStore = useSettingStore()

const addExtVisible = ref(false)
const addExtModel = ref('')

const form = reactive({
  scan_dir: settingStore.settings.File.scan_dir, // 不允许编辑，在GUI下不生效，使用媒体库路径代替
  media_ext: settingStore.settings.File.media_ext.split(';'),
  ignore_folder: settingStore.settings.File.ignore_folder,
  ignore_video_file_less_than: parseInt(settingStore.settings.File.ignore_video_file_less_than),
  enable_file_move: false // GUI下默认不允许整理文件
})
const onSubmit = () => {
  const d = {
    scan_dir: form.scan_dir,
    media_ext: form.media_ext.join(';'),
    ignore_folder: form.ignore_folder.trim(),
    ignore_video_file_less_than: form.ignore_video_file_less_than,
    enable_file_move: 'no'
  }
  settingStore.settings.File = d
  settingStore.saveInit().then(
    () => {
      ElMessage.success(i18n.global.t('SaveSuccess'))
    },
    (err) => {
      ElMessage.error(err)
    }
  )
}

const delExt = (ext: string) => {
  const idx = form.media_ext.indexOf(ext)
  if (idx >= 0) {
    form.media_ext.splice(idx, 1)
  }
}

const addExt = () => {
  const ext = addExtModel.value
  if (!ext) return
  const idx = form.media_ext.indexOf(ext)
  if (idx >= 0) {
    ElMessage.error(i18n.global.t('IsExists', { ext }))
    return
  }
  form.media_ext.push(ext)
  addExtModel.value = ''
  addExtVisible.value = false
}
</script>

<template>
  <div>
    <el-card style="max-width: 90%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('File') }}</span>
        </div>
      </template>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-alert type="info" :closable="false">
          <p>{{ $t('EnableFileMoveHelp') }}</p>
        </el-alert>
        <el-form-item :label="$t('EnableFileMove')">
          <el-switch v-model="form.enable_file_move" :disabled="true" />
        </el-form-item>
        <el-alert type="info" :closable="false">
          <p>{{ $t('MediaExtHelp') }}</p>
        </el-alert>
        <el-form-item :label="$t('MediaExt')">
          <div class="exts">
            <el-tag
              v-for="tag in form.media_ext"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="delExt(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="addExtVisible"
              ref="InputRef"
              v-model="addExtModel"
              style="width: 80px"
              size="small"
              @keyup.enter="addExt"
            ></el-input>
            <el-button
              v-if="addExtVisible"
              type="primary"
              size="small"
              :disabled="!addExtModel"
              @click.stop="addExt"
            >
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button
              v-if="!addExtVisible"
              class="button-new-tag"
              size="small"
              @click.stop="addExtVisible = true"
            >
              + {{ $t('NewExt') }}
            </el-button>
          </div>
        </el-form-item>
        <el-alert type="info" :closable="false">
          <p>{{ $t('IgnoreFolderHelp') }}</p>
        </el-alert>
        <el-form-item :label="$t('IgnoreFolder')" v-if="form.ignore_folder">
          <el-input v-model="form.ignore_folder" />
        </el-form-item>
        <el-alert type="info" :closable="false">
          <p>{{ $t('IgnoreFileSizeHelp') }}</p>
        </el-alert>
        <el-form-item :label="$t('IgnoreFileSize')" v-if="form.ignore_video_file_less_than">
          <el-input-number v-model="form.ignore_video_file_less_than" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t('Save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style scoped>
.exts .el-tag {
  margin-right: 6px;
  font-size: 18px;
}
</style>
