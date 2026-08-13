<script setup lang="ts">
/**
 * FxPage — 2D 特效组件展示页（Canvas 手搓，零依赖）
 */
import { ref } from 'vue'
import {
  SMagnetic, SBurst, SParticles, SConfetti, STextScramble, SRipple,
  STrail, SGlitch, SSnowfall, SWave, SOrbit, STyping, SMorph, SBubble, SHeatmap, SRain,
  STextParticle, SFlame, SEye, SStarfield, SWaveText, SScan, SPixelate, SProgressFX, SLoaderRing, SParallax,
  SButton, SCard, SResult,
} from '@/index'

defineOptions({ name: 'FxPage' })
const emit = defineEmits<{ back: [] }>()

const theme = ref<'light' | 'dark'>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('skeuo-theme', theme.value)
}

// SConfetti：用 ref 控制重放
const confettiRef = ref<{ start: () => void } | null>(null)

// STextScramble：演示文本切换
const scrambleText = ref('Hello, Skeuo UI!')
const scrambleTexts = [
  'Hello, Skeuo UI!',
  'SConfetti 彩带庆祝',
  'STextScramble 乱码解码',
  '零依赖 Canvas 手搓',
]
let textIdx = 0
function nextScrambleText() {
  textIdx = (textIdx + 1) % scrambleTexts.length
  scrambleText.value = scrambleTexts[textIdx]
}
</script>

