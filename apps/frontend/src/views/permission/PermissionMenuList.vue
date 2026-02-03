<script setup lang="tsx">
import { OperateEnum } from '@daehui/shared'

import { permissionApi } from '@/api/permission'
import { permissionMenuApi } from '@/api/permission-menu'
import EntitySelect from '@/components/EntitySelect.vue'
import ListPage from '@/components/ListPage.vue'
import { ColumnFormatType } from '@/utils/list-module'
</script>

<template>
  <ListPage
    entity-name="权限菜单"
    :delete-method="permissionMenuApi.delete"
    :update-method="permissionMenuApi.update"
    :create-method="permissionMenuApi.create"
    :list-method="permissionMenuApi.list"
    :table-columns="[
      {
        dataIndex: 'id',
        title: 'ID',
        width: 100,
        sortable: {
          sortDirections: ['ascend', 'descend'],
        },
        fixed: 'left',
      },
      {
        dataIndex: 'name',
        title: '菜单标识',
        width: 150,
        fixed: 'left',
      },
      {
        dataIndex: 'title',
        title: '菜单名称',
        width: 150,
      },
      {
        dataIndex: 'description',
        title: '菜单描述',
        width: 200,
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        width: 180,
        sortable: {
          sortDirections: ['ascend', 'descend'],
        },
        formatType: ColumnFormatType.DateTime,
      },
      {
        dataIndex: 'updatedAt',
        title: '更新时间',
        width: 180,
        sortable: {
          sortDirections: ['ascend', 'descend'],
        },
        formatType: ColumnFormatType.DateTime,
      },
    ]"
    :filter-fields="[
      'id',
      {
        field: 'name',
        operate: OperateEnum.Like,
      },
      {
        field: 'title',
        operate: OperateEnum.Like,
      },
      {
        field: 'description',
        operate: OperateEnum.Like,
      },
      {
        field: 'permissions',
        operate: OperateEnum.In,
        title: '菜单权限',
        supportOperates: [OperateEnum.In],
      },
    ]"
    :filter-form-values="{
      id: '',
      name: '',
      title: '',
      description: '',
      permissions: [],
    }"
    :table-operate-column="{ width: 180 }"
    :create-form-init-data="{
      name: '',
      title: '',
      description: '',
      permissionIds: [],
    }"
    :create-form-rules="{
      name: { required: true, message: '请输入菜单标识' },
      title: { required: true, message: '请输入菜单名称' },
    }">
    <template #table-operate="{ onEdit, onDelete }">
      <a-link @click="onEdit">
        <template #icon>
          <icon-edit />
        </template>
        编辑
      </a-link>

      <a-link status="danger" @click="onDelete">
        <template #icon>
          <icon-delete />
        </template>
        删除
      </a-link>
    </template>

    <template #create-form="{ formValue, isEdit }">
      <a-form-item field="name" label="菜单标识">
        <a-input v-model="formValue.name" :disabled="isEdit" />
      </a-form-item>

      <a-form-item field="title" label="菜单名称">
        <a-input v-model="formValue.title" />
      </a-form-item>

      <a-form-item field="description" label="菜单描述">
        <a-input v-model="formValue.description" />
      </a-form-item>

      <a-form-item field="permissionIds" label="关联权限">
        <EntitySelect
          v-model="formValue.permissionIds"
          :api="permissionApi.list"
          label-key="title"
          multiple>
          <template #option="{ item }">
            <span>
              <b>
                <i>{{ item.name }}</i>
              </b>
              {{ item.title }}
            </span>
          </template>
        </EntitySelect>
      </a-form-item>
    </template>

    <template #actions="{ addRow }">
      <a-button type="primary" @click="addRow">
        <template #icon>
          <icon-plus />
        </template>
        创建菜单
      </a-button>
    </template>

    <template #f-id="{ model }">
      <a-input v-model="model.id" />
    </template>

    <template #f-name="{ model }">
      <a-input v-model="model.name" />
    </template>

    <template #f-title="{ model }">
      <a-input v-model="model.title" />
    </template>

    <template #f-description="{ model }">
      <a-input v-model="model.description" />
    </template>

    <template #f-permissions="{ model }">
      <EntitySelect
        v-model="model.permissions"
        :api="permissionApi.list"
        label-key="title"
        multiple>
        <template #option="{ item }">
          <span>
            <b>
              <i>{{ item.name }}</i>
            </b>
            {{ item.title }}
          </span>
        </template>
      </EntitySelect>
    </template>
  </ListPage>
</template>
