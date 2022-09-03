<template>
  <div class="collect-icon" @click.stop="toggleCollect">
    <img :src="props.modelValue ? collected : collect" alt="" />
  </div>
</template>

<script lang="ts" setup>
import collect from '@/assets/img/star.svg';
import collected from '@/assets/img/star-fill.svg';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

function toggleCollect() {
  emit('update:modelValue', !props.modelValue);
  emit('change', !props.modelValue);
}
</script>

<style>
.collect-icon {
  cursor: pointer;
}
.collect-icon:hover {
  opacity: 0.7;
}
</style>
