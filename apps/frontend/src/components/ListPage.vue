<template>
  <div class="list-page">
    <ListPageTable
      :columns="tableColumns"
      :data="listData"
      :loading="loading"
      :pagination="false" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { Message } from '@arco-design/web-vue'
import {
  getErrorMsg,
  type PaginationParams,
  type PaginationResponse,
} from '@daehui/shared'
import { computed, onMounted, ref, shallowRef } from 'vue'

import type { Column } from '@/utils/list-module'

import ListPageTable from './ListPageTable.vue'

const props = defineProps<{
  listMethod: (params: PaginationParams) => Promise<PaginationResponse<T>>
  tableColumns?: Column<T>[]
}>()

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const listData = shallowRef<T[]>([])
const loading = ref(false)

const requestParams = computed<PaginationParams>(() => ({
  page: page.value,
  pageSize: pageSize.value,
  conditions: [],
  sort: [],
}))

const fetchList = async () => {
  if (loading.value) {
    return
  }

  try {
    loading.value = true
    const res = await props.listMethod(requestParams.value)
    listData.value = res.list
    total.value = res.total
  } catch (error) {
    Message.error(getErrorMsg(error))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style lang="less" scoped>
.list-page {
  gap: @size-4;
  padding: @size-6;
  display: flex;
  flex-direction: column;
}
</style>
