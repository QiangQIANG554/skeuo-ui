# 颜色选择

调色，组件名 `ColorPicker`，前缀 `S`。

## 基本用法

```vue
<template>
  <ColorPicker />
</template>

<script setup lang="ts">
import { ColorPicker } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | '' |  |
| `defaultColors` | `string[]` | () => ['#5f86a8' |  |
| `disabled` | `boolean` | false |  |


