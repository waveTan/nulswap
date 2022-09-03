import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import enLocale from 'element-plus/lib/locale/lang/en';

export default function useLang() {
  const store = useStore();
  const { locale } = useI18n();
  // 切换的语言
  const lang = computed(() => {
    return locale.value === 'en' ? 'CN' : 'EN';
  });
  function switchLang() {
    locale.value = lang.value === 'EN' ? 'en' : 'zh-cn';
    store.commit('switchLang', locale.value);
  }
  // element-plus国际化
  const localeLang = computed(() => {
    return lang.value === 'EN' ? zhCn : enLocale;
  });
  return {
    lang,
    switchLang,
    localeLang
  };
}
