import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const currentOperation = ref('')
  const loading = ref(false)
  const result = ref('')

  const setResult = (rs: string) => {
    result.value = rs
  }

  const setCurrentOperation = (str: string) => {
    currentOperation.value = str
  }

  const setLoading = () => {
    loading.value = !loading.value
  }

  const op = (msg: string) => {
    loading.value = true
    currentOperation.value = msg
  }

  const reset = () => {
    loading.value = false
    currentOperation.value = ''
  }

  return {
    loading,
    currentOperation,
    result,
    setCurrentOperation,
    setLoading,
    reset,
    op,
    setResult
  }
})
