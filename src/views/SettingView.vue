<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { useLibraryStore } from '../stores/library'
const app = useAppStore()
const libraryStore = useLibraryStore()
</script>

<template>
  <el-row class="tac">
    <el-col :span="4">
      <h5 class="mb-2">JavSPN</h5>
      <el-menu default-active="/setting/library" :router="true" class="el-menu-vertical-demo">
        <el-menu-item index="/setting/library">
          <el-icon><Menu /></el-icon>
          <span>媒体库</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <RouterView />
    </el-col>
  </el-row>
</template>
