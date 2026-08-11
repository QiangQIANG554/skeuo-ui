<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { SButton, SInput, SCodeInput, SSegmented, message } from '../index'

const props = withDefaults(defineProps<{
  channel?: 'phone' | 'email'
}>(), {
  channel: 'phone',
})

const emit = defineEmits<{
  (e: 'back'): void
}>()

defineOptions({ name: 'SVerifyPage' })

// 接收渠道：手机号 / 邮箱
const channel = ref<'phone' | 'email'>(props.channel)
const account = ref('')
const code = ref('')

// 发送倒计时
const counting = ref(0)
const sending = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const maskedAccount = computed(() => {
  const v = account.value.trim()
  if (!v) return ''
  if (channel.value === 'phone') {
    return v.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  }
  const [name, domain] = v.split('@')
  if (!domain) return v.replace(/^(.{2}).*(.{2})$/, '$1**$2')
  const masked = name.length > 2 ? name.slice(0, 2) + '**' : name.slice(0, 1) + '**'
  return `${masked}@${domain}`
})

const canSend = computed(() => {
  const v = account.value.trim()
  if (channel.value === 'phone') return /^1\d{10}$/.test(v)
  return /.+@.+\..+/.test(v)
})

const canSubmit = computed(() => code.value.length >= 4)

function sendCode() {
  if (!canSend.value) {
    message.warning(channel.value === 'phone' ? '请输入正确的手机号' : '请输入正确的邮箱')
    return
  }
  sending.value = true
  // 模拟发送
  setTimeout(() => {
    sending.value = false
    counting.value = 60
    timer = setInterval(() => {
      counting.value--
      if (counting.value <= 0 && timer) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
    message.success(`验证码已发送至 ${maskedAccount.value}`)
  }, 800)
}

function submit() {
  if (!canSubmit.value) {
    message.warning('请输入完整验证码')
    return
  }
  // 演示：任意 6 位都算通过
  message.success('验证通过，正在进入系统…')
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="svp">
    <div class="svp__card">
      <!-- 左侧品牌区 -->
      <div class="svp__brand">
        <div class="svp__logo">S</div>
        <h1 class="svp__name">Skeuo Platform</h1>
        <p class="svp__slogan">轻拟物 · 安全验证</p>
        <div class="svp__shield">🔐</div>
      </div>

      <!-- 右侧验证区 -->
      <div class="svp__side">
        <button class="svp__back" type="button" @click="emit('back')">← 返回</button>

        <h2 class="svp__title">输入验证码</h2>
        <p class="svp__desc">
          验证码已发送至
          <b>{{ maskedAccount || (channel === 'phone' ? '您的手机' : '您的邮箱') }}</b>
        </p>

        <div class="svp__fields">
          <!-- 渠道切换：手机号 / 邮箱 -->
          <SSegmented
            v-model="channel"
            :options="[
              { label: '手机号', value: 'phone', icon: '📱' },
              { label: '邮箱', value: 'email', icon: '✉️' },
            ]"
          />

          <div class="svp__send-row">
            <SInput
              v-model="account"
              :placeholder="channel === 'phone' ? '请输入手机号' : '请输入邮箱'"
              clearable
              style="flex: 1"
            />
            <SButton
              type="accent"
              :disabled="!canSend || counting > 0 || sending"
              @click="sendCode"
            >
              {{ sending ? '发送中…' : counting > 0 ? `${counting}s 后重发` : '获取验证码' }}
            </SButton>
          </div>

          <SCodeInput v-model="code" :length="6" />

          <SButton type="primary" block :disabled="!canSubmit" @click="submit">
            下一步
          </SButton>
        </div>

        <p class="svp__hint">演示环境：任意 6 位数字均可通过验证</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svp {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}
.svp__card {
  display: flex;
  width: 820px;
  max-width: 100%;
  border-radius: var(--s-r-lg);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 16px 40px var(--s-sh-dark-strong);
  overflow: hidden;
}
.svp__brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 32px;
  background: linear-gradient(145deg, var(--s-surface-2), var(--s-bg-deep));
  position: relative;
}
.svp__logo {
  width: 64px;
  height: 64px;
  border-radius: var(--s-r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--s-font-serif);
  font-size: 34px;
  font-weight: 700;
  color: #f7fafc;
  background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep));
  box-shadow: 5px 5px 12px var(--s-sh-dark), -5px -5px 12px var(--s-sh-light);
}
.svp__name { font-family: var(--s-font-serif); font-size: 22px; color: var(--s-ink); margin: 0; }
.svp__slogan { font-size: 13px; color: var(--s-ink-soft); margin: 0; }
.svp__shield {
  font-size: 44px;
  margin-top: 12px;
  filter: drop-shadow(3px 3px 5px var(--s-sh-dark)) drop-shadow(-2px -2px 4px var(--s-sh-light));
}
.svp__side {
  flex: 1.2;
  padding: 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.svp__back {
  position: absolute;
  top: 20px;
  left: 24px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--s-ink-faint);
  cursor: pointer;
  font-family: var(--s-font);
}
.svp__back:hover { color: var(--s-ink); }
.svp__title {
  font-family: var(--s-font-serif);
  font-size: 24px;
  color: var(--s-ink);
  margin: 0 0 6px;
}
.svp__desc {
  font-size: 13px;
  color: var(--s-ink-soft);
  margin: 0 0 24px;
}
.svp__desc b { color: var(--s-ink); font-weight: 600; }
.svp__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.svp__send-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.svp__hint {
  margin-top: 18px;
  text-align: center;
  font-size: 12px;
  color: var(--s-ink-faint);
}
</style>
