import { ref, watch, onBeforeUnmount } from 'vue';

export default function useMask(overHide = true) {
  const showMask = ref(false);
  function changeShowMask(status: boolean) {
    showMask.value = status;
  }
  watch(
    () => showMask.value,
    val => {
      if (val && overHide) {
        document.body.classList.add('overhide');
      } else {
        document.body.classList.remove('overhide');
      }
    }
  );
  onBeforeUnmount(() => {
    document.body.classList.remove('overhide');
  });
  return {
    showMask,
    changeShowMask
  };
}
