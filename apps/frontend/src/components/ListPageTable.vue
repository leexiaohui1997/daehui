<template>
  <a-table
    v-model:selected-keys="selectedKeys"
    :columns="extraColumns"
    :data="data"
    :loading="loading"
    :bordered="true"
    :column-resizable="false"
    :row-key="'id'"
    :scroll="{ x: 2000 }"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
      onlyCurrent: false,
    }"
    @sorter-change="
      (dataIndex, direction) => emits('sorterChange', dataIndex, direction)
    ">
    <template #index="{ rowIndex }">
      {{ rowIndex + 1 }}
    </template>

    <template
      v-for="column in columns"
      :key="column.dataIndex"
      #[column.dataIndex]="{ rowIndex }">
      <span>{{ formatColumnValue(column, rowIndex) || '-' }}</span>
    </template>

    <template #table-operate="{ rowIndex }">
      <a-space align="center">
        <slot
          name="table-operate"
          :row-index="rowIndex"
          :row="data[rowIndex]!" />
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts" generic="T extends ListPageData">
import { TableColumnData } from '@arco-design/web-vue'
import { omit } from 'lodash-es'
import { computed, useSlots } from 'vue'

import { type Column, FORMATTER_MAP, ListPageData } from '@/utils/list-module'

const props = withDefaults(
  defineProps<{
    selectedIds?: (string | number)[]
    data?: T[]
    columns?: Column<T>[]
    loading?: boolean
    operateColumn?: Partial<Column<T>>
  }>(),
  {
    selectedIds: () => [],
    data: () => [],
    columns: () => [],
    operateColumn: () => ({}),
  },
)

const emits = defineEmits<{
  (e: 'sorterChange', dataIndex: string, direction: string): void
  (e: 'update:selectedIds', value: (string | number)[]): void
}>()

const selectedKeys = computed({
  get: () => props.selectedIds,
  set: val => emits('update:selectedIds', val),
})

const slots = useSlots()
const hasTableOperateSlot = computed(() => !!slots['table-operate'])

const extraColumns = computed(() => {
  const columns: TableColumnData[] = [
    {
      title: '序号',
      dataIndex: 'index',
      slotName: 'index',
      width: 68,
      fixed: 'left',
    },
  ]

  props.columns.forEach(column => {
    const tooltip = column.tooltip ?? true
    columns.push({
      ...omit(column, 'formatType', 'tooltip'),
      slotName: column.dataIndex,
      ellipsis: column.ellipsis ?? true,
      tooltip:
        tooltip === true
          ? {
              position: 'br',
            }
          : column.tooltip,
    })
  })

  if (hasTableOperateSlot.value) {
    columns.push({
      title: '操作',
      fixed: 'right',
      slotName: 'table-operate',
      ...props.operateColumn,
    })
  }

  return columns
})

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
