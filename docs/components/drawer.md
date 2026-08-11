# 抽屉

侧滑面板，组件名 `Drawer`，前缀 `S`。

## 基本用法

```vue
<template>
  <Drawer />
</template>

<script setup lang="ts">
import { Drawer } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | false |  |
| `title` | `string` | '' |  |
| `width` | `string` | '360px' |  |
| `placement` | `'left' | 'right'` | 'right' |  |
| `closable` | `boolean` | true |  |
| `maskClosable` | `boolean` | true |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `open` |  |
| `close` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `title` |  |
| `footer` |  |


