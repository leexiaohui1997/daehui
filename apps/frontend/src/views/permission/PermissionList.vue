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
        fixed: 'left',
      },
      {
        dataIndex: 'name',
        title: '权限名称',
        width: 200,
        fixed: 'left',
      },
      {
        dataIndex: 'description',
        title: '权限描述',
        width: 660,
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
    ]"
    :table-operate-column="{ width: 180 }">
    <template #table-operate>
      <a-link>
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
  </ListPage>
</template>
