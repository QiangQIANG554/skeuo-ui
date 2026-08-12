<script setup lang="ts">
import { ref, computed } from 'vue'
import { SButton, SInput, SCheckbox, message, SQRCode, SSegmented } from '../index'

const props = withDefaults(defineProps<{
  mode?: 'login' | 'register'
}>(), {
  mode: 'login',
})

const emit = defineEmits<{
  (e: 'switch', mode: 'login' | 'register'): void
  (e: 'verify'): void
}>()

defineOptions({ name: 'SAuthPage' })

const username = ref('')
const password = ref('')
const confirmPwd = ref('')
const email = ref('')
const agree = ref(false)
const loading = ref(false)
const qrMode = ref(false)

// 登录方式分段切换：Chats 登录 / Emails 登录
const loginMethod = ref<'chats' | 'emails'>('chats')

// ---- 扫码登录：平台滑条 ----
const platforms = [
  { value: 'wechat', name: '微信', icon: '💚', color: '#07c160' },
  { value: 'alipay', name: '支付宝', icon: '💙', color: '#1677ff' },
  { value: 'qq', name: 'QQ', icon: '🐧', color: '#12b7f5' },
  { value: 'dingtalk', name: '钉钉', icon: '🦅', color: '#0089ff' },
  { value: 'feishu', name: '飞书', icon: '📘', color: '#3370ff' },
]
const qrPlatform = ref('wechat')
const qrIndex = computed(() => Math.max(0, platforms.findIndex(p => p.value === qrPlatform.value)))
const qrPlatformName = computed(() => platforms[qrIndex.value]?.name ?? '')
// 二维码内容随平台变化 → SQRCode watch 到 value 变化自动重绘
const qrValue = computed(() => `https://skeuo.example.com/login?platform=${qrPlatform.value}&t=20260811`)

function submit() {
  if (!username.value && !email.value) {
    message.warning('请填写登录账号')
    return
  }
  if (!password.value) {
    message.warning('请输入密码')
    return
  }
  if (props.mode === 'register') {
    if (password.value !== confirmPwd.value) {
      message.error('两次密码不一致')
      return
    }
    if (!agree.value) {
      message.warning('请先同意服务条款')
      return
    }
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success(props.mode === 'login' ? '登录成功，欢迎回来！' : '注册成功，已自动登录！')
  }, 1200)
}
</script>

