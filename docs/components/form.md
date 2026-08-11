# 表单

校验容器，组件名 `Form`，前缀 `S`。

## 基本用法

```vue
<template>
  <Form />
</template>

<script setup lang="ts">
import { Form } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `rules` | `Record<string, FormRule[]>` | () => ({}) |  |
| `labelWidth` | `string` | '90px' |  |
| `inline` | `boolean` | false |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


