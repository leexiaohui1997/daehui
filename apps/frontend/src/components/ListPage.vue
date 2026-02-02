<template>
  <div class="list-page">
    <div v-if="title !== false" class="list-page-title">
      <span>{{ title || `${entityName}配置` }}</span>
    </div>

    <template v-if="filterFields?.length">
      <a-card class="filter-form">
        <a-form
          :model="filterValues"
          :label-col-props="{ flex: '100px' }"
          :wrapper-col-props="{ flex: '1' }">
          <a-row :gutter="[24, 24]">
            <template v-for="item in computedFilterFields" :key="item.field">
              <a-col :span="24 / filterColumn">
                <a-form-item
                  :field="item.field"
                  :label="item.title"
                  :disabled="
                    EMPTY_VALUE_OPERATES.includes(filterOperates[item.field])
                  "
                  show-colon>
                  <div class="filter-form-item">
                    <div class="filter-form-content">
                      <slot :name="`f-${item.field}`" :model="filterValues" />
                    </div>
                    <div class="filter-form-operate">
                      <OperateSelect v-model="filterOperates[item.field]" />
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </template>

            <a-col class="filter-form-actions">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" :loading="loading" @click="handleSearch"
                >搜索</a-button
              >
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </template>

    <a-card>
      <a-space size="medium" direction="vertical" fill>
        <template v-if="$slots['actions']">
          <a-space align="center" fill>
            <slot name="actions" :add-row="addRow" />
          </a-space>
        </template>

        <ListPageTable
          :columns="tableColumns"
          :data="listData"
          :loading="loading"
          :pagination="false"
          :operate-column="tableOperateColumn"
          @sorter-change="onSorterChange">
          <template v-if="$slots['table-operate']" #table-operate="scope">
            <slot
              name="table-operate"
              :on-edit="() => editRow(scope.row)"
              :on-delete="() => onDelete(scope.row)"
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
      </a-space>
    </a-card>
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
import { FieldRule, Message, Modal } from '@arco-design/web-vue'
import {
  EMPTY_VALUE_OPERATES,
  getErrorMsg,
  OperateEnum,
  type PaginationParams,
  type PaginationResponse,
  type SortOrderValue,
} from '@daehui/shared'
import { pick } from 'lodash-es'
import { computed, Ref, ref, shallowRef, useTemplateRef, watch } from 'vue'

import type {
  Column,
  FilterField,
  FilterFormValues,
  FilterObjField,
  ListPageData,
} from '@/utils/list-module'

import ListPageTable from './ListPageTable.vue'
import OperateSelect from './OperateSelect.vue'

export enum ModalType {
  Create = 1,
  Update = 2,
}

const MODAL_TYPE_LABEL_MAP: Record<ModalType, string> = {
  [ModalType.Create]: '创建',
  [ModalType.Update]: '编辑',
}
</script>

<script
  setup
  lang="ts"
  generic="
    T extends ListPageData,
    C extends Partial<T>,
    F extends FilterFormValues<T>
  ">
const props = withDefaults(
  defineProps<{
    title?: string | false
    entityName: string
    tableColumns?: Column<T>[]
    tableOperateColumn?: Partial<Column<T>>
    createFormInitData?: C
    createFormRules?: Record<string, FieldRule | FieldRule[]>
    filterFormValues?: F
    filterFields?: FilterField<keyof T & string>[]
    filterColumn?: number
    listMethod?: (params: PaginationParams) => Promise<PaginationResponse<T>>
    createMethod?: (data: C) => Promise<unknown>
    updateMethod?: (data: C, row: T) => Promise<unknown>
    deleteMethod?: (params: { ids: number[] }) => Promise<unknown>
  }>(),
  {
    title: '',
    filterColumn: 3,
    tableColumns: () => [],
    tableOperateColumn: () => ({}),
    createFormInitData: () => ({}) as C,
    createFormRules: () => ({}),
    filterFormValues: () => ({}) as F,
    filterFields: () => [],
    listMethod: undefined,
    createMethod: undefined,
    updateMethod: undefined,
    deleteMethod: undefined,
  },
)

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const listData = shallowRef<T[]>([])
const loading = ref(false)
const sortState = ref<PaginationParams['sort']>([])

