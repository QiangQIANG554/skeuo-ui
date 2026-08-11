# 水印

防泄露，组件名 `Watermark`，前缀 `S`。

## 基本用法

```vue
<template>
  <Watermark />
</template>

<script setup lang="ts">
import { Watermark } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | '保密' |  |
| `fontSize` | `number` | 14 |  |
| `color` | `string` | 'rgba(0 |  |
| `rotate` | `number` | -25 |  |
| `gap` | `number` | 100 |  |
| `opacity` | `number` | 1 |  |
| `fullscreen` | `boolean` | false |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


