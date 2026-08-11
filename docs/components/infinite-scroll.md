# 无限滚动

滚动加载，组件名 `InfiniteScroll`，前缀 `S`。

## 基本用法

```vue
<template>
  <InfiniteScroll />
</template>

<script setup lang="ts">
import { InfiniteScroll } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `distance` | `number` | 80 |  |
| `disabled` | `boolean` | false |  |
| `loading` | `boolean` | false |  |
| `immediate` | `boolean` | true |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `load` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


