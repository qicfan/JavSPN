<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['title', 'icon', 'color', 'loading'])
const emit = defineEmits(['buttonClick'])
const defaultSize = 32
const focusSize = 38
const iconSize = ref(defaultSize)

const iconFocus = () => {
  iconSize.value = focusSize
}

const iconBlur = () => {
  iconSize.value = defaultSize
}

const handleClick = () => {
  if (props.loading) return
  emit('buttonClick')
}
</script>
<template>
  <div
    @mouseenter="iconFocus()"
    @mouseleave="iconBlur()"
    @click="handleClick"
    :class="{ none: loading }"
  >
    <div style="height: 42px">
      <el-icon :size="iconSize" :color="loading ? 'ccc' : color"><component :is="icon" /></el-icon>
    </div>
    <div>
      {{ title }}
    </div>
  </div>
</template>
<style scoped>
.none {
  cursor: wait;
}
</style>
