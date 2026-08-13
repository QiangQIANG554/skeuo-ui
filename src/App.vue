<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton, SInput, SSelect, STextarea, SCheckbox, SRadio, SRadioGroup,
  SSwitch, SSlider, SCard, STag, SProgress, STabs, STab, SModal,
  STooltip, SPopconfirm, SBadge, message,
  SPagination, SAvatar, SEmpty, SDivider,
  SForm, SFormItem, SInputNumber, SRate, SSkeleton, SBreadcrumb, STimeline,
  STable, SDrawer, SSteps, SCollapse, SUpload, SDatePicker,
  SSearch, SRefreshButton, SSpinner, SCarousel, SQRCode,
  notification, confirm, SSegmented,
  SAuthPage, SVerifyPage,
  SResult, SStatistic, STree, SDescriptions, SAlert,
  SImage, SBackTop, SPageHeader, STimePicker, SCalendar, SChart,
  SMessage, SNotification, SConfirmDialog, SCodeInput,
  SDropdown, SCopy, SEllipsis, STransfer, SDateRangePicker, SCascader,
  SColorPicker, SWatermark, SAnchor, SNumberAnimate,
  SInfiniteScroll, SLazyLoad, SContextMenu, SFullScreen,
  type SelectOption,
} from '@/index'
import FxPage from './FxPage.vue'

// ---- 页面切换：组件实验室 / 2D 特效页 ----
const view = ref<'lab' | 'fx'>('lab')

// ---- 演示状态 ----
const theme = ref<'light' | 'dark'>(localStorage.getItem('skeuo-theme') === 'dark' ? 'dark' : 'light')
// data-theme 必须落在 <html>（:root）上，tokens.css 的深色覆盖才生效
document.documentElement.dataset.theme = theme.value
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('skeuo-theme', theme.value)
}

const inputVal = ref('')
const selectVal = ref<string | number>('2')
const options: SelectOption[] = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三（禁用）', value: '3', disabled: true },
]
const check1 = ref(true)
const check2 = ref(false)
const radioVal = ref<string | number>('a')
const switchOn = ref(true)
const sliderVal = ref(60)

const tags = ref(['默认', '可关闭', '徽章'])
function removeTag(i: number) { tags.value.splice(i, 1) }

const tabActive = ref('tab1')
const progress = ref(60)
const modalOpen = ref(false)

// ---- 新组件演示状态 ----
const page = ref(1)
const num = ref(5)
const rate = ref(4)
const date = ref('')
const drawerOpen = ref(false)
const collapseKeys = ref(['a'])
const formName = ref('')
const formEmail = ref('')
const formRef = ref<{ validate: () => boolean } | null>(null)
const tableData = [
  { id: '20260811-001', name: '项目 Alpha', status: '审核中', owner: '张三' },
  { id: '20260811-002', name: '文档生成任务', status: '已完成', owner: '李四' },
  { id: '20260811-003', name: '数据导入', status: '待处理', owner: '王五' },
]
const timelineItems: import('@/index').TimelineItem[] = [
  { title: '提交审核', description: '发起人提交文档处理任务', time: '08-11 09:12', type: 'success' },
  { title: '一级审批', description: '部门负责人审批通过', time: '08-11 09:40', type: 'primary' },
  { title: '二级审批', description: '等待技术负责人审批', time: '08-11 10:05', type: 'accent' },
  { title: '知识索引', description: '审批通过后写入知识库', time: '', type: 'default' },
]

function validateForm() {
  if (formRef.value?.validate()) {
    message.success('表单校验通过')
  } else {
    message.error('请检查表单填写')
  }
}

// ---- 工具组件演示状态 ----
const authMode = ref<'login' | 'register' | 'verify'>('login')
const segValue = ref<string | number>('chats')
const viewValue = ref<string | number>('list')

// ---- 新增组件演示状态 ----
const treeData = [
  { label: '文档库', value: 'docs', icon: '📁', children: [
    { label: '合同', value: 'contract', icon: '📄', children: [
      { label: '2026 采购合同', value: 'c1', icon: '📃' },
      { label: '2026 服务合同', value: 'c2', icon: '📃' },
    ]},
    { label: '报告', value: 'report', icon: '📊' },
    { label: '审批记录', value: 'approval', icon: '🗂️' },
  ]},
  { label: '知识库', value: 'kb', icon: '🧠', children: [
    { label: 'Agent 配置', value: 'kb-agent', icon: '🤖' },
    { label: '文档模板', value: 'kb-tpl', icon: '📝' },
  ]},
]
const descItems = [
  { label: '任务 ID', value: '20260811-001' },
  { label: '文档名称', value: '年度报告.docx' },
  { label: '发起人', value: '张三' },
  { label: '状态', value: '审批中' },
  { label: '创建时间', value: '2026-08-11 09:12', span: 2 },
  { label: '审批流程', value: '一级审批 → 二级审批 → 知识索引', span: 2 },
]
const statValue = ref(1286)
const resultDemo = ref<'success' | 'error' | 'empty' | '404'>('success')
const codeDemo = ref('')
const timeVal = ref('14:30')
const calVal = ref('')
const calMarked = ref(['2026-08-11', '2026-08-15', '2026-08-20'])

