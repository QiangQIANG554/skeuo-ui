# 穿梭框

权限分配，组件名 `Transfer`，前缀 `S`。

## 基本用法

```vue
<template>
  <Transfer />
</template>

<script setup lang="ts">
import { Transfer } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `TransferItem[]` | () => [] |  |
| `modelValue` | `(string | number)[]` | () => [] |  |
| `titles` | `[string, string]` | () => ['待选择' |  |
| `searchable` | `boolean` | false |  |


