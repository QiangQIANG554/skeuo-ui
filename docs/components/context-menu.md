# 右键菜单

右键操作，组件名 `ContextMenu`，前缀 `S`。

## 基本用法

```vue
<template>
  <ContextMenu />
</template>

<script setup lang="ts">
import { ContextMenu } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `ContextMenuItem[]` | () => [] |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


