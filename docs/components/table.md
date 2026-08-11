# 表格

数据表格，组件名 `Table`，前缀 `S`。

## 基本用法

```vue
<template>
  <Table />
</template>

<script setup lang="ts">
import { Table } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Record<string, any>[]` | () => [] |  |
| `columns` | `TableColumn[]` | () => [] |  |
| `stripe` | `boolean` | true |  |
| `borderless` | `boolean` | false |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `empty` |  |


