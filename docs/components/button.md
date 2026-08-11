# 按钮

触发操作，组件名 `Button`，前缀 `S`。

## 基本用法

```vue
<template>
  <Button />
</template>

<script setup lang="ts">
import { Button } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `ButtonType` | 'default' |  |
| `size` | `ButtonSize` | 'md' |  |
| `disabled` | `boolean` | false |  |
| `nativeType` | `'button' | 'submit' | 'reset'` | 'button' |  |
| `block` | `boolean` | false |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


