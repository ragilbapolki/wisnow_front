<template>
  <render-template />
</template>

<script setup>
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const RenderTemplate = (props) => {
    const { icon, title } = props
    let iconTemp, titleTemp
    if (icon) {
        if (icon.includes('el-icon')) {
            iconTemp = h('i', {
                class: [icon, 'sub-el-icon'],
                style: {
                    color: 'currentColor',
                    width: '1em',
                    height: '1em',
                },
            })
        } else {
            iconTemp = h(SvgIcon, {
                icon: icon,
            })
        }
    }
    if (title) {
        titleTemp = h(
            'span',
            {
                slot: title,
            },
            title
        )
    }
    return h('div', [iconTemp, titleTemp])
}
</script>

