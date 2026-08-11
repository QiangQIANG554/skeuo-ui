# 级联选择

多级分类，组件名 `Cascader`，前缀 `S`。

## 基本用法

```vue
<template>
  <Cascader />
</template>

<script setup lang="ts">
import { Cascader } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `CascaderNode[]` | () => [] |  |
| `modelValue` | `(string | number)[]` | () => [] |  |
| `placeholder` | `string` | '请选择' |  |
| `disabled` | `boolean` | false |  |


