<script setup lang="ts">
import { reactive } from 'vue'
import { useSettingStore } from '../../stores/setting'
import { ElMessage } from 'element-plus'
import { i18n } from '@/i18n'

const settingStore = useSettingStore()
const engineMap: string[] = ['google', 'baidu', 'bing']

const form = reactive({
  enable_translate: settingStore.settings.Translate.engine == '' ? false : true,
  engine: settingStore.settings.Translate.engine,
  baidu_appid: settingStore.settings.Translate.baidu_appid,
  baidu_key: settingStore.settings.Translate.baidu_key,
  bing_key: settingStore.settings.Translate.bing_key,
  translate_title: settingStore.settings.Translate.translate_title == 'yes',
  translate_plot: settingStore.settings.Translate.translate_plot == 'yes'
})
const onSubmit = () => {
  const d = {
    engine: form.engine,
    baidu_appid: form.baidu_appid,
    baidu_key: form.baidu_key,
    bing_key: form.bing_key,
    translate_title: form.translate_title ? 'yes' : 'no',
    translate_plot: form.translate_plot ? 'yes' : 'no'
  }
  settingStore.settings.Translate = d
  settingStore.saveInit().then(
    () => {
      ElMessage.success(i18n.global.t('SaveSuccess'))
    },
    (err) => {
      ElMessage.error(err)
    }
  )
}
</script>

<template>
  <div>
    <el-card style="max-width: 90%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('Translate') }}</span>
        </div>
      </template>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item :label="$t('EnableTranslate')">
          <el-switch v-model="form.enable_translate" />
        </el-form-item>
        <el-form-item :label="$t('TranslateTitle')">
          <el-switch v-model="form.translate_title" />
        </el-form-item>
        <el-form-item :label="$t('TranslatePlot')">
          <el-switch v-model="form.translate_plot" />
        </el-form-item>
        <el-form-item :label="$t('TranslateEngine')" v-if="form.enable_translate">
          <el-select v-model="form.engine" placeholder="Select" style="width: 160px">
            <el-option v-for="item in engineMap" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Baidu appid')"
          v-if="form.enable_translate && form.engine == 'baidu'"
        >
          <el-input v-model="form.baidu_appid" style="width: 100px"> </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('Baidu key')"
          v-if="form.enable_translate && form.engine == 'baidu'"
        >
          <el-input v-model="form.baidu_key" style="width: 200px"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('Bing key')" v-if="form.enable_translate && form.engine == 'bing'">
          <el-input v-model="form.bing_key" style="width: 300px"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t('Save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
