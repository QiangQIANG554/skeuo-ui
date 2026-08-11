# 搜索框

搜索输入，组件名 `Search`，前缀 `S`。

## 基本用法

```vue
<template>
  <Search />
</template>

<script setup lang="ts">
import { Search } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | '' |  |
| `placeholder` | `string` | '搜索…' |  |
| `disabled` | `boolean` | false |  |
| `clearable` | `boolean` | true |  |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `search` |  |
| `clear` |  |


