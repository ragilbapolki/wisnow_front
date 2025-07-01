<template>
	<div class="app-container">
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="Custom Icons" name="first">
				Custom Icons...
			</el-tab-pane>
			<el-tab-pane label="Element-Plus-UI Icons" name="second">
				<aside>
					<a class="link" href="https://icon-sets.iconify.design/ep/" target="_blank">@iconify-json/ep</a>
				</aside>
				<div class="grid">
					<div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item.name))">
						<el-tooltip placement="top" :content="generateElementIconCode(item.name)" :disabled="disabled">
							<div class="icon-item">
								<el-icon class="el-menu-icon">
									<component :is="item" />
								</el-icon>
								<span>{{ item.__name }}</span>
							</div>
						</el-tooltip>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
	
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  copyText
} from '@/utils'
import * as elementIcons from '@element-plus/icons-vue'

const disabled = ref(false)
const activeName = ref('first')

const handleClipboard = (text) => {
	disabled.value = true
	copyText(text, () => {
		ElMessage({
			message: 'Copied!',
			type: 'success',
			duration: 2 * 1000,
			onClose(){
				disabled.value = false
			}
    })
	})
}

const generateElementIconCode = (symbol) => {
	return `<el-icon><i-ep-${symbol} /></el-icon>`
}
</script>


<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as v;

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-weight: 600;
}

.link{
	text-decoration: underline;
	color: v.$menuActiveText;
}

.grid {
	position: relative;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
.icon-item {
	margin: 20px;
	height: 85px;
	text-align: center;
	width: 100px;
	float: left;
	color: #6b778c;
  font-size: 24px;
	cursor: pointer;
	span {
		display: block;
		font-size: 16px;
		margin-top: 10px;
	}
}
</style>