# 分页

分页，组件名 `Pagination`，前缀 `S`。

## 基本用法

```vue
<template>
  <Pagination />
</template>

<script setup lang="ts">
import { Pagination } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `total` | `number` | 0 |  |
| `pageSize` | `number` | 10 |  |
| `currentPage` | `number` | 1 |  |
| `pagerCount` | `number` | 7 |  |
| `disabled` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


