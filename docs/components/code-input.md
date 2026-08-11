# 验证码输入

OTP 输入，组件名 `CodeInput`，前缀 `S`。

## 基本用法

```vue
<template>
  <CodeInput />
</template>

<script setup lang="ts">
import { CodeInput } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | '' |  |
| `length` | `number` | 6 |  |
| `numeric` | `boolean` | true |  |
| `disabled` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `complete` |  |


