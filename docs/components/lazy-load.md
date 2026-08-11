# 懒加载

图片懒加载，组件名 `LazyLoad`，前缀 `S`。

## 基本用法

```vue
<template>
  <LazyLoad />
</template>

<script setup lang="ts">
import { LazyLoad } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | '' |  |
| `placeholder` | `string` | 'data:image/svg+xml;base64 |  |
| `error` | `string` | 'data:image/svg+xml;base64 |  |
| `threshold` | `number` | 0 |  |
| `once` | `boolean` | true |  |
| `fit` | `'cover' | 'contain' | 'fill'` | 'cover' |  |
| `alt` | `string` | '' |  |


