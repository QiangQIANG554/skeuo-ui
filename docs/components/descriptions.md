# 描述列表

详情展示，组件名 `Descriptions`，前缀 `S`。

## 基本用法

```vue
<template>
  <Descriptions />
</template>

<script setup lang="ts">
import { Descriptions } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | '' |  |
| `items` | `DescriptionsItem[]` | () => [] |  |
| `column` | `number` | 2 |  |
| `bordered` | `boolean` | false |  |