// ---- 第 5 批组件演示状态 ----
const transferVal = ref<(string | number)[]>(['u2'])
const transferData = [
  { key: 'u1', label: '张三（管理员）' },
  { key: 'u2', label: '李四（审核员）' },
  { key: 'u3', label: '王五（编辑）' },
  { key: 'u4', label: '赵六（只读）' },
  { key: 'u5', label: '孙七（只读）' },
  { key: 'u6', label: '周八（禁用）', disabled: true },
]
const rangeVal = ref<[string, string]>(['', ''])
const cascadeVal = ref<(string | number)[]>([])
const cascadeOptions = [
  { label: '文档分类', value: 'doc', children: [
    { label: '合同', value: 'contract', children: [
      { label: '采购合同', value: 'purchase' },
      { label: '服务合同', value: 'service' },
    ]},
    { label: '报告', value: 'report' },
  ]},
  { label: '知识库', value: 'kb', children: [
    { label: 'Agent 配置', value: 'agent' },
  ]},
]
const colorVal = ref('#5f86a8')
const numAnimate = ref(1286)
// 无限滚动演示
const infItems = ref(Array.from({ length: 12 }, (_, i) => i + 1))
const infLoading = ref(false)
const infDone = ref(false)
function loadMore() {
  if (infLoading.value || infDone.value) return
  infLoading.value = true
  setTimeout(() => {
    const next = infItems.value.length + 1
    if (next > 40) {
      infDone.value = true
    } else {
      for (let i = 0; i < 8; i++) infItems.value.push(next + i)
    }
    infLoading.value = false
  }, 600)
}
const ctxItems = [
  { label: '查看详情', icon: '👁', onClick: () => message.info('查看详情') },
  { label: '编辑', icon: '✏️', onClick: () => message.info('编辑') },
  { divider: true },
  { label: '导出', icon: '⬇', onClick: () => message.info('导出') },
  { label: '删除', icon: '🗑', danger: true, onClick: () => message.info('删除') },
]
// ---- 6 种图表演示：覆盖注册的图表类型与组件 ----
// 1. 折线图：markLine 标记线 + dataZoom 数据缩放 + Tooltip
const lineOption = {
  title: { text: '折线图 · markLine 标记线 + dataZoom 缩放', textStyle: { fontSize: 13 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['访问量', '转化量'], top: 26 },
  grid: { left: 44, right: 20, top: 52, bottom: 52 },
  xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
  yAxis: { type: 'value' },
  dataZoom: [{ type: 'inside', start: 0, end: 60 }, { type: 'slider', height: 16, bottom: 8 }],
  series: [
    {
      name: '访问量', type: 'line', smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1250, 1420, 1530, 1610, 1780],
      markLine: { symbol: 'none', data: [{ type: 'average', name: '平均值' }], label: { formatter: '均值 {c}' } },
    },
    {
      name: '转化量', type: 'line', smooth: true,
      data: [220, 332, 401, 434, 590, 630, 620, 550, 720, 830, 910, 980],
      markLine: { symbol: 'none', data: [{ type: 'average', name: '平均值' }] },
    },
  ],
}

// 2. 柱状图：markPoint 标记点 + toolbox 工具栏 + Legend + Grid
const barOption = {
  title: { text: '柱状图 · markPoint 标记点 + toolbox 工具栏', textStyle: { fontSize: 13 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['文档数', '审批数'], top: 26 },
  toolbox: { feature: { saveAsImage: { title: '保存' }, restore: { title: '还原' }, dataView: { title: '数据' } }, top: 2, right: 10 },
  grid: { left: 44, right: 20, top: 52, bottom: 28 },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '文档数', type: 'bar', barWidth: 16,
      data: [120, 200, 150, 280, 190, 320, 260],
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' },
        ],
        label: { color: '#fff', fontSize: 10 },
      },
    },
    {
      name: '审批数', type: 'bar', barWidth: 16,
      data: [60, 120, 90, 180, 120, 200, 160],
      markPoint: { data: [{ type: 'max', name: '最大值' }] },
    },
  ],
}

// 3. 饼图：Legend + Title
const pieOption = {
  title: { text: '饼图 · 文档类型占比', textStyle: { fontSize: 13 }, left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 4 },
  series: [
    {
      name: '文档类型', type: 'pie', radius: ['36%', '62%'], center: ['50%', '48%'],
      itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: 'transparent' },
      label: { show: false },
      data: [
        { value: 320, name: '合同' },
        { value: 240, name: '报告' },
        { value: 180, name: '审批单' },
        { value: 120, name: '会议纪要' },
        { value: 80, name: '其他' },
      ],
    },
  ],
}

// 4. 散点图：Grid + Tooltip
const scatterOption = {
  title: { text: '散点图 · 处理时长分布', textStyle: { fontSize: 13 } },
  tooltip: { trigger: 'item', formatter: '({c})' },
  grid: { left: 44, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'value', name: '页数' },
  yAxis: { type: 'value', name: '耗时(s)' },
  series: [
    {
      type: 'scatter', symbolSize: 9,
      data: [
        [2, 8], [3, 12], [4, 15], [5, 18], [6, 22], [7, 25], [8, 30], [9, 33],
        [10, 38], [12, 42], [14, 48], [16, 55], [18, 60], [20, 70], [24, 82], [30, 95],
      ],
    },
  ],
}

// 5. 雷达图：RadarChart + Legend
const radarOption = {
  title: { text: '雷达图 · Agent 能力评估', textStyle: { fontSize: 13 } },
  tooltip: {},
  legend: { data: ['Agent A', 'Agent B'], bottom: 4 },
  radar: {
    indicator: [
      { name: '准确率', max: 100 },
      { name: '速度', max: 100 },
      { name: '并发', max: 100 },
      { name: '记忆', max: 100 },
      { name: '工具调用', max: 100 },
      { name: '稳定性', max: 100 },
    ],
    radius: '62%',
    center: ['50%', '48%'],
  },
  series: [
    {
      type: 'radar',
      data: [
        { value: [92, 78, 65, 88, 85, 90], name: 'Agent A', areaStyle: { opacity: 0.2 } },
        { value: [70, 95, 88, 60, 72, 80], name: 'Agent B', areaStyle: { opacity: 0.2 } },
      ],
    },
  ],
}

