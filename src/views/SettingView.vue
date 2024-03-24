<script setup lang="ts">
import { useSettingStore } from '../stores/setting'

const settingStore = useSettingStore()

settingStore.loadIni()
</script>

<template>
  <el-row style="height: 100vh">
    <el-col :span="4">
      <el-menu
        :router="true"
        default-active="/library"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        style="min-height: 100vh; height: 100%"
      >
        <el-menu-item index="/library">
          <el-icon><Menu /></el-icon>
          <span>{{ $t('Library') }}</span>
        </el-menu-item>
        <el-menu-item index="/network">
          <span>{{ $t('Network') }}</span>
        </el-menu-item>
        <el-menu-item index="/file">
          <span>{{ $t('File') }}</span>
        </el-menu-item>
        <el-menu-item index="/translate">
          <span>{{ $t('Translate') }}</span>
        </el-menu-item>
        <el-menu-item index="/naming">
          <span>{{ $t('NamingRule') }}</span>
        </el-menu-item>
        <el-menu-item index="/other">
          <span>{{ $t('Other') }}</span>
        </el-menu-item>
      </el-menu>
      <!-- <h5 class="mb-2">JavSP</h5>
      <el-menu
        default-active="/setting/library"
        :router="true"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
      >
        <el-menu-item index="/setting/file">
          <span>File</span>
        </el-menu-item>
      </el-menu> -->
    </el-col>
    <el-col :span="20" style="padding: 20px">
      <RouterView />
    </el-col>
  </el-row>
</template>
