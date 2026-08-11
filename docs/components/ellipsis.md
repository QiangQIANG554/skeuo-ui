# 省略

文本截断，组件名 `Ellipsis`，前缀 `S`。

## 基本用法

```vue
<template>
  <Ellipsis />
</template>

<script setup lang="ts">
import { Ellipsis } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | '' |  |
| `lines` | `number` | 1 |  |
| `maxWidth` | `number | string` | '' |  |
| `showTooltip` | `boolean` | true |  |
| `expandable` | `boolean` | false |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


