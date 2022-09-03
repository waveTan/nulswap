<template>
  <div class="symbols-wrap flex-center">
    <div class="img-wrap flex-center">
      <SymbolIcon :icon="symbols[1]" :asset-key="assetKeys[1]"></SymbolIcon>
      <SymbolIcon :icon="symbols[0]" :asset-key="assetKeys[0]"></SymbolIcon>
    </div>
    <span>{{ props.name || symbols[0] + '/' + symbols[1] }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import { sortAssetsByValuation } from '@/utils/util';

const props = defineProps<{
  symbol1: string;
  assetKey1: string;
  symbol2: string;
  assetKey2: string;
  name?: string;
}>();

const symbols = computed(() => {
  if (!props.symbol1) return [];
  return sortAssetsByValuation(props.symbol1, props.symbol2);
});
const assetKeys = computed(() => {
  if (symbols.value[0] === props.symbol1 && symbols.value[1] === props.symbol2) {
    return [props.assetKey1, props.assetKey2];
  } else {
    return [props.assetKey2, props.assetKey1];
  }
});
</script>

<style lang="scss">
.symbols-wrap {
  .img-wrap {
    //margin-right: 10px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #fff;
      &:last-child {
        margin-left: -10px;
      }
    }
  }
}
</style>
