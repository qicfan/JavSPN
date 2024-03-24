<script setup lang="ts">
import { reactive } from 'vue'
import { useSettingStore } from '../../stores/setting'

const settingStore = useSettingStore()

const form = reactive({
  use_proxy: settingStore.settings.Network.use_proxy == 'yes' ? true : false,
  timeout: parseInt(settingStore.settings.Network.timeout),
  retry: parseInt(settingStore.settings.Network.retry),
  proxy: settingStore.settings.Network.proxy
})
const onSubmit = () => {
  const network = {
    use_proxy: form.use_proxy ? 'yes' : 'no',
    proxy: form.proxy,
    retry: form.retry,
    timeout: form.timeout
  }
  settingStore.settings.Network = network
  settingStore.saveInit().then((r: any) => {
    console.log(r)
  })
}
</script>

<template>
  <div>
    <el-card style="max-width: 90%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('Network') }}</span>
        </div>
      </template>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item :label="$t('UseProxy')">
          <el-switch v-model="form.use_proxy" />
        </el-form-item>
        <el-alert type="info" :closable="false">
          <p>支持 http, socks5/socks5h，如: http://192.168.1.1:1080; socks5://192.168.1.1:1081</p>
        </el-alert>
        <el-form-item :label="$t('Proxy')" v-if="form.use_proxy">
          <el-input v-model="form.proxy" />
        </el-form-item>
        <el-form-item :label="$t('RetryCount')">
          <el-input type="number" v-model="form.retry" style="width: 60px"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('Timeout')">
          <el-input type="number" v-model="form.timeout" style="width: 120px">
            <template #append>{{ $t('Second') }}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t('Save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
