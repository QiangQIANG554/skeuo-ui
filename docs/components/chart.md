# 图表

ECharts 封装，组件名 `Chart`，前缀 `S`。

## 基本用法

```vue
<template>
  <Chart />
</template>

<script setup lang="ts">
import { Chart } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `option` | `SChartOption | Record<string, any>` | () => ({}) |  |
| `height` | `number | string` | 300 |  |
| `width` | `number | string` | '100%' |  |
| `autoresize` | `boolean` | true |  |


