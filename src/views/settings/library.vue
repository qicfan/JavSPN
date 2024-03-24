<script setup lang="ts">
import { useAppStore } from '../../stores/app'

const app = useAppStore()

const del = (p: string) => {
  app.delLibraryPath(p)
  window.electronAPI.editLibraryPath()
}
</script>

<template>
  <div>
    <el-card style="max-width: 90%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('ManagerLibrary') }}</span>
          <el-button
            size="small"
            style="margin-left: 20px"
            type="primary"
            @click.stop="app.chooseDirectory"
            >{{ $t('AddLibraryPath') }}</el-button
          >
        </div>
      </template>
      <el-row justify="space-between" v-for="p in app.libraryPath" :key="p">
        <el-col :span="22">
          <p class="text item">{{ p }}</p>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="danger" @click.stop="del(p)"
            ><el-icon><Delete /></el-icon
          ></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