<template>
  <div class="fx skeuo-scroll">
    <div class="fx__wrap">
      <!-- HERO -->
      <header class="fx__hero">
        <div>
          <h1>2D 特效组件</h1>
          <p>Canvas 手搓 · 零依赖 · 新拟物风反馈，符合"情感共鸣 &gt; 装饰炫技"</p>
        </div>
        <div class="fx__controls">
          <SButton size="sm" @click="emit('back')">← 组件库</SButton>
          <SButton size="sm" @click="toggleTheme">{{ theme === 'dark' ? '☀️ 浅色' : '🌗 深色' }}</SButton>
        </div>
      </header>

      <!-- SMagnetic -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SMagnetic</h2><span>磁吸变形</span></div>
        <p class="muted">鼠标靠近卡片，卡片向光标方向偏移并轻微放大；离开回弹。</p>
        <div class="fx__row">
          <SMagnetic :strength="0.3" :radius="180" :max-scale="1.05">
            <SCard title="磁吸卡片 A" style="width: 180px; cursor: default;">
              <p class="muted">鼠标移过来试试</p>
            </SCard>
          </SMagnetic>
          <SMagnetic :strength="0.45" :radius="200" :max-scale="1.08">
            <SCard title="磁吸卡片 B · 更强" style="width: 180px; cursor: default;">
              <p class="muted">强磁吸 + 大缩放</p>
            </SCard>
          </SMagnetic>
          <SMagnetic :strength="0.2" :radius="140" :scale="false">
            <SCard title="磁吸卡片 C · 只位移" style="width: 180px; cursor: default;">
              <p class="muted">关闭缩放，纯跟随</p>
            </SCard>
          </SMagnetic>
        </div>
      </section>

      <!-- SBurst -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SBurst</h2><span>点击粒子爆裂</span></div>
        <p class="muted">点击按钮/卡片，粒子从触点向四周散开、受重力回落。</p>
        <div class="fx__row">
          <SBurst :count="32" :speed="7">
            <SButton type="primary">点我爆粒子</SButton>
          </SBurst>
          <SBurst :count="20" :speed="5" :colors="['#c07b74', '#c9a45e', '#5c9a8f']">
            <SButton type="ghost">自定义色粒子</SButton>
          </SBurst>
        </div>
        <div class="fx__row" style="margin-top: 16px">
          <SBurst :count="60" :speed="8" :size="[2, 6]">
            <SCard title="卡片也能爆" style="width: 220px; cursor: pointer;">
              <p class="muted">点击卡片任意位置</p>
            </SCard>
          </SBurst>
        </div>
      </section>

      <!-- SParticles -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SParticles</h2><span>背景粒子场</span></div>
        <p class="muted">漂浮粒子 + 近距离连线（星座），鼠标靠近吸引/排斥。</p>
        <div class="fx__row">
          <SParticles :count="70" :link-distance="130" mouse="attract" class="fx__particles" style="height: 220px" />
          <SParticles :count="50" :link-distance="100" mouse="repel" color="#6ba3a0" class="fx__particles" style="height: 220px" />
        </div>
      </section>

      <!-- SConfetti -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SConfetti</h2><span>彩带庆祝</span></div>
        <p class="muted">纸屑从顶部爆开、旋转飘落。适合结果页成功态。</p>
        <div class="fx__confetti-box">
          <SConfetti ref="confettiRef" :count="140" :speed="8" :auto="false" class="fx__confetti" />
          <div class="fx__confetti-content">
            <SResult
              status="success"
              title="文档生成完成"
              description="报告已生成并发送至审批流，可在「我的任务」中查看进度"
            >
              <template #extra>
                <SButton type="primary" size="sm" @click="confettiRef?.start()">🎉 再庆祝一次</SButton>
              </template>
            </SResult>
          </div>
        </div>
        <div style="margin-top: 12px">
          <SButton size="sm" @click="confettiRef?.start()">触发彩带</SButton>
        </div>
      </section>

      <!-- STextScramble -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>STextScramble</h2><span>文字乱码解码</span></div>
        <p class="muted">目标文本逐字符从乱码解码为最终内容。可循环、可换文本。</p>
        <div class="fx__scramble-box">
          <STextScramble :text="scrambleText" :speed="1.2" />
        </div>
        <div style="margin-top: 12px">
          <SButton size="sm" @click="nextScrambleText">切换文本</SButton>
        </div>
      </section>

      <!-- SRipple -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SRipple</h2><span>水波涟漪</span></div>
        <p class="muted">点击处泛起扩散的波纹环，克制、有质感，替代"发光"式反馈。</p>
        <div class="fx__row">
          <SRipple :count="2" :speed="0.9" :opacity="0.5" :life="100" :line-width="3.5" :start-radius="6" :expand="70">
            <SButton type="primary">点我起涟漪</SButton>
          </SRipple>
          <SRipple :count="2" :speed="0.8" :opacity="0.45" :life="100" :line-width="3" :start-radius="6" :expand="70" color="#6ba3a0">
            <SButton type="ghost">自定义色涟漪</SButton>
          </SRipple>
        </div>
        <div style="margin-top: 16px">
          <SRipple :count="3" :speed="1.0" :opacity="0.4" :life="110" anywhere class="fx__ripple-panel">
            <p class="muted" style="text-align: center">整块面板任意位置点击都有涟漪（慢速扩散）</p>
          </SRipple>
        </div>
      </section>

      <!-- STrail -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>STrail</h2><span>鼠标拖尾</span></div>
        <p class="muted">鼠标移动留下粒子拖尾，渐隐消散。右面带彩虹色。</p>
        <div class="fx__row">
          <STrail :size="4" :density="2" :life="40" class="fx__panel-sm" style="height: 160px" />
          <STrail :size="5" :density="3" :life="50" rainbow class="fx__panel-sm" style="height: 160px" />
        </div>
      </section>

      <!-- SGlitch -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SGlitch</h2><span>故障抖动</span></div>
        <p class="muted">文字周期性出现 RGB 色散 + 水平抖动。科技感标题。</p>
        <div class="fx__glitch-box">
          <SGlitch text="SKEUO // UI" :interval="2200" :intensity="4" />
        </div>
      </section>

      <!-- SSnowfall -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SSnowfall</h2><span>雪花飘落</span></div>
        <p class="muted">雪花/花瓣从顶部飘落，左右摇摆旋转。</p>
        <div class="fx__row">
          <SSnowfall :count="70" :speed="0.7" class="fx__panel-sm" style="height: 180px" />
          <SSnowfall :count="40" :speed="0.5" :circle="false" color="#6ba3a0" class="fx__panel-sm" style="height: 180px" />
        </div>
      </section>

      <!-- SWave -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SWave</h2><span>波浪线条</span></div>
        <p class="muted">正弦波浪持续流动，适合页头/装饰。</p>
        <SWave :layers="2" :amplitude="16" :wavelength="140" :speed="1.2" class="fx__panel-sm" style="height: 120px" />
      </section>

      <!-- SOrbit -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SOrbit</h2><span>轨道粒子</span></div>
        <p class="muted">粒子绕中心旋转，椭圆投影模拟 3D 倾斜。适合加载/科技展示。</p>
        <SOrbit :layers="3" :per-layer="4" :radius="32" :radius-step="24" :speed="0.02" class="fx__panel-sm" style="height: 180px" />
      </section>

      <!-- STyping -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>STyping</h2><span>打字机</span></div>
        <p class="muted">文本逐字显示，带闪烁光标，循环播放。</p>
        <div class="fx__scramble-box">
          <STyping text="你好，我是 Skeuo UI —— 打字机效果 ✨" :speed="80" :loop="true" :pause="3000" />
        </div>
      </section>

      <!-- SMorph -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SMorph</h2><span>形状变形</span></div>
        <p class="muted">圆 ↔ 方 ↔ 三角 ↔ 菱形 ↔ 星形 平滑变形。点击手动切换，下方自动循环。</p>
        <div class="fx__row">
          <SMorph shape="circle" :size="64" :duration="500" />
          <SMorph shape="square" :size="64" :duration="500" />
          <SMorph shape="triangle" :size="64" :duration="500" color="#6ba3a0" />
          <SMorph shape="diamond" :size="64" :duration="500" color="#c9a45e" />
          <SMorph shape="star" :size="64" :duration="500" color="#c07b74" />
        </div>
      </section>

      <!-- SBubble -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SBubble</h2><span>气泡上升</span></div>
        <p class="muted">气泡从底部浮起，上升摇摆、高光闪烁。</p>
        <SBubble :count="26" :speed="0.9" class="fx__panel-sm" style="height: 180px" />
      </section>

      <!-- SHeatmap -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SHeatmap</h2><span>鼠标热力</span></div>
        <p class="muted">鼠标移动/点击叠加暖色热力光晕。在面板上滑动试试。</p>
        <SHeatmap :radius="50" :intensity="0.4" :fade="0.03" class="fx__panel-sm" style="height: 160px" />
      </section>

      <!-- SRain -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SRain</h2><span>雨滴下落</span></div>
        <p class="muted">雨滴斜落带拖尾；右侧流星模式。</p>
        <div class="fx__row">
          <SRain :count="60" :speed="4" :slant="0.25" class="fx__panel-sm" style="height: 160px" />
          <SRain :count="20" :speed="5" :slant="0.35" meteor meteor-gradient color="#c2a15e" class="fx__panel-sm" style="height: 160px" />
        </div>
      </section>

      <!-- STextParticle -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>STextParticle</h2><span>文字粒子化</span></div>
        <p class="muted">文字打散成粒子 → 聚合显示，仪式感入场。可循环打散重聚。</p>
        <STextParticle text="SKEUO UI" :density="4" :size="2.5" :speed="0.07" :loop="true" :loop-delay="4000" class="fx__panel-sm" style="height: 140px" />
      </section>

      <!-- SFlame -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SFlame</h2><span>火焰粒子</span></div>
        <p class="muted">粒子模拟火焰：摇曳、上升、明暗变化，情感共鸣拉满。</p>
        <div class="fx__flame-box">
          <SFlame :intensity="25" :height="120" :width="50" :speed="1.6" />
        </div>
      </section>

      <!-- SEye -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SEye</h2><span>眼球跟随</span></div>
        <p class="muted">瞳孔跟随鼠标转动，双只眼睛一起看。404 页彩蛋神器。</p>
        <div class="fx__eye-box">
          <SEye :size="56" :pair="true" :pupil-range="0.4" />
        </div>
      </section>

      <!-- SStarfield -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SStarfield</h2><span>3D 星空</span></div>
        <p class="muted">粒子从远处向屏幕飞驰（星际旅行感），右侧带鼠标牵引。</p>
        <div class="fx__row">
          <SStarfield :count="160" :speed="0.5" class="fx__panel-sm" style="height: 160px" />
          <SStarfield :count="120" :speed="0.7" :mouse="true" class="fx__panel-sm" style="height: 160px" />
        </div>
      </section>

      <!-- SWaveText -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SWaveText</h2><span>波浪文字</span></div>
        <p class="muted">文字逐字上下浮动，像水波一样流动。</p>
        <div class="fx__scramble-box">
          <SWaveText text="Skeuo UI — 波浪文字" :amplitude="8" :phase="14" :duration="1600" :font-size="24" />
        </div>
      </section>

      <!-- SScan -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SScan</h2><span>扫描线</span></div>
        <p class="muted">发光扫描线周期扫过，带网格背景，科技感面板。</p>
        <SScan :duration="2200" class="fx__scan-box">
          <div style="padding: 28px; text-align: center; color: var(--s-ink-soft); font-size: 13px;">
            <p style="font-size: 18px; font-weight: 600; color: var(--s-ink); margin-bottom: 6px;">SECURE SYSTEM</p>
            扫描中 · 检测到 0 个威胁 · 系统正常
          </div>
        </SScan>
      </section>

      <!-- SPixelate -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SPixelate</h2><span>像素化</span></div>
        <p class="muted">图片像素块显示 → 逐帧清晰（马赛克渐消）。</p>
        <SPixelate
          src="https://picsum.photos/600/240"
          :duration="2200"
          :loop="true"
          :loop-delay="2500"
          class="fx__panel-sm"
          style="height: 160px"
        />
      </section>

      <!-- SProgressFX -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SProgressFX</h2><span>进度条特效</span></div>
        <p class="muted">粒子填充式进度条：粒子流入堆积 + 边缘闪烁。</p>
        <SProgressFX :percent="65" :height="14" :show-label="true" />
      </section>

      <!-- SLoaderRing -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SLoaderRing</h2><span>环形粒子加载</span></div>
        <p class="muted">粒子沿环轨道旋转，顶部最大点放大减速，尾部留白。</p>
        <SLoaderRing :size="64" :count="10" :blank-tail="2" :speed="0.025" :particle-size="4" />
      </section>

      <!-- SParallax -->
      <section class="fx__sec">
        <div class="fx__sec-head"><h2>SParallax</h2><span>鼠标视差</span></div>
        <p class="muted">多层元素按不同深度随鼠标移动。移动鼠标看卡片错层。</p>
        <SParallax :max-shift="26" :ease="0.1" class="fx__parallax-box">
          <div class="fx__parallax-layer" data-depth="-0.5" style="background: var(--s-primary-light); left: 8%; top: 30%; width: 60px; height: 60px; border-radius: 50%; opacity: 0.5" />
          <div class="fx__parallax-layer" data-depth="0.3" style="background: var(--s-accent); left: 30%; top: 55%; width: 80px; height: 80px; border-radius: 16px; opacity: 0.6" />
          <div class="fx__parallax-layer" data-depth="0.8" style="background: var(--s-gold); left: 60%; top: 35%; width: 44px; height: 44px; border-radius: 50%; opacity: 0.7" />
          <div class="fx__parallax-layer" data-depth="0.5" style="background: var(--s-danger); left: 80%; top: 60%; width: 30px; height: 30px; border-radius: 8px; opacity: 0.6" />
          <p class="muted" style="position: relative; z-index: 2; text-align: center; padding: 20px;">把鼠标移进来，不同层移动速度不同</p>
        </SParallax>
      </section>

      <footer class="fx__foot">Skeuo UI · 2D 特效组件 · Canvas 手搓 · 零依赖</footer>
    </div>
  </div>
