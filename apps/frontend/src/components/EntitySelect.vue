<script
  setup
  lang="ts"
  generic="
    T extends ListPageData,
    M extends boolean,
    V extends number | string = number,
    VM = M extends true ? V[] : V
  ">
import { Message } from '@arco-design/web-vue'
import {
  getErrorMsg,
  OperateEnum,
  PaginationParams,
  PaginationResponse,
  SortOrderValue,
} from '@daehui/shared'
import { debounce } from 'lodash-es'
import { onMounted, ref, shallowRef } from 'vue'

import { ListPageData } from '@/utils/list-module'

const props = withDefaults(
  defineProps<{
    api: (params: PaginationParams) => Promise<PaginationResponse<T>>
    modelValue?: VM
    valueKey?: keyof T & string
    labelKey?: keyof T & string
    valueFormat?: (item: T) => string
    defaultConditions?: string[]
    defaultSort?: { field: string; order: SortOrderValue }[]
    multiple?: boolean
    placeholder?: string
  }>(),
  {
    valueKey: 'id',
    labelKey: 'name',
    modelValue: undefined,
    valueFormat: undefined,
    defaultConditions: () => [],
    defaultSort: () => [],
    multiple: false,
    placeholder: '请选择',
  },
)

const emit = defineEmits<{
  'update:modelValue': [val: VM]
}>()

const loading = ref(false)
const options = shallowRef<T[]>([])

const fetchOptions = async (keyword?: string) => {
  loading.value = true
  try {
    const conditions = [...props.defaultConditions].filter(Boolean)
    if (keyword) {
      conditions.push(
        JSON.stringify({
          field: props.labelKey,
          operate: OperateEnum.LikeLeft,
          value: keyword,
        }),
      )
    }

    const res = await props.api({
      page: 1,
      pageSize: 50, // Limit results for select
      conditions,
      sort: props.defaultSort,
    })

    options.value = res.list
  } catch (error) {
    Message.error(getErrorMsg(error))
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce((value: string) => {
  fetchOptions(value)
}, 300)

const handleChange = (val: unknown) => {
  emit('update:modelValue', val as VM)
}

onMounted(() => {
  fetchOptions()
})

const formatLabel = (item: T) => {
  if (props.valueFormat) {
    return props.valueFormat(item)
  }
  return item[props.labelKey]
}
</script>

<template>
  <a-select
    :model-value="modelValue!"
    :loading="loading"
    :placeholder="placeholder"
    :multiple="multiple"
    allow-search
    allow-clear
    @search="handleSearch"
    @change="handleChange">
    <a-option
      v-for="item in options"
      :key="item[valueKey]"
      :value="item[valueKey]"
      :label="formatLabel(item)">
      <slot name="option" :item="item">
        {{ formatLabel(item) }}
      </slot>
    </a-option>
  </a-select>
</template>
