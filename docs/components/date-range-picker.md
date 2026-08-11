# 日期范围

起止日期，组件名 `DateRangePicker`，前缀 `S`。

## 基本用法

```vue
<template>
  <DateRangePicker />
</template>

<script setup lang="ts">
import { DateRangePicker } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `[string, string]` | () => ['' |  |
| `placeholder` | `[string, string]` | () => ['开始日期' |  |
| `disabled` | `boolean` | false |  |


