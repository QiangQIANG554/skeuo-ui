/**
 * 从 SFC 源码提取组件 API 生成 VitePress 文档页
 * 用法：node scripts/gen-docs.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '../src/components')
const OUT = path.resolve(__dirname, '../docs/components')

const COMPONENTS = [
  ['button', 'Button', '按钮', '表单类', '触发操作'],
  ['input', 'Input', '输入框', '表单类', '单行文本输入'],
  ['textarea', 'Textarea', '文本域', '表单类', '多行文本输入'],
  ['select', 'Select', '下拉选择', '表单类', '单选下拉'],
  ['checkbox', 'Checkbox', '勾选框', '表单类', '多选'],
  ['radio', 'Radio', '单选框', '表单类', '单选'],
  ['switch', 'Switch', '开关', '表单类', '布尔切换'],
  ['slider', 'Slider', '滑块', '表单类', '数值范围选择'],
  ['input-number', 'InputNumber', '数字输入', '表单类', '步进数字'],
  ['rate', 'Rate', '评分', '表单类', '星级评分'],
  ['search', 'Search', '搜索框', '表单类', '搜索输入'],
  ['form', 'Form', '表单', '表单类', '校验容器'],
  ['date-picker', 'DatePicker', '日期选择', '表单类', '日期'],
  ['time-picker', 'TimePicker', '时间选择', '表单类', '时间'],
  ['date-range-picker', 'DateRangePicker', '日期范围', '表单类', '起止日期'],
  ['color-picker', 'ColorPicker', '颜色选择', '表单类', '调色'],
  ['cascader', 'Cascader', '级联选择', '表单类', '多级分类'],
  ['code-input', 'CodeInput', '验证码输入', '表单类', 'OTP 输入'],
  ['card', 'Card', '卡片', '展示类', '内容容器'],
  ['tag', 'Tag', '标签', '展示类', '标记'],
  ['avatar', 'Avatar', '头像', '展示类', '用户头像'],
  ['progress', 'Progress', '进度条', '展示类', '进度'],
  ['tabs', 'Tabs', '标签页', '展示类', '页签切换'],
  ['badge', 'Badge', '徽章', '展示类', '计数角标'],
  ['empty', 'Empty', '空状态', '展示类', '无数据'],
  ['skeleton', 'Skeleton', '骨架屏', '展示类', '加载占位'],
  ['qrcode', 'QRCode', '二维码', '展示类', '二维码'],
  ['image', 'Image', '图片', '展示类', '图片预览'],
  ['chart', 'Chart', '图表', '展示类', 'ECharts 封装'],
  ['statistic', 'Statistic', '统计', '展示类', '数字指标'],
  ['descriptions', 'Descriptions', '描述列表', '展示类', '详情展示'],
  ['number-animate', 'NumberAnimate', '数字滚动', '展示类', '动态数字'],
  ['watermark', 'Watermark', '水印', '展示类', '防泄露'],
  ['message', 'Message', '轻提示', '反馈类', '编程式提示'],
  ['notification', 'Notification', '通知', '反馈类', '角落通知'],
  ['confirm', 'ConfirmDialog', '确认框', '反馈类', '危险操作确认'],
  ['popconfirm', 'Popconfirm', '气泡确认', '反馈类', '轻量确认'],
  ['alert', 'Alert', '警告条', '反馈类', '页面提示'],
  ['result', 'Result', '结果页', '反馈类', '操作结果'],
  ['upload', 'Upload', '上传', '反馈类', '文件上传'],
  ['tooltip', 'Tooltip', '提示', '反馈类', '悬浮提示'],
  ['table', 'Table', '表格', '导航类', '数据表格'],
  ['pagination', 'Pagination', '分页', '导航类', '分页'],
  ['breadcrumb', 'Breadcrumb', '面包屑', '导航类', '路径导航'],
  ['divider', 'Divider', '分割线', '导航类', '分隔'],
  ['timeline', 'Timeline', '时间线', '导航类', '流程时间线'],
  ['steps', 'Steps', '步骤条', '导航类', '步骤进度'],
  ['collapse', 'Collapse', '折叠面板', '导航类', '手风琴'],
  ['drawer', 'Drawer', '抽屉', '导航类', '侧滑面板'],
  ['page-header', 'PageHeader', '页头', '导航类', '详情页头'],
  ['anchor', 'Anchor', '锚点', '导航类', '页面导航'],
  ['back-top', 'BackTop', '回到顶部', '导航类', '快速回顶'],
  ['carousel', 'Carousel', '轮播', '工具类', '图片轮播'],
  ['spinner', 'Spinner', '加载', '工具类', '加载指示'],
  ['refresh-button', 'RefreshButton', '刷新', '工具类', '刷新按钮'],
  ['segmented', 'Segmented', '分段', '工具类', '功能切换'],
  ['dropdown', 'Dropdown', '下拉菜单', '工具类', '操作菜单'],
  ['context-menu', 'ContextMenu', '右键菜单', '工具类', '右键操作'],
  ['copy', 'Copy', '复制', '工具类', '点击复制'],
  ['ellipsis', 'Ellipsis', '省略', '工具类', '文本截断'],
  ['fullscreen', 'FullScreen', '全屏', '工具类', '全屏切换'],
  ['infinite-scroll', 'InfiniteScroll', '无限滚动', '工具类', '滚动加载'],
  ['lazy-load', 'LazyLoad', '懒加载', '工具类', '图片懒加载'],
  ['transfer', 'Transfer', '穿梭框', '工具类', '权限分配'],
  ['auth-page', 'AuthPage', '登录注册页', '页面', '登录/注册/扫码'],
  ['verify-page', 'VerifyPage', '验证码页', '页面', '短信/邮箱验证'],
]

/** 提取 defineProps 的类型定义 */
function extractProps(src) {
  const match = src.match(/withDefaults\(defineProps<([\s\S]*?)>\(\)/, /defineProps<([\s\S]*?)>\(\)/)
  const m = src.match(/withDefaults\(defineProps<([\s\S]*?)>\(\)/)
  if (!m) {
    const m2 = src.match(/defineProps<([\s\S]*?)>\(\)/)
    if (!m2) return []
  }
  const body = m ? m[1] : m2[1]
  const props = []
  const re = /(\w+)\??:\s*([^\n]+)/g
  let r
  while ((r = re.exec(body)) !== null) {
    const name = r[1]
    let type = r[2].trim().replace(/,$/, '')
    // 去掉注释
    type = type.replace(/\/\/.*$/, '').trim()
    // 解析默认值（从 withDefaults 第二参数）
    const defMatch = m ? src.match(/withDefaults\(defineProps<[\s\S]*?>\(\),\s*{([\s\S]*?)\n\}\)/) : null
    let def = '—'
    if (defMatch) {
      const dRe = new RegExp(name + ':\\s*([^,\n]+)')
      const dm = defMatch[1].match(dRe)
      if (dm) def = dm[1].trim().replace(/^\(\) =>\s*/, '() => ')
    }
    props.push({ name, type, default: def })
  }
  return props
}

/** 提取 emits 事件 */
function extractEmits(src) {
  const m = src.match(/defineEmits<([\s\S]*?)>/)
  if (!m) return []
  const emits = []
  const re = /\(e:\s*'([\w-]+)'[^)]*\)\s*:\s*void/g
  let r
  while ((r = re.exec(m[1])) !== null) {
    emits.push(r[1])
  }
  // 也匹配对象式
  if (!emits.length) {
    const re2 = /'([\w-]+)'/g
    let r2
    while ((r2 = re2.exec(m[1])) !== null) emits.push(r2[1])
  }
  return [...new Set(emits)]
}

/** 提取插槽名 */
function extractSlots(src) {
  const template = src.match(/<template>([\s\S]*?)<\/template>/)
  if (!template) return []
  const slots = []
  const named = template[1].match(/<slot name="([^"]+)"/g) || []
  named.forEach(s => {
    const n = s.match(/name="([^"]+)"/)[1]
    slots.push(n)
  })
  // 是否有默认插槽
  if (template[1].includes('<slot') && !template[1].match(/<slot name="/)) {
    slots.unshift('default')
  }
  return [...new Set(slots)]
}

