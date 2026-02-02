<script setup lang="tsx">
import { permissionApi } from '@/api/permission'
import ListPage from '@/components/ListPage.vue'
import { ColumnFormatType } from '@/utils/list-module'
</script>

<template>
  <ListPage
    entity-name="权限"
    :update-method="permissionApi.update"
    :create-method="permissionApi.create"
    :list-method="permissionApi.list"
    :table-columns="[
      {
        dataIndex: 'id',
        title: '权限ID',
        width: 80,
        fixed: 'left',
      },
      {
        dataIndex: 'name',
        title: '权限标识',
        width: 120,
        fixed: 'left',
      },
      {
        dataIndex: 'title',
        title: '权限名称',
        width: 200,
        fixed: 'left',
      },
      {
        dataIndex: 'description',
        title: '权限描述',
        width: 660,
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        minWidth: 180,
        formatType: ColumnFormatType.DateTime,
      },
      {
        dataIndex: 'updatedAt',
        title: '更新时间',
        minWidth: 180,
        formatType: ColumnFormatType.DateTime,
      },
    ]"
    :table-operate-column="{ width: 180 }"
    :create-form-init-data="{
      name: '',
      title: '',
      description: '',
    }"
    :create-form-rules="{
      name: { required: true, message: '请输入权限标识' },
      title: { required: true, message: '请输入权限名称' },
    }">
    <template #table-operate="{ onEdit }">
      <a-link @click="onEdit">
        <template #icon>
          <icon-edit />
        </template>
        编辑
      </a-link>

      <a-link status="danger">
        <template #icon>
          <icon-delete />
        </template>
        删除
      </a-link>
    </template>

    <template #create-form="{ formValue, isEdit }">
      <a-form-item field="name" label="权限标识">
        <a-input v-model="formValue.name" :disabled="isEdit" />
      </a-form-item>

      <a-form-item field="title" label="权限名称">
        <a-input v-model="formValue.title" />
      </a-form-item>

      <a-form-item field="description" label="权限描述">
        <a-input v-model="formValue.description" />
      </a-form-item>
    </template>

    <template #actions="{ addRow }">
      <a-button type="primary" @click="addRow">
        <template #icon>
          <icon-plus />
        </template>
        创建权限
      </a-button>
    </template>
  </ListPage>
</template>
