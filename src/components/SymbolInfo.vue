<template>
  <div class="symbol-chain-info flex-center">
    <SymbolIcon :icon="props.logo || props.name" :asset-key="props.assetKey"></SymbolIcon>
    <div class="chain-info">
      <span class="name">{{ props.name }}</span>
      <span class="chain">{{ props.chain }}&nbsp;&nbsp;|&nbsp;&nbsp;ID: {{ props.assetKey }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SymbolIcon from '@/components/SymbolIcon.vue';

const props = defineProps<{
  logo?: string;
  name: string;
  chain: string;
  assetKey: string;
}>();

const name = ref('hi');
</script>

<style lang="scss">
.symbol-chain-info {
  .symbol-icon {
    margin-right: 10px;
  }
  .chain-info {
    display: flex;
    flex-direction: column;
    span {
      line-height: 1;
    }
    .name {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .chain {
      font-size: 12px;
      color: #94a6ce;
    }
  }
}
</style>
