<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLibraryStore } from '../stores/library'

const props = defineProps(['data'])

const libraryStore = useLibraryStore()

const itemBackgroundColor = '#fff'
const itemEnBackgroundColor = '#f4f7f8'
const itemSelectedBackgroundColor = '#efeae8'

const selected = ref(false)

const styleObject = reactive({
  backgroundColor: itemBackgroundColor
})

const editing = ref(false)
const code = ref('')

const mouseen = () => {
  if (!selected.value) {
    styleObject.backgroundColor = itemEnBackgroundColor
  }
}

const mouseout = () => {
  if (!selected.value) {
    styleObject.backgroundColor = itemBackgroundColor
  }
}

const select = () => {
  selected.value = !selected.value
  if (selected.value) {
    styleObject.backgroundColor = itemSelectedBackgroundColor
  }
}

const ignore = () => {
  libraryStore.ignoreDataItem(props.data.id)
}

const edit = () => {
  editing.value = true
}

const saveCode = () => {
  if (!code.value || code.value.length <= 5) return
  libraryStore.saveCode(props.data.id, code.value)
  editing.value = false
}
</script>
<style scoped>
.item {
  position: relative;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
.item-p {
  display: flex;
  justify-content: start;
  align-items: center;
}

.item-code {
  font-weight: bold;
  margin-right: 10px;
}

.item-p .el-tag {
  margin-right: 6px;
}

.item .status-icon {
  position: absolute;
  top: 0;
  right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div
    class="item"
    :style="styleObject"
    @click="select"
    @mouseenter="mouseen"
    @mouseleave="mouseout"
    v-loading="data.loading"
  >
    <p class="item-p">
      <el-text v-if="!editing" size="large" class="mx-1 item-code">
        {{ !data.code || data.code == '无法识别番号' ? $t('NoCode') : data.code }}
      </el-text>
      <span v-if="editing">
        <el-input v-model="code" style="width: 80px" />
        <el-button size="small" @click.stop="saveCode">保存</el-button>
      </span>
      <template v-if="!editing">
        <el-button @click.stop="ignore" size="small" v-if="!data.nfo">
          {{ $t('IgnoreDataItem') }} <el-icon><Warning /></el-icon>
        </el-button>
        <el-button
          @click.stop="edit"
          size="small"
          type="warning"
          v-if="data.code == '无法识别番号'"
        >
          {{ $t('EditCode') }}
        </el-button>
        <!-- <el-tag size="small" type="primary">中文字幕</el-tag>
        <el-tag size="small" type="primary">有码</el-tag> -->
      </template>
    </p>
    <p>
      <el-text class="mx-1" line-clamp="1">{{ data.name }}</el-text>
    </p>
    <div class="status-icon">
      <el-icon color="green" v-if="data.nfo"><SuccessFilled /></el-icon>
      <el-icon color="red" v-if="!data.code || data.code == '无法识别番号'"
        ><WarningFilled
      /></el-icon>
    </div>
  </div>
</template>
