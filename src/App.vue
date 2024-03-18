<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app';
import { ref } from 'vue';
const appStore = useAppStore()

const locale = ref()
locale.value = appStore.elementPlusLocale

</script>

<template>
  <el-config-provider :locale="locale">
    <div class="common-layout">
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <RouterView />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </div>
  </el-config-provider>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.common-layout {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
