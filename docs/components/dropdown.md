# 下拉菜单

操作菜单，组件名 `Dropdown`，前缀 `S`。

## 基本用法

```vue
<template>
  <Dropdown />
</template>

<script setup lang="ts">
import { Dropdown } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `DropdownItem[]` | () => [] |  |
| `trigger` | `'click' | 'hover'` | 'click' |  |
| `placement` | `'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'` | 'bottom-start' |  |
| `width` | `number` | 160 |  |
| `disabled` | `boolean` | false |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `select` |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `trigger` |  |


