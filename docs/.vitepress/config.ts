import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Skeuo UI',
  description: 'Vue3 拟物风组件库 · Pure Neumorphism',
  lang: 'zh-CN',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速上手', link: '/guide/' },
            { text: '设计原则', link: '/guide/design' },
          ],
        },
      ],
      '/components/': [
        {
          text: '表单类',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Select 下拉选择', link: '/components/select' },
            { text: 'Checkbox 勾选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'InputNumber 数字输入', link: '/components/input-number' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Search 搜索框', link: '/components/search' },
            { text: 'Form 表单', link: '/components/form' },
            { text: 'DatePicker 日期', link: '/components/date-picker' },
            { text: 'TimePicker 时间', link: '/components/time-picker' },
            { text: 'DateRangePicker 日期范围', link: '/components/date-range-picker' },
            { text: 'ColorPicker 颜色', link: '/components/color-picker' },
            { text: 'Cascader 级联', link: '/components/cascader' },
            { text: 'CodeInput 验证码', link: '/components/code-input' },
          ],
        },
        {
          text: '展示类',
          items: [
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Badge 徽章', link: '/components/badge' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'QRCode 二维码', link: '/components/qrcode' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Chart 图表', link: '/components/chart' },
            { text: 'Statistic 统计', link: '/components/statistic' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'NumberAnimate 数字滚动', link: '/components/number-animate' },
            { text: 'Watermark 水印', link: '/components/watermark' },
          ],
        },
        {
          text: '反馈类',
          items: [
            { text: 'Message 轻提示', link: '/components/message' },
            { text: 'Notification 通知', link: '/components/notification' },
            { text: 'Confirm 确认框', link: '/components/confirm' },
            { text: 'Popconfirm 气泡确认', link: '/components/popconfirm' },
            { text: 'Alert 警告条', link: '/components/alert' },
            { text: 'Result 结果页', link: '/components/result' },
            { text: 'Upload 上传', link: '/components/upload' },
            { text: 'Tooltip 提示', link: '/components/tooltip' },
          ],
        },
        {
          text: '导航类',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Timeline 时间线', link: '/components/timeline' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'PageHeader 页头', link: '/components/page-header' },
            { text: 'Anchor 锚点', link: '/components/anchor' },
            { text: 'BackTop 回到顶部', link: '/components/back-top' },
          ],
        },
        {
          text: '工具类',
          items: [
            { text: 'Carousel 轮播', link: '/components/carousel' },
            { text: 'Spinner 加载', link: '/components/spinner' },
            { text: 'RefreshButton 刷新', link: '/components/refresh-button' },
            { text: 'Segmented 分段', link: '/components/segmented' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'ContextMenu 右键', link: '/components/context-menu' },
            { text: 'Copy 复制', link: '/components/copy' },
            { text: 'Ellipsis 省略', link: '/components/ellipsis' },
            { text: 'FullScreen 全屏', link: '/components/fullscreen' },
            { text: 'InfiniteScroll 无限滚动', link: '/components/infinite-scroll' },
            { text: 'LazyLoad 懒加载', link: '/components/lazy-load' },
            { text: 'Transfer 穿梭框', link: '/components/transfer' },
          ],
        },
        {
          text: '页面',
          items: [
            { text: 'AuthPage 登录/注册', link: '/components/auth-page' },
            { text: 'VerifyPage 验证码', link: '/components/verify-page' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/skeuo-ui' },
    ],
  },
  vite: {
    server: {
      port: 5210,
    },
  },
})
