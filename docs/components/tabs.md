# 标签页

页签切换，组件名 `Tabs`，前缀 `S`。

## 基本用法

```vue
<template>
  <Tabs />
</template>

<script setup lang="ts">
import { Tabs } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string | number` | '' |  |
| `tabs` | `TabItem[]` | () => [] |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


