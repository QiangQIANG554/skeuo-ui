# 统计

数字指标，组件名 `Statistic`，前缀 `S`。

## 基本用法

```vue
<template>
  <Statistic />
</template>

<script setup lang="ts">
import { Statistic } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | '' |  |
| `value` | `number | string` | 0 |  |
| `suffix` | `string` | '' |  |
| `prefix` | `string` | '' |  |
| `precision` | `number` | 0 |  |
| `trend` | `'up' | 'down' | 'flat'` | 'flat' |  |
| `trendText` | `string` | '' |  |
| `color` | `string` | '' |  |


