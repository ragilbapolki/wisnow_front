<template>
  <div class="app-container">
    <el-input placeholder="Filter keyword" style="margin-bottom:30px;" v-model="filterText" />
    <el-tree
      :data="data2"
      :filter-node-method="filterNode"
      :props="defaultProps"
      class="filter-tree"
      default-expand-all
      ref="tree2"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const filterText = ref('')
const tree2 = ref()
const defaultProps = reactive({
    children: 'children',
    label: 'label',
})
const data2 = reactive([
    {
        id: 1,
        label: 'Level one 1',
        children: [
            {
                id: 4,
                label: 'Level two 1-1',
                children: [
                    {
                        id: 9,
                        label: 'Level three 1-1-1',
                    },
                    {
                        id: 10,
                        label: 'Level three 1-1-2',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        label: 'Level one 2',
        children: [
            {
                id: 5,
                label: 'Level two 2-1',
            },
            {
                id: 6,
                label: 'Level two 2-2',
            },
        ],
    },
    {
        id: 3,
        label: 'Level one 3',
        children: [
            {
                id: 7,
                label: 'Level two 3-1',
            },
            {
                id: 8,
                label: 'Level two 3-2',
            },
        ],
    },
])

watch(
    () => filterText.value,
    (val) => {
        console.log(tree2)
        tree2.value.filter(val)
    }
)

const filterNode = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
}
</script>

