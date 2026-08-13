import type { App, Plugin } from 'vue'

// 基础样式 + 设计令牌：必须随包分发（使用者 import 'skeuo-ui/style.css' 即获得全部）
import './tokens.css'
import './base.css'

import SButton from './components/SButton.vue'
import SInput from './components/SInput.vue'
import SSelect from './components/SSelect.vue'
import STextarea from './components/STextarea.vue'
import SCheckbox from './components/SCheckbox.vue'
import SRadio from './components/SRadio.vue'
import SRadioGroup from './components/SRadioGroup.vue'
import SSwitch from './components/SSwitch.vue'
import SSlider from './components/SSlider.vue'
import SCard from './components/SCard.vue'
import STag from './components/STag.vue'
import SProgress from './components/SProgress.vue'
import STabs from './components/STabs.vue'
import STab from './components/STab.vue'
import SModal from './components/SModal.vue'
import SMessage from './components/SMessage.vue'
import STooltip from './components/STooltip.vue'
import SPopconfirm from './components/SPopconfirm.vue'
import SBadge from './components/SBadge.vue'
import SPagination from './components/SPagination.vue'
import SAvatar from './components/SAvatar.vue'
import SEmpty from './components/SEmpty.vue'
import SDivider from './components/SDivider.vue'
import SForm from './components/SForm.vue'
import SFormItem from './components/SFormItem.vue'
import SInputNumber from './components/SInputNumber.vue'
import SRate from './components/SRate.vue'
import SSkeleton from './components/SSkeleton.vue'
import SBreadcrumb from './components/SBreadcrumb.vue'
import STimeline from './components/STimeline.vue'
import STable from './components/STable.vue'
import SDrawer from './components/SDrawer.vue'
import SSteps from './components/SSteps.vue'
import SCollapse from './components/SCollapse.vue'
import SUpload from './components/SUpload.vue'
import SDatePicker from './components/SDatePicker.vue'
import SSearch from './components/SSearch.vue'
import SRefreshButton from './components/SRefreshButton.vue'
import SSpinner from './components/SSpinner.vue'
import SCarousel from './components/SCarousel.vue'
import SNotification from './components/SNotification.vue'
import SQRCode from './components/SQRCode.vue'
import SConfirmDialog from './components/SConfirmDialog.vue'
import SAuthPage from './components/SAuthPage.vue'
import SSegmented from './components/SSegmented.vue'
import SCodeInput from './components/SCodeInput.vue'
import SVerifyPage from './components/SVerifyPage.vue'
import SResult from './components/SResult.vue'
import SStatistic from './components/SStatistic.vue'
import STree from './components/STree.vue'
import SDescriptions from './components/SDescriptions.vue'
import SAlert from './components/SAlert.vue'
import SImage from './components/SImage.vue'
import SBackTop from './components/SBackTop.vue'
import SPageHeader from './components/SPageHeader.vue'
import STimePicker from './components/STimePicker.vue'
import SCalendar from './components/SCalendar.vue'
import SChart from './components/SChart.vue'
import SDropdown from './components/SDropdown.vue'
import SCopy from './components/SCopy.vue'
import SEllipsis from './components/SEllipsis.vue'
import STransfer from './components/STransfer.vue'
import SDateRangePicker from './components/SDateRangePicker.vue'
import SCascader from './components/SCascader.vue'
import SColorPicker from './components/SColorPicker.vue'
import SWatermark from './components/SWatermark.vue'
import SAnchor from './components/SAnchor.vue'
import SNumberAnimate from './components/SNumberAnimate.vue'
import SInfiniteScroll from './components/SInfiniteScroll.vue'
import SLazyLoad from './components/SLazyLoad.vue'
import SContextMenu from './components/SContextMenu.vue'
import SFullScreen from './components/SFullScreen.vue'
import SMagnetic from './components/SMagnetic.vue'
import SBurst from './components/SBurst.vue'
import SParticles from './components/SParticles.vue'
import SConfetti from './components/SConfetti.vue'
import STextScramble from './components/STextScramble.vue'
import SRipple from './components/SRipple.vue'
import STrail from './components/STrail.vue'
import SGlitch from './components/SGlitch.vue'
import SSnowfall from './components/SSnowfall.vue'
import SWave from './components/SWave.vue'
import SOrbit from './components/SOrbit.vue'
import STyping from './components/STyping.vue'
import SMorph from './components/SMorph.vue'
import SBubble from './components/SBubble.vue'
import SHeatmap from './components/SHeatmap.vue'
import SRain from './components/SRain.vue'
import STextParticle from './components/STextParticle.vue'
import SFlame from './components/SFlame.vue'
import SEye from './components/SEye.vue'
import SStarfield from './components/SStarfield.vue'
import SWaveText from './components/SWaveText.vue'
import SScan from './components/SScan.vue'
import SPixelate from './components/SPixelate.vue'
import SProgressFX from './components/SProgressFX.vue'
import SLoaderRing from './components/SLoaderRing.vue'
import SParallax from './components/SParallax.vue'
import { message } from './components/message'
import { notify, notification } from './components/notification'
import { confirm } from './components/confirm'

