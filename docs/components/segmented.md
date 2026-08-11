# 分段

功能切换，组件名 `Segmented`，前缀 `S`。

## 基本用法

```vue
<template>
  <Segmented />
</template>

<script setup lang="ts">
import { Segmented } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string | number` | '' |  |
| `options` | `SegmentedOption[]` | () => [] |  |
| `disabled` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


