<template>
  <div class="list-page">
    <template v-if="$slots['actions']">
      <a-space align="center" full>
        <slot name="actions" :add-row="addRow" />
      </a-space>
    </template>

    <ListPageTable
      :columns="tableColumns"
      :data="listData"
      :loading="loading"
      :pagination="false"
      :operate-column="tableOperateColumn">
      <template v-if="$slots['table-operate']" #table-operate="scope">
        <slot
          name="table-operate"
          :on-edit="() => editRow(scope.row)"
          v-bind="scope" />
      </template>
    </ListPageTable>

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

  <a-modal
    v-model:visible="modalVisible"
    :title="modalTitle"
    @before-ok="onModalBeforeOk">
    <a-form
      ref="create-form"
      :model="[modalFormValue as Record<string, unknown>][0]!"
      :rules="createFormRules">
      <slot name="create-form" :form-value="modalFormValue" :is-edit="isEdit" />
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { FieldRule, Message, TableData } from '@arco-design/web-vue'
import {
  getErrorMsg,
  type PaginationParams,
  type PaginationResponse,
} from '@daehui/shared'
import { pick } from 'lodash-es'
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue'

import type { Column } from '@/utils/list-module'

import ListPageTable from './ListPageTable.vue'

export enum ModalType {
  Create = 1,
  Update = 2,
}

const MODAL_TYPE_LABEL_MAP: Record<ModalType, string> = {
  [ModalType.Create]: '创建',
  [ModalType.Update]: '编辑',
}
</script>

<script setup lang="ts" generic="T extends TableData, C extends Partial<T>">
const props = defineProps<{
  entityName: string
  tableColumns?: Column<T>[]
  tableOperateColumn?: Partial<Column<T>>
  createFormInitData?: C
  createFormRules?: Record<string, FieldRule | FieldRule[]>
  listMethod?: (params: PaginationParams) => Promise<PaginationResponse<T>>
  createMethod?: (data: C) => Promise<unknown>
  updateMethod?: (data: C, row: T) => Promise<unknown>
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
    const res = await props.listMethod?.(requestParams.value)
    if (res) {
      listData.value = res.list
      total.value = res.total
    }
  } catch (error) {
    Message.error(getErrorMsg(error))
  } finally {
    loading.value = false
  }
}

watch(requestParams, fetchList, { deep: true, immediate: true })

const modalType = ref<ModalType>()
const editingRow = ref<T>()

const modalVisible = computed({
  get: () => !!modalType.value,
  set: () => {
    modalType.value = undefined
    editingRow.value = undefined
  },
})
const modalTitle = computed(() => {
  if (!modalType.value) return ''
  return `${MODAL_TYPE_LABEL_MAP[modalType.value]}${props.entityName}`
})
const modalFormValue = ref<C>({
  ...(props.createFormInitData as C),
})

const isEdit = computed(() => modalType.value === ModalType.Update)
const modalRef = useTemplateRef('create-form')
const modalLoading = ref(false)

const onModalBeforeOk = async () => {
  if (modalLoading.value) return false
  if (!modalType.value) return false

  try {
    const validateErrors = await modalRef.value?.validate?.()
    if (validateErrors) {
      return false
    }

    modalLoading.value = true

    if (modalType.value === ModalType.Create) {
      await props.createMethod?.(modalFormValue.value)
    } else if (editingRow.value) {
      await props.updateMethod?.(modalFormValue.value, editingRow.value)
    }

    Message.success(`${modalTitle.value}成功`)
    fetchList()
  } catch (error) {
    Message.error(getErrorMsg(error))
    return false
  } finally {
    modalLoading.value = false
  }
}

const editRow = (row: T) => {
  modalType.value = ModalType.Update
  editingRow.value = row
  modalFormValue.value = { ...pick(row, ...Object.keys(modalFormValue.value)) }
}

const addRow = () => {
  modalType.value = ModalType.Create
  editingRow.value = undefined
  modalFormValue.value = { ...(props.createFormInitData as C) }
}
</script>

<style lang="less" scoped>
.list-page {
  gap: @size-4;
  padding: @size-6;
  display: flex;
  flex-direction: column;
}
</style>
