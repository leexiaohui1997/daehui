<template>
  <div class="permission-config">
    <!-- 筛选区 -->
    <a-card class="filter-card">
      <a-space>
        <a-input
          v-model="queryParams.name"
          placeholder="请输入权限标识"
          allow-clear />
        <a-input
          v-model="queryParams.title"
          placeholder="请输入权限名称"
          allow-clear />
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </a-card>

    <!-- 按钮区 & 表格区 -->
    <a-card class="table-card">
      <div class="table-header">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增权限</a-button>
          <a-upload
            :custom-request="handleImport"
            :show-file-list="false"
            accept=".xlsx, .xls">
            <a-button>导入 Excel</a-button>
          </a-upload>
          <a-button :loading="exportLoading" @click="handleExport">
            导出 Excel
          </a-button>
        </a-space>
      </div>

      <a-table
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @page-change="onPageChange">
        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>
        <template #parent="{ record }">
          {{ record.parent?.title || '-' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-popconfirm
              content="确定要删除吗？"
              @ok="handleDelete(record.id)">
              <a-button type="text" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:visible="visible"
      title="新增权限"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form ref="formRef" :model="form">
        <a-form-item
          field="name"
          label="权限标识"
          :rules="[{ required: true, message: '请输入权限标识' }]">
          <a-input v-model="form.name" placeholder="例如：user:create" />
        </a-form-item>
        <a-form-item
          field="title"
          label="权限名称"
          :rules="[{ required: true, message: '请输入权限名称' }]">
          <a-input v-model="form.title" placeholder="例如：创建用户" />
        </a-form-item>
        <a-form-item field="parentId" label="父级权限">
          <a-select
            v-model="form.parentId"
            placeholder="请选择父级权限"
            allow-clear>
            <a-option
              v-for="item in allPermissions"
              :key="item.id"
              :value="item.id"
              :label="item.title" />
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'

import {
  createPermission,
  deletePermission,
  exportPermission,
  getPermissionList,
  importPermission,
  type Permission,
} from '@/api/permission'

const loading = ref(false)
const exportLoading = ref(false)
const tableData = ref<Permission[]>([])
const allPermissions = ref<Permission[]>([]) // 用于下拉选择
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
})

const queryParams = reactive({
  name: '',
  title: '',
})

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '权限标识', dataIndex: 'name' },
  { title: '权限名称', dataIndex: 'title' },
  { title: '父级权限', slotName: 'parent' },
  { title: '创建时间', slotName: 'createdAt' },
  { title: '操作', slotName: 'operations' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getPermissionList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...queryParams,
    })
    tableData.value = res.items
    pagination.total = res.total

    // 获取所有用于下拉
    const allRes = await getPermissionList({ pageSize: 1000 })
    allPermissions.value = allRes.items
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  queryParams.name = ''
  queryParams.title = ''
  handleSearch()
}

const onPageChange = (current: number) => {
  pagination.current = current
  fetchData()
}

// Modal
const visible = ref(false)
const form = reactive({
  name: '',
  title: '',
  parentId: undefined as number | undefined,
})

const formRef = ref()

const handleAdd = () => {
  form.name = ''
  form.title = ''
  form.parentId = undefined
  visible.value = true
}

const handleOk = async () => {
  try {
    await createPermission(form)
    Message.success('创建成功')
    visible.value = false
    fetchData()
  } catch {
    // error handled by interceptor usually
  }
}

const handleCancel = () => {
  visible.value = false
}

const handleDelete = async (id: number) => {
  try {
    await deletePermission(id)
    Message.success('删除成功')
    fetchData()
  } catch (err) {
    console.error(err)
  }
}

const handleExport = async () => {
  exportLoading.value = true
  try {
    const blob = await exportPermission()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'permissions.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error(err)
    Message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const handleImport = async (option: any) => {
  const { fileItem } = option
  try {
    await importPermission(fileItem.file)
    Message.success('导入成功')
    fetchData()
  } catch (err) {
    console.error(err)
    Message.error('导入失败')
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.permission-config {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;
  }

  .table-header {
    margin-bottom: 16px;
  }
}
</style>
