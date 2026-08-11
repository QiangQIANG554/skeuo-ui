# 登录注册页

登录/注册/扫码，组件名 `AuthPage`，前缀 `S`。

## 基本用法

```vue
<template>
  <AuthPage />
</template>

<script setup lang="ts">
import { AuthPage } from 'skeuo-ui'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'login' | 'register'` | 'login' |  |

## Events

| 事件 | 说明 |
| --- | --- |
| `switch` |  |
| `verify` |  |