export {
  SButton,
  SInput,
  SSelect,
  STextarea,
  SCheckbox,
  SRadio,
  SRadioGroup,
  SSwitch,
  SSlider,
  SCard,
  STag,
  SProgress,
  STabs,
  STab,
  SModal,
  SMessage,
  STooltip,
  SPopconfirm,
  SBadge,
  SPagination,
  SAvatar,
  SEmpty,
  SDivider,
  SForm,
  SFormItem,
  SInputNumber,
  SRate,
  SSkeleton,
  SBreadcrumb,
  STimeline,
  STable,
  SDrawer,
  SSteps,
  SCollapse,
  SUpload,
  SDatePicker,
  SSearch,
  SRefreshButton,
  SSpinner,
  SCarousel,
  SNotification,
  SQRCode,
  SConfirmDialog,
  SAuthPage,
  SSegmented,
  SCodeInput,
  SVerifyPage,
  SResult,
  SStatistic,
  STree,
  SDescriptions,
  SAlert,
  SImage,
  SBackTop,
  SPageHeader,
  STimePicker,
  SCalendar,
  SChart,
  SDropdown,
  SCopy,
  SEllipsis,
  STransfer,
  SDateRangePicker,
  SCascader,
  SColorPicker,
  SWatermark,
  SAnchor,
  SNumberAnimate,
  SInfiniteScroll,
  SLazyLoad,
  SContextMenu,
  SFullScreen,
  SMagnetic,
  SBurst,
  SParticles,
  SConfetti,
  STextScramble,
  SRipple,
  STrail,
  SGlitch,
  SSnowfall,
  SWave,
  SOrbit,
  STyping,
  SMorph,
  SBubble,
  SHeatmap,
  SRain,
  STextParticle,
  SFlame,
  SEye,
  SStarfield,
  SWaveText,
  SScan,
  SPixelate,
  SProgressFX,
  SLoaderRing,
  SParallax,
}

export { message, notify, notification, confirm }

export type { SelectOption } from './types'
export type { TabItem } from './components/tabs-context'
export type { BreadcrumbItem } from './components/SBreadcrumb.vue'
export type { StepItem } from './components/SSteps.vue'
export type { TableColumn } from './components/STable.vue'
export type { TimelineItem, TimelineType } from './components/STimeline.vue'
export type { FormRule } from './components/form-context'
export type { UploadFile } from './components/SUpload.vue'

const components = [
  SButton,
  SInput,
  SSelect,
  STextarea,
  SCheckbox,
  SRadio,
  SRadioGroup,
  SSwitch,
  SSlider,
  SCard,
  STag,
  SProgress,
  STabs,
  STab,
  SModal,
  SMessage,
  STooltip,
  SPopconfirm,
  SBadge,
  SPagination,
  SAvatar,
  SEmpty,
  SDivider,
  SForm,
  SFormItem,
  SInputNumber,
  SRate,
  SSkeleton,
  SBreadcrumb,
  STimeline,
  STable,
  SDrawer,
  SSteps,
  SCollapse,
  SUpload,
  SDatePicker,
  SSearch,
  SRefreshButton,
  SSpinner,
  SCarousel,
  SNotification,
  SQRCode,
  SConfirmDialog,
  SAuthPage,
  SSegmented,
  SCodeInput,
  SVerifyPage,
  SResult,
  SStatistic,
  STree,
  SDescriptions,
  SAlert,
  SImage,
  SBackTop,
  SPageHeader,
  STimePicker,
  SCalendar,
  SChart,
  SDropdown,
  SCopy,
  SEllipsis,
  STransfer,
  SDateRangePicker,
  SCascader,
  SColorPicker,
  SWatermark,
  SAnchor,
  SNumberAnimate,
  SInfiniteScroll,
  SLazyLoad,
  SContextMenu,
  SFullScreen,
  SMagnetic,
  SBurst,
  SParticles,
  SConfetti,
  STextScramble,
  SRipple,
  STrail,
  SGlitch,
  SSnowfall,
  SWave,
  SOrbit,
  STyping,
  SMorph,
  SBubble,
  SHeatmap,
  SRain,
  STextParticle,
  SFlame,
  SEye,
  SStarfield,
  SWaveText,
  SScan,
  SPixelate,
  SProgressFX,
  SLoaderRing,
  SParallax,
]

/** 全量引入：app.use(SkeuoUI) 后所有 S 组件全局可用 */
const SkeuoUI: Plugin = {
  install(app: App) {
    for (const c of components) {
      app.component((c as any).name ?? c.__name, c)
    }
  },
}

export default SkeuoUI
