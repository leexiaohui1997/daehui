<script setup lang="ts">
import { permissionApi } from '@/api/permission'
import ListPage from '@/components/ListPage.vue'
import { ColumnFormatType } from '@/utils/list-module'
</script>

<template>
  <ListPage
    :list-method="permissionApi.list"
    :table-columns="[
      {
        dataIndex: 'id',
        title: '权限ID',
        width: 100,
      },
      {
        dataIndex: 'name',
        title: '权限名称',
        minWidth: 200,
      },
      {
        dataIndex: 'description',
        title: '权限描述',
        minWidth: 360,
        ellipsis: true,
        tooltip: true,
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
    ]" />
</template>
