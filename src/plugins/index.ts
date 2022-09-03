import { App } from 'vue';
import { useElIcon } from './el-icon';
import { useI18nPlugin } from './i18n';
import { useGlobalProperties } from './globalProperties';
import { useCustomToast } from './toast';
import { useLazyLoad } from './lazyLoad';
import './element-plus';

export default function usePlugins(app: App) {
  useGlobalProperties(app);
  useElIcon(app);
  useI18nPlugin(app);
  useCustomToast(app);
  useLazyLoad(app);
}
