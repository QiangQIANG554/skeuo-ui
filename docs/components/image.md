# 图片

图片预览，组件名 `Image`，前缀 `S`。

## 基本用法

```vue
<template>
  <Image />
</template>

<script setup lang="ts">
import { Image } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | '' |  |
| `alt` | `string` | '' |  |
| `width` | `number | string` | '100%' |  |
| `height` | `number | string` | 'auto' |  |
| `radius` | `string` | '' |  |
| `preview` | `boolean` | true |  |
| `fit` | `'cover' | 'contain' | 'fill'` | 'cover' |  |


