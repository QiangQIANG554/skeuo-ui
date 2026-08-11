# 面包屑

路径导航，组件名 `Breadcrumb`，前缀 `S`。

## 基本用法

```vue
<template>
  <Breadcrumb />
</template>

<script setup lang="ts">
import { Breadcrumb } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | () => [] |  |
| `separator` | `string` | '/' |  |


