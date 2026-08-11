# 输入框

单行文本输入，组件名 `Input`，前缀 `S`。

## 基本用法

```vue
<template>
  <Input />
</template>

<script setup lang="ts">
import { Input } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | '' |  |
| `placeholder` | `string` | '' |  |
| `type` | `'text' | 'password' | 'number'` | 'text' |  |
| `disabled` | `boolean` | false |  |
| `readonly` | `boolean` | false |  |
| `clearable` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `clear` |  |