const onSorterChange = (dataIndex: string, direction: string) => {
  if (!direction) {
    sortState.value = []
    return
  }

  sortState.value = [
    {
      field: dataIndex,
      order: (direction === 'ascend' ? 'asc' : 'desc') as SortOrderValue,
    },
  ]
}

const applyCondition = ref('')
const requestParams = computed<PaginationParams>(() => ({
  page: page.value,
  pageSize: pageSize.value,
  conditions: [applyCondition.value],
  sort: sortState.value,
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

const onDelete = (row: T) => {
  Modal.warning({
    title: `删除${props.entityName}`,
    content: `确定要删除该${props.entityName}吗？`,
    hideCancel: false,
    onBeforeOk: async () => {
      try {
        await props.deleteMethod?.({ ids: [row.id] })
        Message.success('删除成功')
        fetchList()
        return true
      } catch (error) {
        Message.error(getErrorMsg(error))
        return false
      }
    },
  })
}

const computedFilterFields = computed(() => {
  const fields: FilterObjField<keyof T & string>[] = []
  props.filterFields?.forEach(field => {
    if (typeof field === 'string') {
      fields.push({ field })
    } else {
      fields.push(field)
    }
  })

  return fields.map(field => {
    const tTitle = props.tableColumns.find(
      item => item.dataIndex === field.field,
    )?.title
    const title =
      field.title || (typeof tTitle === 'string' ? tTitle : '') || ''
    return {
      ...field,
      title,
      operate: field.operate || OperateEnum.Equal,
    }
  })
})

const filterValues = ref(
  Object.assign({}, (props.filterFormValues || {}) as F),
) as Ref<F>

const filterOperates = ref(
  Object.fromEntries(
    computedFilterFields.value.map(item => [item.field, item.operate]),
  ),
) as Ref<
  Record<keyof T & string, OperateEnum>,
  Record<keyof T & string, OperateEnum>
>
const condition = computed(() => {
  return Object.entries(filterValues.value)
    .map(([key, val]) => {
      const isEmptyValue =
        val === '' ||
        val === undefined ||
        val === null ||
        (Array.isArray(val) && val.length === 0)

      const opStr = filterOperates.value[key] || OperateEnum.Equal
      const isEmptyValueOperate = EMPTY_VALUE_OPERATES.includes(opStr)

      if (isEmptyValue && !isEmptyValueOperate) {
        return null
      }

      const valStr = Array.isArray(val) ? val.join('|') : val

      return `${key}=${opStr && opStr !== OperateEnum.Equal ? `[${opStr}]` : ''}${isEmptyValueOperate ? '' : valStr}`
    })
    .filter(Boolean)
    .join('&')
})

const handleSearch = () => {
  applyCondition.value = condition.value
}
const handleReset = () => {
  filterValues.value = Object.assign({}, (props.filterFormValues || {}) as F)
  filterOperates.value = Object.assign(
    {},
    Object.fromEntries(
      computedFilterFields.value.map(item => [item.field, item.operate]),
    ) as Record<keyof T & string, OperateEnum>,
  )
  handleSearch()
}
</script>

<style lang="less" scoped>
.list-page {
  gap: @size-6;
  padding: @size-6;
  display: flex;
  flex-direction: column;

  .list-page-title {
    font-size: @font-size-title-2;
    font-weight: 500;
    color: @color-text-1;
  }
}

.filter-form {
  &-item {
    flex: 1;
    gap: @size-4;
    display: flex;
  }
  &-content {
    flex: 1;

    & > * {
      width: 100%;
    }
  }
  &-operate {
    display: flex;
    align-items: center;
  }
  &-actions {
    flex: 1;
    gap: @size-4;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.arco-form-item) {
    margin: 0;
  }
}
</style>
