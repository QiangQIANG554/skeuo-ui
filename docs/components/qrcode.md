# 二维码

二维码，组件名 `QRCode`，前缀 `S`。

## 基本用法

```vue
<template>
  <QRCode />
</template>

<script setup lang="ts">
import { QRCode } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | '' |  |
| `size` | `number` | 160 |  |
| `margin` | `number` | 8 |  |
| `bgColor` | `string` | '#ffffff' |  |
| `fgColor` | `string` | '#3a362e' |  |
| `level` | `'L' | 'M' | 'Q' | 'H'` | 'M' |  |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` |  |


