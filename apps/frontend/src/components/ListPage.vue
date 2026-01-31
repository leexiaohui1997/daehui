<template>
  <div class="list-page">
    <ListPageTable
      :columns="tableColumns"
      :data="listData"
      :loading="loading"
      :pagination="false" />

    <a-space fill direction="vertical" align="end">
      <a-pagination
        v-model:page-size="pageSize"
        v-model:current="page"
        :total="total"
        :show-total="true"
        :show-jumper="true"
        :show-page-size="true" />
    </a-space>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Message } from '@arco-design/web-vue'
import {
  getErrorMsg,
  type PaginationParams,
  type PaginationResponse,
} from '@daehui/shared'
import { computed, effect, ref, shallowRef, watch } from 'vue'

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

effect(() => console.log(page.value))

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

  console.log(requestParams.value)
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

watch(requestParams, fetchList, { deep: true, immediate: true })
</script>

<style lang="less" scoped>
.list-page {
  gap: @size-4;
  padding: @size-6;
  display: flex;
  flex-direction: column;
}
</style>