/** 生成 API 表格 */
function apiTable(componentName, props, emits, slots) {
  let md = ''
  if (props.length) {
    md += '## Props\n\n| 属性 | 类型 | 默认值 | 说明 |\n| --- | --- | --- | --- |\n'
    props.forEach(p => {
      md += `| \`${p.name}\` | \`${p.type}\` | ${p.default} |  |\n`
    })
    md += '\n'
  }
  if (emits.length) {
    md += '## Events\n\n| 事件 | 说明 |\n| --- | --- |\n'
    emits.forEach(e => {
      md += `| \`${e}\` |  |\n`
    })
    md += '\n'
  }
  if (slots.length) {
    md += '## Slots\n\n| 名称 | 说明 |\n| --- | --- |\n'
    slots.forEach(s => {
      md += `| \`${s}\` |  |\n`
    })
    md += '\n'
  }
  return md
}

/** 生成组件文档页 */
function genPage([file, comp, title, cat, desc]) {
  const srcPath = path.join(SRC, `S${comp}.vue`)
  if (!fs.existsSync(srcPath)) return null
  const src = fs.readFileSync(srcPath, 'utf8')
  const props = extractProps(src)
  const emits = extractEmits(src)
  const slots = extractSlots(src)

  const md = `# ${title}

${desc}，组件名 \`${comp}\`，前缀 \`S\`。

## 基本用法

\`\`\`vue
<template>
  <${comp} />
</template>

<script setup lang="ts">
import { ${comp} } from 'skeuo-ui'
</script>
\`\`\`

${apiTable(comp, props, emits, slots)}
`
  fs.writeFileSync(path.join(OUT, `${file}.md`), md)
  return { file, comp, props: props.length, emits: emits.length, slots: slots.length }
}

// 生成首页
function genIndex() {
  const rows = COMPONENTS.map(([file, comp, title, cat, desc]) => {
    return `| [${title}](/components/${file}) | \`${comp}\` | ${desc} |`
  }).join('\n')
  const md = `# 组件总览

组件库共 **${COMPONENTS.length} 个组件** + 登录/注册/验证码页面，全部为 Vue3 + TypeScript + 纯正 Neumorphism 风格。

## 组件列表

| 组件 | 名称 | 说明 |
| --- | --- | --- |
${rows}

> 全部组件支持 \`app.use(SkeuoUI)\` 全量引入，也支持按需导入。
`
  fs.writeFileSync(path.join(OUT, 'index.md'), md)
}

fs.mkdirSync(OUT, { recursive: true })
let count = 0
for (const c of COMPONENTS) {
  const r = genPage(c)
  if (r) {
    count++
    console.log(`✓ ${r.file} (props:${r.props} emits:${r.emits} slots:${r.slots})`)
  } else {
    console.warn(`✗ ${c[1]} — 文件不存在 ${c[1]}.vue`)
  }
}
genIndex()
console.log(`\n共生成 ${count}/${COMPONENTS.length} 个组件文档页`)
