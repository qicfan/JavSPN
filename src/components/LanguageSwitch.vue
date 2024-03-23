<script setup lang="ts">
import LanguageIcon from './LanguageIcon.vue'
import { SUPPORT_LOCALES } from '../i18n'
import { ref } from 'vue';
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const localeMap: any = {
    'en': 'English',
    'zh-cn': '中文简体'
}

const localeList = ref(SUPPORT_LOCALES)

const changeLocale = (locale: string) => {
    appStore.changeLanguage(locale)
}
</script>
<template>
    <el-dropdown>
        <LanguageIcon style="font-size:38" />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="locale in localeList" v-bind:key="locale" @click="changeLocale(locale)">
                    {{ localeMap[locale] }} &nbsp;&nbsp;<el-icon color="green" v-if="appStore.language == locale"><Select /></el-icon>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>