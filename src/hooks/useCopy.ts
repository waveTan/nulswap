import { copys } from '@/utils/util';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

export default function useCopy() {
  const { t } = useI18n();
  const toast = useToast();

  function copy(str: string) {
    copys(str);
    toast.success(t('public.public13'));
  }

  return {
    copy
  };
}