// 6. 漏斗图：FunnelChart + Legend
const funnelOption = {
  title: { text: '漏斗图 · 审批流转', textStyle: { fontSize: 13 }, left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  legend: { bottom: 4 },
  series: [
    {
      name: '审批流转', type: 'funnel', left: '12%', right: '12%', top: 36, bottom: 40,
      minSize: '20%',
      label: { position: 'inside', color: '#fff', fontSize: 11, formatter: '{b} {c}' },
      data: [
        { value: 120, name: '提交' },
        { value: 96, name: '一级审批' },
        { value: 78, name: '二级审批' },
        { value: 60, name: '知识索引' },
      ],
    },
  ],
}
const carouselItems = [
  { title: '多 Agent 协同', desc: '多个智能体并行处理文档任务', color: '#5f86a8' },
  { title: '审批流引擎', desc: '可视化流转，节点状态一目了然', color: '#6ba3a0' },
  { title: '知识库索引', desc: '审批通过后自动写入向量知识库', color: '#b08d3e' },
]
async function demoConfirm() {
  const ok = await confirm({ title: '确认删除项目？', text: '删除后不可恢复，该项目的所有文档和审批记录将一并移除。', okType: 'danger', confirmText: '删除' })
  if (ok) message.success('已删除项目')
  else message.info('已取消删除')
}
</script>

<template>
  <!-- 2D 特效页 -->
  <FxPage v-if="view === 'fx'" @back="view = 'lab'" />

  <!-- 组件实验室 -->
  <div v-else class="lab skeuo-scroll">
    <div class="lab__wrap">
      <!-- HERO -->
      <header class="lab__hero">
        <div>
          <h1>Skeuo UI Kit</h1>
          <p>轻拟物风 Vue3 组件库 · Token 驱动 · 按下即凹陷 · <code>app.use(SkeuoUI)</code> 全局引入或按需 import</p>
        </div>
        <div class="lab__controls">
          <SButton size="sm" @click="view = 'fx'">✨ 2D 特效页</SButton>
          <SButton size="sm" @click="toggleTheme">{{ theme === 'dark' ? '☀️ 浅色' : '🌗 深色' }}</SButton>
        </div>
      </header>

      <!-- BUTTON -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>按钮</h2><span>Button</span></div>
        <div class="panel">
          <div class="row">
            <SButton>默认</SButton>
            <SButton type="primary">主要</SButton>
            <SButton type="accent">强调</SButton>
            <SButton type="danger">危险</SButton>
            <SButton type="ghost">幽灵</SButton>
          </div>
          <div class="row" style="margin-top:16px">
            <SButton size="sm">小按钮</SButton>
            <SButton>中按钮</SButton>
            <SButton size="lg">大按钮</SButton>
            <SButton type="primary" disabled>禁用</SButton>
          </div>
          <div class="row" style="margin-top:16px">
            <SButton type="primary" block>通栏按钮</SButton>
          </div>
        </div>
      </section>

      <!-- FORM -->
      <section id="sec-form" class="lab__sec">
        <div class="lab__sec-head"><h2>表单</h2><span>Form Controls</span></div>
        <div class="panel">
          <div class="form-grid">
            <div class="field">
              <label>文本输入（可清空）</label>
              <SInput v-model="inputVal" placeholder="占位提示…" clearable />
            </div>
            <div class="field">
              <label>下拉选择</label>
              <SSelect v-model="selectVal" :options="options" />
            </div>
            <div class="field">
              <label>多行文本</label>
              <STextarea v-model="inputVal" placeholder="凹陷的槽…" :rows="3" />
            </div>
          </div>
          <div class="row" style="gap:24px">
            <SCheckbox v-model="check1" label="勾选框" />
            <SCheckbox v-model="check2" label="未勾选" />
            <SRadioGroup v-model="radioVal">
              <SRadio label="单选 A" value="a" />
              <SRadio label="单选 B" value="b" />
              <SRadio label="单选 C（禁用）" value="c" disabled />
            </SRadioGroup>
            <SSwitch v-model="switchOn" />
            <span style="font-size:12px;color:var(--s-ink-faint)">开关：{{ switchOn ? '开' : '关' }}</span>
          </div>
          <div class="field" style="margin-top:20px;margin-bottom:0">
            <label>滑块：{{ sliderVal }}%</label>
            <SSlider v-model="sliderVal" />
          </div>
        </div>
      </section>

      <!-- DISPLAY -->
      <section id="sec-display" class="lab__sec">
        <div class="lab__sec-head"><h2>展示组件</h2><span>Display</span></div>
        <div class="grid-2">
          <SCard title="卡片 · 皮革质感">
            <p class="muted">凸起表面 + 顶部高光线，拟物风最基础的载体。标题自带金色衬线装饰。</p>
            <div class="row" style="margin-top:16px">
              <STag>默认</STag>
              <STag type="primary">主色</STag>
              <STag type="accent">成功</STag>
              <STag type="danger">危险</STag>
              <STag type="gold">徽章</STag>
            </div>
            <div style="margin-top:20px">
              <SProgress :percent="progress" show-label />
              <div class="row" style="margin-top:8px">
                <SButton size="sm" @click="progress = Math.min(100, progress + 10)">+10%</SButton>
                <SButton size="sm" @click="progress = Math.max(0, progress - 10)">-10%</SButton>
              </div>
            </div>
          </SCard>

          <div>
            <STabs v-model="tabActive">
              <STab label="标签一" name="tab1">
                <p class="muted">第一个面板的内容。切换看看——当前是<code>tab1</code>。</p>
              </STab>
              <STab label="标签二" name="tab2">
                <p class="muted">第二个面板的内容。</p>
              </STab>
              <STab label="标签三（禁用）" name="tab3" disabled>
                <p class="muted">禁用的标签。</p>
              </STab>
            </STabs>

            <div class="modal-demo">
              <SModal v-model="modalOpen" title="对话框示意">
                <p class="muted">弹出层 = 凸起表面 + 大投影，形成"浮起来"的层级。点击遮罩或 ✕ 关闭。</p>
                <template #footer>
                  <SButton size="sm" @click="modalOpen = false">取消</SButton>
                  <SButton size="sm" type="primary" @click="modalOpen = false">确定</SButton>
                </template>
              </SModal>
              <SButton type="primary" @click="modalOpen = true">打开对话框</SButton>
            </div>
          </div>
        </div>
      </section>

      <!-- TAGS -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>标签</h2><span>Tag（可关闭）</span></div>
        <div class="panel">
          <div class="row">
            <STag v-for="(t, i) in tags" :key="t + i" :type="i === 0 ? 'primary' : i === 1 ? 'accent' : 'default'" closable @close="removeTag(i)">
              {{ t }}
            </STag>
            <span style="font-size:12px;color:var(--s-ink-faint)">点 ✕ 移除（演示 v-for 动态标签）</span>
          </div>
        </div>
      </section>

      <!-- FEEDBACK -->
      <section id="sec-feedback" class="lab__sec">
        <div class="lab__sec-head"><h2>反馈组件</h2><span>Feedback</span></div>
        <div class="grid-2">
          <SCard title="Message · 编程式轻提示">
            <p class="muted">全局方法调用：<code>message.success('...')</code>，不依赖组件标签。</p>
            <div class="row" style="margin-top:16px">
              <SButton type="primary" @click="message.success('保存成功')">成功提示</SButton>
              <SButton type="danger" @click="message.error('操作失败')">错误提示</SButton>
              <SButton @click="message.warning('请先登录')">警告提示</SButton>
              <SButton type="ghost" @click="message.info('这是一条普通信息')">信息提示</SButton>
            </div>
          </SCard>

          <SCard title="Tooltip · 悬浮提示">
            <p class="muted">hover 显示气泡，支持 top/bottom/left/right 四个方向。</p>
            <div class="row" style="margin-top:16px">
              <STooltip content="上方向提示" placement="top"><SButton>上</SButton></STooltip>
              <STooltip content="下方向提示" placement="bottom"><SButton>下</SButton></STooltip>
              <STooltip content="左方向提示" placement="left"><SButton>左</SButton></STooltip>
              <STooltip content="右方向提示" placement="right"><SButton>右</SButton></STooltip>
            </div>
          </SCard>

          <SCard title="Popconfirm · 气泡确认">
            <p class="muted">点击触发，确认后回调。危险操作请用 danger 确认钮。</p>
            <div class="row" style="margin-top:16px">
              <SPopconfirm
                title="确定要删除这条记录吗？"
                ok-type="danger"
                @confirm="message.success('已删除')"
                @cancel="message.info('已取消')"
              >
                <SButton type="danger">删除记录</SButton>
              </SPopconfirm>
              <SPopconfirm
                title="确认提交审核？"
                @confirm="message.success('已提交')"
              >
                <SButton type="primary">提交审核</SButton>
              </SPopconfirm>
            </div>
          </SCard>

          <SCard title="Badge · 角标">
            <p class="muted">未读数、红点，超出 max 显示 <code>99+</code>。</p>
            <div class="row" style="margin-top:16px">
              <SBadge :value="5"><SButton size="sm">消息</SButton></SBadge>
              <SBadge :value="128" :max="99"><SButton size="sm">通知</SButton></SBadge>
              <SBadge dot><SButton size="sm">红点</SButton></SBadge>
              <SBadge :value="0"><SButton size="sm">零隐藏</SButton></SBadge>
            </div>
          </SCard>
        </div>
      </section>

      <!-- STATIC FORMS -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>弹层组件静态形态</h2><span>Static Overlay Forms</span></div>
        <div class="grid-2">
          <SCard title="Message · 消息条（组件形态）">
            <p class="muted">与编程式相同的外观，静态渲染展示四种类型（<code>duration=0</code> 常驻）。</p>
            <div class="msg-stack" style="margin-top:16px">
              <SMessage type="success" text="保存成功" :duration="0" />
              <SMessage type="error" text="操作失败" :duration="0" />
              <SMessage type="warning" text="请先登录" :duration="0" />
              <SMessage type="info" text="这是一条普通信息" :duration="0" />
            </div>
          </SCard>

          <SCard title="Notification · 通知卡片（组件形态）">
            <p class="muted">标题 + 正文 + 操作按钮 + 关闭按钮的静态展示。</p>
            <div style="margin-top:16px">
              <SNotification
                type="success"
                title="任务完成"
                text="文档「年度报告.docx」已生成完毕，等待审批"
                action-label="查看"
                :duration="0"
                :closable="true"
                @action="message.info('点击了查看')"
              />
            </div>
          </SCard>

          <SCard title="ConfirmDialog · 确认对话框（组件形态）">
            <p class="muted">编程式 <code>confirm()</code> 的内部结构，static 模式在页面内渲染。</p>
            <div style="margin-top:16px">
              <SConfirmDialog
                static
                ok-type="danger"
                title="删除项目"
                text="删除后无法恢复，确定要删除该项目吗？"
                confirm-text="确认删除"
                cancel-text="取消"
                @confirm="message.success('已确认删除（静态演示）')"
                @cancel="message.info('已取消（静态演示）')"
              />
            </div>
          </SCard>

          <SCard title="CodeInput · 验证码输入（独立演示）">
            <p class="muted">OTP 风格输入，自动跳格、退格回退、支持粘贴。试试点一下。</p>
            <div class="row" style="margin-top:16px">
              <SCodeInput v-model="codeDemo" :length="6" />
            </div>
            <p class="muted" style="margin-top:10px">当前值：<code>{{ codeDemo || '（未输入）' }}</code></p>
            <div class="row" style="margin-top:12px">
              <SButton size="sm" @click="codeDemo = ''">清空</SButton>
              <SButton size="sm" @click="codeDemo = '888888'">填入 888888</SButton>
            </div>
          </SCard>
        </div>
      </section>

      <!-- DATA & NAV -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>数据与导航</h2><span>Data & Navigation</span></div>
        <div class="grid-2">
          <SCard title="Pagination · 分页">
            <p class="muted">当前第 <code>{{ page }}</code> 页，超页数自动出现省略号。</p>
            <div style="margin-top:16px">
              <SPagination v-model:current-page="page" :total="86" />
            </div>
          </SCard>

          <SCard title="Breadcrumb · 面包屑 + Divider · 分割线">
            <SBreadcrumb :items="[{ label: '首页' }, { label: '项目管理' }, { label: '文档处理' }]" />
            <SDivider label="分隔线" style="margin:16px 0" />
            <div class="row">
              <SAvatar text="张" />
              <SAvatar src="https://i.pravatar.cc/80" />
              <SAvatar text="李" shape="square" />
              <SAvatar text="王" :size="28" />
            </div>
          </SCard>

          <SCard title="Table · 表格">
            <STable :data="tableData" :columns="[
              { prop: 'id', label: '任务 ID', width: '140px' },
              { prop: 'name', label: '名称' },
              { prop: 'status', label: '状态', align: 'center' },
              { prop: 'owner', label: '负责人', align: 'center' },
            ]" />
          </SCard>

          <SCard title="Timeline · 时间线（审批流）">
            <STimeline :items="timelineItems" />
          </SCard>

          <SCard title="Steps · 步骤条 + Skeleton · 骨架屏">
            <SSteps :items="[
              { title: '填写', description: '提交表单' },
              { title: '审批', description: '等待审批' },
              { title: '完成', description: '流程结束' },
            ]" :active="1" />
            <SDivider />
            <SSkeleton :rows="2" avatar />
          </SCard>

          <SCard title="Form · 表单校验 + InputNumber + Rate">
            <SForm ref="formRef" :rules="{
              name: [{ required: true, message: '请输入名称' }],
              email: [{ required: true, message: '请输入邮箱' }, { pattern: /^[^@]+@[^@]+$/, message: '邮箱格式不对' }],
            }" label-width="70px">
              <SFormItem label="名称" prop="name">
                <SInput v-model="formName" placeholder="必填" />
              </SFormItem>
              <SFormItem label="邮箱" prop="email">
                <SInput v-model="formEmail" placeholder="必填且校验格式" />
              </SFormItem>
              <SFormItem label="数量">
                <SInputNumber v-model="num" :min="1" :max="99" />
              </SFormItem>
              <SFormItem label="评分">
                <SRate v-model="rate" />
              </SFormItem>
              <div class="row" style="justify-content:flex-end">
                <SButton size="sm" @click="validateForm">提交</SButton>
              </div>
            </SForm>
          </SCard>

          <SCard title="DatePicker · 日期选择 + Upload · 上传">
            <div class="field">
              <label>选择日期</label>
              <SDatePicker v-model="date" />
            </div>
            <SDivider />
            <SUpload multiple accept=".txt,.md,.pdf" />
          </SCard>

          <SCard title="Drawer · 抽屉 + Collapse · 折叠">
            <div class="row">
              <SButton type="primary" @click="drawerOpen = true">打开抽屉</SButton>
            </div>
            <SDrawer v-model="drawerOpen" title="任务详情" width="340px">
              <p class="muted">这里可以放任务详情、审批流操作等。</p>
              <template #footer>
                <SButton size="sm" @click="drawerOpen = false">关闭</SButton>
              </template>
            </SDrawer>
            <SDivider />
            <SCollapse v-model="collapseKeys">
              <div class="collapse-demo">
                <div v-for="item in [{k:'a',t:'面板一'},{k:'b',t:'面板二'},{k:'c',t:'面板三'}]" :key="item.k" class="collapse-item">
                  <button class="collapse-head" type="button" @click="collapseKeys = collapseKeys.includes(item.k) ? collapseKeys.filter(x => x !== item.k) : [...collapseKeys, item.k]">
                    {{ item.t }} <span>{{ collapseKeys.includes(item.k) ? '−' : '+' }}</span>
                  </button>
                  <div v-show="collapseKeys.includes(item.k)" class="collapse-body muted">面板 {{ item.t }} 的内容。</div>
                </div>
              </div>
            </SCollapse>
          </SCard>

          <SCard title="Empty · 空状态">
            <SEmpty description="暂无审批记录">
              <template #action>
                <SButton size="sm" type="primary" @click="message.info('新建一条记录')">新建记录</SButton>
              </template>
            </SEmpty>
          </SCard>
        </div>
      </section>

      <!-- TOOLS -->
      <section id="sec-tools" class="lab__sec">
        <div class="lab__sec-head"><h2>工具组件</h2><span>Tools</span></div>
        <div class="grid-2">
          <SCard title="Search · 搜索框 + Refresh · 刷新按钮">
            <div class="row">
              <SSearch placeholder="搜索项目 / 文档…" style="max-width:320px" @search="kw => message.info(`搜索：${kw}`)" />
              <SRefreshButton title="刷新数据" @click="message.success('数据已刷新')" />
            </div>
            <SDivider />
            <div class="row">
              <SSpinner :size="24" text="加载中…" />
            </div>
          </SCard>

          <SCard title="Carousel · 轮播图">
            <SCarousel :items="carouselItems" :height="150" :interval="3000" />
          </SCard>

          <SCard title="Notification · 角落消息弹窗">
            <p class="muted">右下角通知，支持操作按钮。编程式调用 <code>notify({...})</code>。</p>
            <div class="row" style="margin-top:16px">
              <SButton type="primary" @click="notification.success({ title: '任务完成', text: '文档「年度报告.docx」已生成完毕', actionLabel: '查看' })">成功通知</SButton>
              <SButton type="danger" @click="notification.error({ title: '任务失败', text: '文档转换超时，请重试' })">错误通知</SButton>
            </div>
          </SCard>

          <SCard title="Confirm · 消息弹出确认">
            <p class="muted"><code>await confirm({...})</code> 返回布尔值，适合危险操作确认。</p>
            <div class="row" style="margin-top:16px">
              <SButton type="danger" @click="demoConfirm">删除项目（危险确认）</SButton>
              <SButton type="primary" @click="confirm({ title: '提交审核？', text: '提交后将进入审批流程' }).then(ok => message.info(ok ? '已提交' : '已取消'))">提交审核</SButton>
            </div>
          </SCard>

          <SCard title="QRCode · 二维码 + Circle Progress · 圆形进度">
            <div class="row" style="align-items:flex-start;gap:24px">
              <SQRCode value="https://skeuo.example.com" :size="120">扫码访问</SQRCode>
              <div style="display:flex;flex-direction:column;gap:12px">
                <SProgress type="circle" :percent="progress" :size="90" show-label />
                <div class="row">
                  <SButton size="sm" @click="progress = Math.min(100, progress + 10)">+10%</SButton>
                  <SButton size="sm" @click="progress = Math.max(0, progress - 10)">-10%</SButton>
                </div>
              </div>
            </div>
          </SCard>

          <SCard title="Segmented · 分段切换">
            <p class="muted">在两个功能之间切换（非进度条）。当前：{{ segValue === 'chats' ? '💬 Chats' : '✉️ Emails' }}</p>
            <div style="margin-top:16px">
              <SSegmented
                v-model="segValue"
                :options="[
                  { label: 'Chats', value: 'chats', icon: '💬' },
                  { label: 'Emails', value: 'emails', icon: '✉️' },
                ]"
              />
            </div>
            <SDivider />
            <p class="muted">也可用于视图切换：</p>
            <div style="margin-top:8px">
              <SSegmented
                v-model="viewValue"
                :options="[
                  { label: '列表', value: 'list' },
                  { label: '卡片', value: 'card' },
                  { label: '时间线', value: 'timeline' },
                ]"
              />
            </div>
            <SDivider />
            <p class="muted">滑块（原有，控制数值）：<SSlider v-model="sliderVal" style="display:inline-block;width:200px;margin-left:8px" /></p>
          </SCard>
        </div>
      </section>

      <!-- BATCH5 -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>操作与选择</h2><span>Actions & Picks</span></div>
        <div class="grid-2">
          <SCard title="Dropdown · 下拉菜单">
            <p class="muted">操作按钮的「更多」菜单。点触发器打开。</p>
            <div style="margin-top:16px">
              <SDropdown
                :items="[
                  { label: '编辑', icon: '✏️' },
                  { label: '复制链接', icon: '🔗' },
                  { label: '导出', icon: '⬇' },
                  { divider: true },
                  { label: '删除', icon: '🗑', danger: true },
                ]"
                @select="(item) => message.info('选中：' + item.label)"
              >
                <SButton type="primary">更多操作 ▾</SButton>
              </SDropdown>
            </div>
          </SCard>

          <SCard title="Copy · 复制 + Ellipsis · 省略">
            <p class="muted">点击复制文本；长文本省略可展开。</p>
            <div class="field" style="margin-top:16px">
              <label>复制任务 ID</label>
              <div class="row">
                <code>20260811-001</code>
                <SCopy text="20260811-001" @success="() => message.success('已复制')" />
              </div>
            </div>
            <div class="field">
              <label>单行省略</label>
              <SEllipsis text="这是一段很长的文档描述文本，会被截断显示省略号，鼠标悬停查看完整内容。" :max-width="280" />
            </div>
            <div class="field">
              <label>多行省略（可展开）</label>
              <SEllipsis
                text="这是一段支持展开的多行省略文本。当内容超过两行时会显示省略号，点击「展开」可以看到完整内容，再点「收起」恢复两行截断。"
                :lines="2"
                expandable
              />
            </div>
          </SCard>

          <SCard title="Transfer · 穿梭框">
            <p class="muted">权限分配：勾选左侧 → 移到右侧。</p>
            <div style="margin-top:16px">
              <STransfer v-model="transferVal" :data="transferData" :titles="['可用用户', '已授权']" searchable />
            </div>
          </SCard>

          <SCard title="DateRangePicker · 日期范围 + Cascader · 级联">
            <p class="muted">报表筛选常用。</p>
            <div class="field" style="margin-top:16px">
              <label>日期范围：{{ rangeVal[0] || '—' }} ~ {{ rangeVal[1] || '—' }}</label>
              <SDateRangePicker v-model="rangeVal" />
            </div>
            <div class="field">
              <label>文档分类：{{ cascadeVal.join(' / ') || '未选择' }}</label>
              <SCascader v-model="cascadeVal" :options="cascadeOptions" placeholder="选择分类" />
            </div>
          </SCard>

          <SCard title="ColorPicker · 颜色选择">
            <p class="muted">预设色 + HSV 调色盘。当前：<code>{{ colorVal }}</code></p>
            <div class="row" style="margin-top:16px">
              <SColorPicker v-model="colorVal" />
              <span class="s-color-demo" :style="{ background: colorVal }" />
            </div>
          </SCard>

          <SCard title="NumberAnimate · 数字滚动 + Watermark · 水印">
            <p class="muted">数字从 0 滚动到目标；水印保护内容。</p>
            <div class="row" style="margin-top:16px">
              <SNumberAnimate :value="numAnimate" suffix=" 份" />
              <SButton size="sm" @click="numAnimate = Math.floor(Math.random() * 3000)">随机</SButton>
            </div>
            <div class="watermark-demo" style="margin-top:16px">
              <SWatermark content="保密资料" :gap="80" :font-size="12">
                <div class="wm-box">这里是受水印保护的文档内容区域</div>
              </SWatermark>
            </div>
          </SCard>
        </div>
      </section>

      <!-- BUSINESS -->
      <section id="sec-business" class="lab__sec">
        <div class="lab__sec-head"><h2>业务组件</h2><span>Business</span></div>
        <div class="grid-2">
          <SCard title="Result · 结果页">
            <SResult
              :type="resultDemo"
              :title="resultDemo === 'success' ? '文档生成完成' : resultDemo === 'error' ? '文档生成失败' : resultDemo === 'empty' ? '暂无文档' : '页面不存在'"
              :description="resultDemo === 'success' ? '报告已生成并发送至审批流，可在「我的任务」中查看进度' : resultDemo === 'error' ? '解析服务异常，请稍后重试或联系管理员' : resultDemo === 'empty' ? '当前分类下还没有文档，点击下方按钮创建' : '您访问的页面不存在或已被移除'"
            >
              <SButton v-if="resultDemo === 'success'" type="primary" size="sm">查看任务</SButton>
              <SButton v-if="resultDemo === 'empty'" type="primary" size="sm">创建文档</SButton>
              <SButton size="sm">返回首页</SButton>
            </SResult>
            <SDivider />
            <div class="row">
              <SButton size="sm" @click="resultDemo = 'error'">错误态</SButton>
              <SButton size="sm" @click="resultDemo = 'empty'">空状态</SButton>
              <SButton size="sm" @click="resultDemo = '404'">404</SButton>
              <SButton size="sm" @click="resultDemo = 'success'">成功态</SButton>
            </div>
          </SCard>

          <SCard title="Statistic · 统计卡片">
            <div class="row" style="justify-content:space-between">
              <SStatistic title="本月处理文档" :value="statValue" suffix="份" trend="up" trend-text="较上月 +12.5%" />
              <SStatistic title="审批通过率" :value="92.4" :precision="1" suffix="%" trend="down" trend-text="较上月 -1.2%" />
            </div>
            <div class="row" style="justify-content:space-between;margin-top:8px">
              <SStatistic title="活跃 Agent" :value="8" suffix="个" />
              <SStatistic title="知识库条目" :value="3421" prefix="≈" />
            </div>
            <SButton size="sm" style="margin-top:12px" @click="statValue += 1">+1 文档</SButton>
          </SCard>

          <SCard title="Tree · 树形">
            <STree :data="treeData" default-expand-all />
          </SCard>

          <SCard title="Descriptions · 描述列表">
            <SDescriptions title="任务详情" :items="descItems" :column="2" />
          </SCard>

          <SCard title="Alert · 警告条">
            <div class="alert-demo">
              <SAlert type="success" title="审批通过" description="文档已进入知识索引阶段" />
              <SAlert type="warning" title="存储空间不足" description="当前已使用 92%，请清理历史文件" closable />
              <SAlert type="error" title="文档解析失败" description="文件格式不受支持或已损坏" />
              <SAlert type="info" title="系统维护通知" description="每日 02:00-02:30 例行维护" />
            </div>
          </SCard>

          <SCard title="Image · 图片预览 + BackTop">
            <p class="muted">点击图片放大预览；右下角回到顶部按钮（滚动页面可见）</p>
            <div style="margin-top:12px">
              <SImage
                src="https://picsum.photos/seed/skeuo/300/180"
                width="220"
                height="132"
                alt="预览图片"
              />
            </div>
            <SBackTop :visibility-height="300" />
          </SCard>

          <SCard title="PageHeader · 页头">
            <SPageHeader title="文档详情" subtitle="年度报告.docx · 审批中" @back="message.info('返回上一页')">
              <SButton type="primary" size="sm">编辑</SButton>
              <SButton size="sm">更多</SButton>
            </SPageHeader>
          </SCard>

          <SCard title="TimePicker · 时间选择 + Calendar · 日历">
            <div class="row">
              <STimePicker v-model="timeVal" />
              <span class="muted">当前：{{ timeVal || '未选择' }}</span>
            </div>
            <div style="margin-top:16px">
              <SCalendar v-model="calVal" :marked-dates="calMarked" />
            </div>
          </SCard>

          <SCard title="Chart · 图表（ECharts 按需注册：折线/柱状/饼图/散点/雷达/漏斗）" :body-style="{ padding: '4px' }">
            <div class="chart-grid">
              <SChart :option="lineOption" :height="240" />
              <SChart :option="barOption" :height="240" />
              <SChart :option="pieOption" :height="240" />
              <SChart :option="scatterOption" :height="240" />
              <SChart :option="radarOption" :height="240" />
              <SChart :option="funnelOption" :height="240" />
            </div>
          </SCard>
        </div>
      </section>

      <!-- LOWFREQ -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>低频组件</h2><span>Utilities</span></div>
        <div class="grid-2">
          <SCard title="InfiniteScroll · 无限滚动">
            <p class="muted">滚动到底自动加载（模拟分页）。</p>
            <div style="margin-top:16px">
              <SInfiniteScroll :loading="infLoading" :disabled="infDone" @load="loadMore" style="max-height:200px;box-shadow:var(--s-shadow-inset);border-radius:var(--s-r-md);padding:8px">
                <div v-for="n in infItems" :key="n" class="inf-item">条目 #{{ n }}</div>
              </SInfiniteScroll>
            </div>
          </SCard>

          <SCard title="LazyLoad · 图片懒加载">
            <p class="muted">进入视口才加载图片（IntersectionObserver）。</p>
            <div class="lazy-demo" style="margin-top:16px">
              <SLazyLoad src="https://picsum.photos/seed/skeuo2/300/180" width="100%" height="120" />
            </div>
          </SCard>

          <SCard title="ContextMenu · 右键菜单">
            <p class="muted">在下方区域右键试试。</p>
            <div style="margin-top:16px">
              <SContextMenu :items="ctxItems">
                <div class="ctx-area">右键点击此区域</div>
              </SContextMenu>
            </div>
          </SCard>

          <SCard title="FullScreen · 全屏">
            <p class="muted">悬停右上角出现全屏按钮（浏览器全屏 API）。</p>
            <div style="margin-top:16px">
              <SFullScreen>
                <div class="fs-box">全屏区域 · hover 右上角 ⤢</div>
              </SFullScreen>
            </div>
          </SCard>

          <SCard title="Anchor · 锚点导航">
            <p class="muted">点击滚动到页面对应区块（试试点下面的链接）。</p>
            <div style="margin-top:16px">
              <SAnchor
                :links="[
                  { key: 'sec-form', title: '表单区' },
                  { key: 'sec-display', title: '展示组件' },
                  { key: 'sec-feedback', title: '反馈组件' },
                  { key: 'sec-tools', title: '工具组件' },
                  { key: 'sec-business', title: '业务组件' },
                ]"
                :offset="80"
              />
            </div>
          </SCard>
        </div>
      </section>

      <!-- AUTH PAGE -->
      <section class="lab__sec">
        <div class="lab__sec-head"><h2>登录 / 注册 / 验证码页</h2><span>Auth Pages</span></div>
        <div class="auth-switch" style="margin-bottom:16px;display:flex;gap:8px">
          <SButton :type="authMode === 'login' ? 'primary' : 'default'" size="sm" @click="authMode = 'login'">登录页</SButton>
          <SButton :type="authMode === 'register' ? 'primary' : 'default'" size="sm" @click="authMode = 'register'">注册页</SButton>
          <SButton :type="authMode === 'verify' ? 'primary' : 'default'" size="sm" @click="authMode = 'verify'">验证码页</SButton>
        </div>
        <SAuthPage v-if="authMode !== 'verify'" :mode="authMode" @switch="authMode = $event" @verify="authMode = 'verify'" />
        <SVerifyPage v-else @back="authMode = 'login'" />
      </section>

      <footer class="lab__foot">Skeuo UI · Token → 组件 → 改 <code>tokens.css</code> 一处，全局换肤</footer>
    </div>
  </div>
