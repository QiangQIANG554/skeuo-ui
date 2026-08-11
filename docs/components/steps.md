# 步骤条

步骤进度，组件名 `Steps`，前缀 `S`。

## 基本用法

```vue
<template>
  <Steps />
</template>

<script setup lang="ts">
import { Steps } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `StepItem[]` | () => [] |  |
| `active` | `number` | 0 |  |
| `direction` | `'horizontal' | 'vertical'` | 'horizontal' |  |


