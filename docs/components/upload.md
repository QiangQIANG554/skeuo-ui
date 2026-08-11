# 上传

文件上传，组件名 `Upload`，前缀 `S`。

## 基本用法

```vue
<template>
  <Upload />
</template>

<script setup lang="ts">
import { Upload } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `accept` | `string` | '' |  |
| `multiple` | `boolean` | false |  |
| `disabled` | `boolean` | false |  |
| `maxSizeMB` | `number` | 10 |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` |  |
| `remove` |  |


