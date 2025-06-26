<template>
	<div class="app-container">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="Custom Icons" name="first">
				Custom Icons...
			</el-tab-pane>
			<el-tab-pane label="Element-UI Icons" name="second">
				Element-UI Icons...
			</el-tab-pane>
		</el-tabs>
	</div>
	
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>