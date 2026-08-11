# 时间选择

时间，组件名 `TimePicker`，前缀 `S`。

## 基本用法

```vue
<template>
  <TimePicker />
</template>

<script setup lang="ts">
import { TimePicker } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | '' |  |
| `placeholder` | `string` | '选择时间' |  |
| `disabled` | `boolean` | false |  |
| `format` | `string` | 'HH:mm' |  |
| `step` | `number` | 5 |  |


