<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
// ---- ECharts 按需引入：只打包注册过的图表和组件，大幅缩小产物体积 ----
import * as echarts from 'echarts/core'
import {
  LineChart, BarChart, PieChart, ScatterChart, RadarChart, FunnelChart,
} from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  DataZoomComponent, MarkLineComponent, MarkPointComponent, ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption, BarSeriesOption, PieSeriesOption, ScatterSeriesOption, RadarSeriesOption, FunnelSeriesOption } from 'echarts/charts'
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, LegendComponentOption, DataZoomComponentOption, MarkLineComponentOption, MarkPointComponentOption, ToolboxComponentOption } from 'echarts/components'

echarts.use([
  LineChart, BarChart, PieChart, ScatterChart, RadarChart, FunnelChart,
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  DataZoomComponent, MarkLineComponent, MarkPointComponent, ToolboxComponent,
  CanvasRenderer,
])

export type SChartOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | RadarSeriesOption
  | FunnelSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | MarkLineComponentOption
  | MarkPointComponentOption
  | ToolboxComponentOption
>

const props = withDefaults(defineProps<{
  option?: SChartOption | Record<string, any>
  height?: number | string
  width?: number | string
  autoresize?: boolean
}>(), {
  option: () => ({}),
  height: 300,
  width: '100%',
  autoresize: true,
})

defineOptions({ name: 'SChart' })

const el = ref<HTMLDivElement | null>(null)
const chart = shallowRef<echarts.ECharts | null>(null)
let ro: ResizeObserver | null = null

function render() {
  if (!el.value) return
  if (!chart.value) {
    chart.value = echarts.init(el.value)
  }
  chart.value.setOption(props.option as any, true)
}

onMounted(() => {
  render()
  if (props.autoresize && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => chart.value?.resize())
    if (el.value) ro.observe(el.value)
  }
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  ro?.disconnect()
  chart.value?.dispose()
  chart.value = null
})

function onWindowResize() {
  chart.value?.resize()
}

watch(() => props.option, () => render(), { deep: true })
</script>

<template>
  <div ref="el" class="s-chart" :style="{ height: typeof height === 'number' ? height + 'px' : height, width: typeof width === 'number' ? width + 'px' : width }" />
</template>

<style scoped>
.s-chart {
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  padding: 8px;
  box-sizing: border-box;
}
</style>