</template>

<style scoped>
.fx {
  min-height: 100vh;
  font-family: var(--s-font);
  background: var(--s-bg);
  color: var(--s-ink);
  transition: background 0.3s, color 0.3s;
}
.fx__wrap { max-width: 1100px; margin: 0 auto; padding: 48px 24px 64px; }
.fx__hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
.fx__hero h1 { font-family: var(--s-font-serif); font-size: 34px; letter-spacing: 1px; color: var(--s-ink); }
.fx__hero p { color: var(--s-ink-soft); margin-top: 6px; max-width: 560px; font-size: 14px; }
.fx__controls { flex: none; }
.fx__sec { margin-bottom: 40px; }
.fx__sec-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.fx__sec-head h2 { font-family: var(--s-font-serif); font-size: 21px; color: var(--s-ink); }
.fx__sec-head span { font-size: 12px; color: var(--s-ink-faint); letter-spacing: 1px; text-transform: uppercase; }
.fx__row { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; }
.fx__particles {
  flex: 1;
  min-width: 260px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
}
.fx__confetti-box {
  position: relative;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised);
  overflow: hidden;
}
.fx__confetti { height: 260px; }
.fx__confetti-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.fx__confetti-content :deep(*) { pointer-events: auto; }
.fx__scramble-box {
  padding: 24px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  font-size: 22px;
  font-weight: 600;
  font-family: var(--s-font-serif);
  color: var(--s-ink);
  min-height: 68px;
  display: flex;
  align-items: center;
}
.fx__ripple-panel {
  padding: 40px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  cursor: pointer;
}
.fx__panel-sm {
  flex: 1;
  min-width: 260px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.fx__glitch-box {
  padding: 24px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  font-size: 30px;
  font-weight: 700;
  font-family: var(--s-font-serif);
  color: var(--s-ink);
  letter-spacing: 2px;
  min-height: 80px;
  display: flex;
  align-items: center;
}
.fx__flame-box {
  height: 160px;
  border-radius: var(--s-r-md);
  background: linear-gradient(to top, #1a1c22 0%, #262a33 55%, var(--s-bg) 100%);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.fx__eye-box {
  padding: 28px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fx__scan-box {
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
}
.fx__parallax-box {
  position: relative;
  height: 180px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-inset);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fx__parallax-layer {
  position: absolute;
  will-change: transform;
}
.muted { color: var(--s-ink-soft); font-size: 13px; }
</style>
