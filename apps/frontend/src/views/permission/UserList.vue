<script setup lang="ts">
import { ref } from 'vue'

import { roleApi } from '@/api/role'
import { userApi } from '@/api/user'
import EntitySelect from '@/components/EntitySelect.vue'
import ListPage from '@/components/ListPage.vue'

const createFormInitData = ref<{
  userId: number
  roleIds: number[]
}>({
  userId: null!,
  roleIds: [],
})
</script>

<template>
  <ListPage
    entity-name="用户"
    :create-method="userApi.addRoles"
    :create-form-init-data="createFormInitData"
    :create-form-rules="{
      userId: [{ required: true, message: '请选择目标用户' }],
      roleIds: [{ required: true, message: '请选择角色' }],
    }">
    <template #actions="{ addRow }">
      <a-button type="primary" @click="addRow">添加用户</a-button>
    </template>

    <template #modal-title="{ isEdit }">
      <span>{{ isEdit ? '编辑' : '添加' }}用户</span>
    </template>

    <template #create-form="{ formValue }">
      <a-form-item label="目标用户" field="userId">
        <EntitySelect
          v-model="formValue.userId"
          :api="userApi.list"
          :default-sort="[{ field: 'username', order: 'asc' }]"
          label-key="username" />
      </a-form-item>

      <a-form-item label="增加角色" field="roleIds">
        <EntitySelect
          v-model="formValue.roleIds"
          :api="roleApi.list"
          multiple />
      </a-form-item>
    </template>
  </ListPage>
</template>
