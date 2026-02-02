<template>
  <a-dropdown
    trigger="hover"
    position="br"
    :popup-max-height="false"
    @select="emits('update:modelValue', $event as OperateEnum)">
    <div class="operate-select">
      <i :class="OPERATE_ICON_MAP[modelValue]">
        <i class="path1"></i>
        <i class="path2"></i>
        <i class="path3"></i>
        <i class="path4"></i>
      </i>
    </div>

    <template #content>
      <a-doption
        v-for="k in operateList"
        :key="k"
        :class="{ 'is-active': k === modelValue }"
        :value="k">
        <template #icon>
          <i :class="OPERATE_ICON_MAP[k]">
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
            <i class="path4"></i>
          </i>
        </template>
        <span>{{ OPERATE_LABEL_MAP[k] }}</span>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import '@daehui/shared/assets/iconfonts/operator/style.css'

import {
  OPERATE_ICON_MAP,
  OPERATE_LABEL_MAP,
  OperateEnum,
} from '@daehui/shared'

withDefaults(
  defineProps<{
    modelValue?: OperateEnum
    operateList?: OperateEnum[]
  }>(),
  {
    modelValue: OperateEnum.Equal,
    operateList: () => Object.values(OperateEnum),
  },
)

const emits = defineEmits<{
  'update:modelValue': [value: OperateEnum]
}>()
</script>

<style lang="less" scoped>
.operate-select {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.is-active {
  color: @primary-6 !important;
  background: @color-fill-2 !important;
}
</style>
