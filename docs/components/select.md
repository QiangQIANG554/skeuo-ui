# 下拉选择

单选下拉，组件名 `Select`，前缀 `S`。

## 基本用法

```vue
<template>
  <Select />
</template>

<script setup lang="ts">
import { Select } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string | number` | '' |  |
| `options` | `SelectOption[]` | () => [] |  |
| `placeholder` | `string` | '请选择' |  |
| `disabled` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |


