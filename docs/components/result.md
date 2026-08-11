# 结果页

操作结果，组件名 `Result`，前缀 `S`。

## 基本用法

```vue
<template>
  <Result />
</template>

<script setup lang="ts">
import { Result } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'success' | 'error' | 'warning' | 'info' | 'empty' | '404'` | 'success' |  |
| `title` | `string` | '' |  |
| `description` | `string` | '' |  |
| `image` | `string` | '' |  |
| `imageSize` | `number` | 96 |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


