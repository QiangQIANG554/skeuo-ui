# 进度条

进度，组件名 `Progress`，前缀 `S`。

## 基本用法

```vue
<template>
  <Progress />
</template>

<script setup lang="ts">
import { Progress } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `percent` | `number` | 0 |  |
| `showLabel` | `boolean` | false |  |
| `type` | `'line' | 'circle'` | 'line' |  |
| `size` | `number` | 120 |  |
| `strokeWidth` | `number` | 10 |  |


