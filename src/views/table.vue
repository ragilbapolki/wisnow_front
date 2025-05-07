<template>
  <div class="app-container">
    <el-table
      :data="table.list"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      v-loading="table.listLoading"
    >
      <el-table-column align="center" label="ID" width="95">
        <template v-slot="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="Title">
        <template v-slot="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="Author" width="110">
        <template v-slot="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Pageviews" width="110">
        <template v-slot="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="Status" width="110">
        <template v-slot="scope">
          <el-tag :type="statusFilter(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Display_time" prop="created_at" width="200">
        <template v-slot="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { getList } from '@/api/table'

const table = reactive({
    list: null,
    listLoading: true,
})

const statusFilter = (status) => {
    const statusMap = {
        published: 'success',
        draft: 'primary',
        deleted: 'danger',
        // ["primary", "success", "info", "warning", "danger"]
    }
    return statusMap[status]
}

onMounted(() => {
    fetchData()
})
const fetchData = () => {
    table.listLoading = true
    getList().then((response) => {
        table.list = response.body.items
        table.listLoading = false
    })
}
</script>