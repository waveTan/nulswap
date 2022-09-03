import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';

export default function useClickOutside(el: Ref) {
  const isClickOutside = ref(false);
  function clickHandler(e: MouseEvent) {
    const target = e.target;
    isClickOutside.value =
      target instanceof Node && !el.value?.contains(target);
  }
  onMounted(() => {
    document.body.addEventListener('click', clickHandler);
  });
  onBeforeUnmount(() => {
    document.body.removeEventListener('click', clickHandler);
  });

  return {
    isClickOutside
  };
}
