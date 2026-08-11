<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import qrcode from 'qrcode-generator'

const props = withDefaults(defineProps<{
  value?: string
  size?: number
  margin?: number
  bgColor?: string
  fgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
}>(), {
  value: '',
  size: 160,
  margin: 8,
  bgColor: '#ffffff',
  fgColor: '#3a362e',
  level: 'M',
})

defineOptions({ name: 'SQRCode' })

const canvas = ref<HTMLCanvasElement | null>(null)

function render() {
  if (!canvas.value || !props.value) return
  const qr = qrcode(0, props.level)
  qr.addData(props.value)
  qr.make()
  const count = qr.getModuleCount()
  const cell = Math.floor((props.size - props.margin * 2) / count)
  const px = props.size
  const ctx = canvas.value.getContext('2d')!
  canvas.value.width = px
  canvas.value.height = px
  ctx.fillStyle = props.bgColor
  ctx.fillRect(0, 0, px, px)

  const offset = (px - count * cell) / 2
  ctx.fillStyle = props.fgColor
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(offset + c * cell, offset + r * cell, cell, cell)
      }
    }
  }
}

onMounted(render)
watch(() => [props.value, props.size, props.level, props.fgColor], render)
</script>

<template>
  <div class="s-qrcode" :style="{ width: size + 'px' }">
    <canvas ref="canvas" :style="{ width: size + 'px', height: size + 'px' }" />
    <div v-if="$slots.default" class="s-qrcode__caption"><slot /></div>
  </div>
</template>

<style scoped>
.s-qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
}
.s-qrcode canvas {
  border-radius: var(--s-r-sm);
  box-shadow: var(--s-shadow-inset);
}
.s-qrcode__caption {
  font-size: 12px;
  color: var(--s-ink-soft);
}
</style>
