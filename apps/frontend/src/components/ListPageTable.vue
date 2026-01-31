<template>
  <a-table
    :columns="extraColumns"
    :data="data"
    :loading="loading"
    :bordered="true"
    :column-resizable="false"
    :row-key="'id'">
    <template
      v-for="column in columns"
      :key="column.dataIndex"
      #[column.dataIndex]="{ rowIndex }">
      <span>{{ formatColumnValue(column, rowIndex) || '-' }}</span>
    </template>
  </a-table>
</template>

<script setup lang="ts" generic="T">
import { omit } from 'lodash-es'
import { computed } from 'vue'

import { type Column, FORMATTER_MAP } from '@/utils/list-module'

const props = withDefaults(
  defineProps<{
    data?: T[]
    columns?: Column<T>[]
    loading?: boolean
  }>(),
  {
    data: () => [],
    columns: () => [],
  },
)

const extraColumns = computed(() =>
  props.columns.map(column => ({
    ...omit(column, 'formatType', 'tooltip'),
    slotName: column.dataIndex,
    tooltip:
      column.tooltip === true
        ? {
            position: 'br',
          }
        : column.tooltip,
  })),
)

const formatColumnValue = (column: Column<T>, rowIndex: number) => {
  const row = props.data[rowIndex]
  if (!row) return ''

  const value = row[column.dataIndex]

  if (column.formatType) {
    return FORMATTER_MAP[column.formatType](value)
  }

  return `${value}`
}
</script>
