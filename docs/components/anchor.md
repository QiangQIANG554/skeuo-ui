# 锚点

页面导航，组件名 `Anchor`，前缀 `S`。

## 基本用法

```vue
<template>
  <Anchor />
</template>

<script setup lang="ts">
import { Anchor } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `links` | `AnchorLink[]` | () => [] |  |
| `container` | `string` | '' |  |
| `offset` | `number` | 0 |  |
| `scrollGap` | `number` | 80 |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