<template>
  <div class="auth">
    <div class="auth__card">
      <!-- 左侧品牌区 -->
      <div class="auth__brand">
        <div class="auth__logo">S</div>
        <h1 class="auth__name">Skeuo Platform</h1>
        <p class="auth__slogan">轻拟物 · 文档协同平台</p>
        <div class="auth__decoration">
          <div class="auth__slot auth__slot--a" />
          <div class="auth__slot auth__slot--b" />
          <div class="auth__slot auth__slot--c" />
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="auth__form-side">
        <div class="auth__tabs">
          <button
            class="auth__tab" :class="{ 'auth__tab--active': mode === 'login' }"
            type="button" @click="emit('switch', 'login')"
          >登录</button>
          <button
            class="auth__tab" :class="{ 'auth__tab--active': mode === 'register' }"
            type="button" @click="emit('switch', 'register')"
          >注册</button>
        </div>

        <!-- 登录模式 -->
        <form v-if="mode === 'login'" class="auth__form" @submit.prevent="submit">
          <!-- 扫码登录：不显示输入框 -->
          <div v-if="qrMode" class="auth__qr-panel">
            <div class="auth__qr-box">
              <SQRCode :value="qrValue" :size="150" />
            </div>
            <p class="auth__qr-tip">请使用 <b>{{ qrPlatformName }}</b> 扫描二维码登录</p>

            <!-- 平台滑条：滑块停留在哪个平台，二维码就切到哪个平台 -->
            <div class="auth__platforms">
              <div
                class="auth__platform-slider"
                :style="{ width: `calc(100% / ${platforms.length})`, transform: `translateX(${qrIndex * 100}%)` }"
              />
              <button
                v-for="p in platforms"
                :key="p.value"
                class="auth__platform"
                :class="{ 'auth__platform--active': qrPlatform === p.value }"
                type="button"
                @click="qrPlatform = p.value"
              >
                <span class="auth__platform-icon" :style="{ background: p.color }">{{ p.icon }}</span>
                <span class="auth__platform-name">{{ p.name }}</span>
              </button>
            </div>
          </div>

          <!-- 密码登录：正常输入框 -->
          <template v-else>
            <!-- 登录方式切换：Chats / Emails -->
            <SSegmented
              v-model="loginMethod"
              :options="[
                { label: 'Chats', value: 'chats', icon: '💬' },
                { label: 'Emails', value: 'emails', icon: '✉️' },
              ]"
            />

            <div v-if="loginMethod === 'chats'" class="auth__field">
              <label class="auth__label">用户名</label>
              <SInput v-model="username" placeholder="请输入用户名" clearable />
            </div>
            <div v-else class="auth__field">
              <label class="auth__label">邮箱</label>
              <SInput v-model="email" placeholder="请输入邮箱" clearable />
            </div>

            <div class="auth__field">
              <label class="auth__label">密码</label>
              <SInput v-model="password" type="password" placeholder="请输入密码" class="auth__pwd" />
            </div>
            <div class="auth__row">
              <SCheckbox v-model="agree" label="记住我" />
              <a class="auth__link" href="#">忘记密码？</a>
            </div>
            <SButton type="primary" block :disabled="loading" style="margin-top: 8px">
              {{ loading ? '登录中…' : '登 录' }}
            </SButton>
          </template>

          <div class="auth__alt">
            <button class="auth__alt-btn" type="button" @click="qrMode = !qrMode">
              {{ qrMode ? '密码登录' : '扫码登录' }}
            </button>
            <span class="auth__alt-sep">|</span>
            <button class="auth__alt-btn" type="button" @click="emit('verify')">
              验证码登录
            </button>
          </div>
        </form>

        <!-- 注册模式 -->
        <form v-else class="auth__form" @submit.prevent="submit">
          <div class="auth__field">
            <label class="auth__label">用户名</label>
            <SInput v-model="username" placeholder="设置用户名" clearable />
          </div>
          <div class="auth__field">
            <label class="auth__label">邮箱</label>
            <SInput v-model="email" placeholder="用于找回密码" />
          </div>
          <div class="auth__field">
            <label class="auth__label">密码</label>
            <SInput v-model="password" type="password" placeholder="至少 6 位" class="auth__pwd" />
          </div>
          <div class="auth__field">
            <label class="auth__label">确认密码</label>
            <SInput v-model="confirmPwd" type="password" placeholder="再次输入密码" class="auth__pwd" />
          </div>
          <SCheckbox v-model="agree" label="我已阅读并同意服务条款和隐私政策" />
          <SButton type="primary" block :disabled="loading" style="margin-top: 8px">
            {{ loading ? '注册中…' : '注 册' }}
          </SButton>
        </form>

        <p class="auth__foot">
          {{ mode === 'login' ? '还没有账号？' : '已有账号？' }}
          <button class="auth__switch" type="button" @click="emit('switch', mode === 'login' ? 'register' : 'login')">
            {{ mode === 'login' ? '立即注册' : '去登录' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}
.auth__card {
  display: flex;
  width: 820px;
  max-width: 100%;
  border-radius: var(--s-r-lg);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised), 0 16px 40px var(--s-sh-dark-strong);
  overflow: hidden;
}
.auth__brand {
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
.auth__logo {
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
.auth__name { font-family: var(--s-font-serif); font-size: 22px; color: var(--s-ink); margin: 0; }
.auth__slogan { font-size: 13px; color: var(--s-ink-soft); margin: 0; }
.auth__decoration {
  position: absolute;
  bottom: 24px;
  display: flex;
  gap: 14px;
}
.auth__slot {
  width: 42px;
  height: 42px;
  border-radius: var(--s-r-md);
  box-shadow: var(--s-shadow-raised-sm);
}
.auth__slot--a { background: linear-gradient(145deg, var(--s-primary-light), var(--s-primary-deep)); }
.auth__slot--b { background: linear-gradient(145deg, var(--s-accent), var(--s-accent-deep)); }
.auth__slot--c { background: linear-gradient(145deg, var(--s-gold), #8a6d2a); }

.auth__form-side {
  flex: 1.2;
  padding: 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.auth__tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--s-bg-deep);
  box-shadow: 0 1px 0 var(--s-sh-light);
  padding-bottom: 12px;
}
.auth__tab {
  border: none;
  background: transparent;
  font-family: var(--s-font-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--s-ink-faint);
  cursor: pointer;
  padding: 4px 2px;
  transition: color 0.15s;
}
.auth__tab--active {
  color: var(--s-ink);
  text-shadow: 1px 1px 2px var(--s-sh-light);
}
.auth__form { display: flex; flex-direction: column; gap: 16px; }
.auth__field { display: flex; flex-direction: column; gap: 6px; }
.auth__label { font-size: 13px; font-weight: 600; color: var(--s-ink-soft); }
.auth__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.auth__link { font-size: 13px; color: var(--s-primary); text-decoration: none; }
.auth__link:hover { text-decoration: underline; }
.auth__alt { text-align: center; display: flex; justify-content: center; align-items: center; gap: 12px; }
.auth__alt-sep { color: var(--s-ink-faint); font-size: 12px; opacity: 0.6; }
/* 登录/注册页密码输入框：粉色文字（placeholder 保持原色） */
.auth__pwd :deep(.s-input__inner) {
  color: rgb(241, 156, 187);
}
.auth__alt-btn {
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--s-ink-faint);
  cursor: pointer;
  font-family: var(--s-font);
}
.auth__alt-btn:hover { color: var(--s-ink); }

/* ---- 扫码登录面板 ---- */
.auth__qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 8px 0 2px;
}
.auth__qr-box {
  padding: 14px;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
}
.auth__qr-tip {
  margin: 0;
  font-size: 13px;
  color: var(--s-ink-soft);
}
.auth__qr-tip b { color: var(--s-ink); font-weight: 600; }

/* 平台滑条：凹槽轨道 + 凸起滑块 */
.auth__platforms {
  position: relative;
  display: flex;
  width: 100%;
  padding: 5px;
  border-radius: var(--s-r-pill);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
}
.auth__platform-slider {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: var(--s-r-pill);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
  pointer-events: none;
  z-index: 1;
}
.auth__platform {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--s-font);
  transition: transform 0.2s;
}
.auth__platform-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #fff;
  box-shadow: var(--s-shadow-raised-sm);
  transition: box-shadow 0.2s;
}
.auth__platform-name {
  font-size: 11px;
  color: var(--s-ink-faint);
  transition: color 0.2s;
}
.auth__platform--active .auth__platform-name {
  color: var(--s-ink);
  font-weight: 600;
}
.auth__platform--active .auth__platform-icon {
  box-shadow: var(--s-shadow-raised);
}
.auth__platform:hover .auth__platform-name { color: var(--s-ink-soft); }
.auth__foot {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--s-ink-faint);
}
.auth__switch {
  border: none;
  background: transparent;
  color: var(--s-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--s-font);
}
.auth__switch:hover { text-decoration: underline; }
</style>