</template>

<style>
.lab {
  min-height: 100vh;
  font-family: var(--s-font);
  background: var(--s-bg);
  color: var(--s-ink);
  transition: background 0.3s, color 0.3s;
}
.lab__wrap { max-width: 1100px; margin: 0 auto; padding: 48px 24px 64px; }
.lab__hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
.lab__hero h1 { font-family: var(--s-font-serif); font-size: 34px; letter-spacing: 1px; color: var(--s-ink); }
.lab__hero p { color: var(--s-ink-soft); margin-top: 6px; max-width: 560px; font-size: 14px; }
.lab__controls { flex: none; }
.lab__sec { margin-bottom: 40px; }
.lab__sec-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.lab__sec-head h2 { font-family: var(--s-font-serif); font-size: 21px; color: var(--s-ink); }
.lab__sec-head span { font-size: 12px; color: var(--s-ink-faint); letter-spacing: 1px; text-transform: uppercase; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
.row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.field label { font-size: 13px; font-weight: 600; color: var(--s-ink-soft); }
.panel {
  padding: 24px;
  background: var(--s-surface);
  border-radius: var(--s-r-md);
  box-shadow: var(--s-shadow-raised);
}
.muted { color: var(--s-ink-soft); font-size: 14px; line-height: 1.7; }
.modal-demo { margin-top: 16px; }
code {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  background: var(--s-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: var(--s-shadow-inset);
  color: var(--s-ink-soft);
}
.lab__foot { text-align: center; color: var(--s-ink-faint); font-size: 12px; padding: 32px 0; }
.collapse-demo { display: flex; flex-direction: column; gap: 8px; }
.collapse-item { border-radius: var(--s-r-sm); background: var(--s-surface); box-shadow: var(--s-shadow-raised-sm); overflow: hidden; }
.collapse-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--s-ink);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--s-font);
  cursor: pointer;
}
.collapse-head:hover { color: var(--s-ink-soft); }
.collapse-body { padding: 0 14px 12px; font-size: 13px; }
.alert-demo { display: flex; flex-direction: column; gap: 10px; }
.chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px; padding: 8px; }
.msg-stack { display: flex; flex-direction: column; gap: 8px; }
.s-color-demo { width: 30px; height: 30px; border-radius: 8px; box-shadow: var(--s-shadow-raised-sm); }
.watermark-demo .wm-box {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--s-r-md);
  background: var(--s-surface);
  box-shadow: var(--s-shadow-raised-sm);
  font-size: 13px;
  color: var(--s-ink-soft);
}
.inf-item { padding: 8px 12px; font-size: 13px; color: var(--s-ink); }
.ctx-area {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--s-r-md);
  background: var(--s-bg);
  box-shadow: var(--s-shadow-inset);
  font-size: 13px;
  color: var(--s-ink-soft);
  cursor: context-menu;
}
.fs-box {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--s-r-md);
  background: linear-gradient(145deg, var(--s-surface), var(--s-surface-2));
  box-shadow: var(--s-shadow-raised-sm);
  font-size: 13px;
  color: var(--s-ink-soft);
}
.lazy-demo { border-radius: var(--s-r-md); overflow: hidden; box-shadow: var(--s-shadow-raised-sm); }
</style>
