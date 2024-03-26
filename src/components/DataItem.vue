<script setup lang="ts">
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import { API, RESULT_CODE } from '@/func'
import { ElMessage } from 'element-plus'
import { i18n } from '@/i18n'
import { NO_CODE } from '@/func'

const props = defineProps(['data'])

const libraryStore = useLibraryStore()

const editing = ref(false)
const code = ref('')
const isOk = ref(!!props.data.nfo)
const needEditCode = ref(props.data.code == NO_CODE)
const showDetail = ref(false)
const detailLoading = ref(false)
const defaultNfo: MovieNfo = {
  title: '',
  originaltitle: '',
  rating: '0',
  plot: '',
  runtime: '',
  genre: [],
  tag: [],
  country: '',
  premiered: '',
  studio: '',
  actor: []
}
const nfoData = ref(defaultNfo)

const rate = ref(0)

const select = () => {}

const click = () => {
  if (needEditCode.value) {
    return edit()
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

const detail = () => {
  showDetail.value = true
  // 加载nfo数据，如果已经刮削过的话
  if (!isOk.value) return
  detailLoading.value = true

  API.LoadNfo(props.data.nfo).then((result) => {
    if (result.errCode == RESULT_CODE.ERROR) {
      return ElMessage.error(result.errMsg)
    }
    if (result.errCode == RESULT_CODE.NOT_FOUND) {
      return ElMessage.error(i18n.global.t('NfoNotFound', props.data.nfo))
    }
    const nfo: { movie: MovieNfo } = JSON.parse(result.data)
    nfoData.value = nfo.movie
    rate.value = (parseFloat(nfo.movie.rating) / 10) * 5
    detailLoading.value = false
    return
  })
}
</script>
<style scoped>
.item {
  width: 185px;
  --el-card-padding: 0;
}

.poster {
  width: 100%;
  height: 170px;
  cursor: pointer;
}

.card-header {
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
}
.el-card__body {
  position: relative;
}
.el-card__body .status-icon {
  position: absolute;
  bottom: 0;
  right: 2px;
}
.icon-btn {
  cursor: pointer;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>

<template>
  <el-card class="item" @click.stop="select" v-loading="data.loading" shadow="hover">
    <template #header>
      <div class="card-header">
        <el-link size="large" tag="b" v-if="!editing" @click.stop="click"
          >{{ data.code == NO_CODE ? $t('NoCode') : data.code }}
          <el-icon color="red" class="el-icon--right" v-if="needEditCode"><Edit /></el-icon>
          <el-icon class="el-icon--right" v-if="!needEditCode"><View /></el-icon>
        </el-link>
        <div v-if="editing">
          <el-input size="small" v-model="code" style="width: 80px" placeholder="ADN-001" />
          <el-button class="el-icon--right" size="small" @click.stop="saveCode" type="primary">
            <el-icon><Check /></el-icon>
          </el-button>
          <el-button
            size="small"
            @click.stop="editing = false"
            type="danger"
            style="margin-left: 4px"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <el-dropdown v-if="!editing && !isOk" trigger="click">
          <el-icon class="icon-btn"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.stop="ignore">{{ $t('IgnoreDataItem') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <div style="position: relative" @click.stop="detail">
      <el-image class="poster" fit="contain" :src="data.poster"></el-image>
      <div class="status-icon">
        <el-icon color="green" v-if="isOk"><SuccessFilled /></el-icon>
      </div>
    </div>
  </el-card>
  <el-dialog v-model="showDetail" :title="data.code" width="90%">
    <div v-if="detailLoading">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" />
          <el-row :gutter="20">
            <el-col :span="12">
              <el-skeleton-item variant="image" style="width: 140px; height: 200px" />
            </el-col>
            <el-col :span="12">
              <el-skeleton-item variant="image" style="width: 200px; height: 140px" />
            </el-col>
          </el-row>
        </template>
      </el-skeleton>
    </div>
    <div v-if="!detailLoading">
      <el-descriptions :title="nfoData.title ? nfoData.title : data.name" :column="3" border>
        <el-descriptions-item :label="$t('OriginalTitle')" :span="3">
          {{ nfoData.originaltitle }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Country')"> {{ nfoData.country }} </el-descriptions-item>
        <el-descriptions-item :label="$t('Premiered')">
          {{ nfoData.premiered }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Rating')">
          <el-rate v-model="rate" disabled text-color="#ff9900" />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Studio')"> {{ nfoData.studio }} </el-descriptions-item>
        <el-descriptions-item :label="$t('Director')">
          {{ nfoData.director }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Runtime')"> {{ nfoData.runtime }}</el-descriptions-item>
        <el-descriptions-item :label="$t('Description')" :span="3" width="80">
          {{ nfoData.plot }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Actor')" :span="3">
          <el-tag
            size="large"
            effect="dark"
            type="primary"
            v-for="a in nfoData.actor"
            :key="a.name"
          >
            {{ a.name }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Tag')" :span="3">
          <el-tag effect="plain" size="small" v-for="t in nfoData.tag" :key="t">
            {{ t }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Files')" :span="3">
          <div v-for="p in data.files" :key="p">{{ p }}</div>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Poster')" :span="3">
          <div>{{ data.poster }}</div>
          <el-image
            style="width: 150px"
            :src="data.poster"
            fill="container"
            :preview-src-list="[data.poster]"
          />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Fanart')" :span="3">
          <div>{{ data.fanart }}</div>
          <el-image
            style="width: 300px"
            :src="data.fanart"
            fill="container"
            :preview-src-list="[data.fanart]"
          />
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
