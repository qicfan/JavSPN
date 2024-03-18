<script setup lang="ts">

</script>

<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple">
        <el-table style="width: 100%" size="small">
          <el-table-column prop="code" label="番号" width="180" />
          <el-table-column prop="name" label="片名" width="180" />
        </el-table>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple-light">{{ $t('About') }}</div>
    </el-col>
  </el-row>
</template>
