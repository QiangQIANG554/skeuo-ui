# 轮播

图片轮播，组件名 `Carousel`，前缀 `S`。

## 基本用法

```vue
<template>
  <Carousel />
</template>

<script setup lang="ts">
import { Carousel } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `{ title?: string; desc?: string; color?: string }[]` | () => [] |  |
| `height` | `number` | 200 |  |
| `autoplay` | `boolean` | true |  |
| `interval` | `number` | 3500 |  |
| `showArrows` | `boolean` | true |  |
| `showIndicators` | `boolean` | true |  |
| `dragThreshold` | `number` | 0.45 |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


