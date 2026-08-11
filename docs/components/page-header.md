# 页头

详情页头，组件名 `PageHeader`，前缀 `S`。

## 基本用法

```vue
<template>
  <PageHeader />
</template>

<script setup lang="ts">
import { PageHeader } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | '' |  |
| `subtitle` | `string` | '' |  |
| `showBack` | `boolean` | true |  |
| `backText` | `string` | '返回' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `back` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


