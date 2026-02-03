<script setup lang="tsx">
import { OperateEnum } from '@daehui/shared'

import { permissionMenuApi } from '@/api/permission-menu'
import { roleApi } from '@/api/role'
import EntitySelect from '@/components/EntitySelect.vue'
import ListPage from '@/components/ListPage.vue'
import { ColumnFormatType } from '@/utils/list-module'
</script>

<template>
  <ListPage
    entity-name="角色"
    :delete-method="roleApi.delete"
    :update-method="roleApi.update"
    :create-method="roleApi.create"
    :list-method="roleApi.list"
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
        title: '角色标识',
        width: 150,
        fixed: 'left',
      },
      {
        dataIndex: 'title',
        title: '角色名称',
        width: 150,
      },
      {
        dataIndex: 'description',
        title: '角色描述',
        width: 200,
      },
      {
        dataIndex: 'permissionMenus',
        title: '关联菜单',
        width: 300,
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
        field: 'permissionMenus',
        operate: OperateEnum.In,
        supportOperates: [OperateEnum.In],
      },
      {
        field: 'createdAt',
        operate: OperateEnum.Range,
      },
      {
        field: 'updatedAt',
        operate: OperateEnum.Range,
      },
    ]"
    :filter-form-values="{
      id: '',
      name: '',
      title: '',
      description: '',
      permissionMenus: [],
      createdAt: [],
      updatedAt: [],
    }"
    :table-operate-column="{ width: 180 }"
    :create-form-init-data="{
      name: '',
      title: '',
      description: '',
      permissionMenuIds: [],
    }"
    :create-form-rules="{
      name: { required: true, message: '请输入角色标识' },
      title: { required: true, message: '请输入角色名称' },
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
      <a-form-item field="name" label="角色标识">
        <a-input v-model="formValue.name" :disabled="isEdit" />
      </a-form-item>

      <a-form-item field="title" label="角色名称">
        <a-input v-model="formValue.title" />
      </a-form-item>

      <a-form-item field="description" label="角色描述">
        <a-input v-model="formValue.description" />
      </a-form-item>

      <a-form-item field="permissionMenuIds" label="关联菜单">
        <EntitySelect
          v-model="formValue.permissionMenuIds"
          :api="permissionMenuApi.list"
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
        创建角色
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

    <template #f-permissionMenus="{ model }">
      <EntitySelect
        v-model="model.permissionMenus"
        :api="permissionMenuApi.list"
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

    <template #f-createdAt="{ model }">
      <a-range-picker v-model="model.createdAt" />
    </template>

    <template #f-updatedAt="{ model }">
      <a-range-picker v-model="model.updatedAt" />
    </template>

    <template #d-permissionMenus="{ row }">
      <a-space wrap>
        <template v-for="item in row.permissionMenus" :key="item.id">
          <a-tooltip v-if="item.description" :content="item.description">
            <a-tag>{{ item.title }}</a-tag>
          </a-tooltip>

          <a-tag v-else>{{ item.title }}</a-tag>
        </template>
      </a-space>
    </template>
  </ListPage>
</template>
