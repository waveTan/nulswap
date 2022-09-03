<template>
  <div class="handle-wrap">
    <el-button @click="addLiquidity">{{ $t('info.info17') }}</el-button>
    <el-button type="primary" @click="swap">{{ $t('info.info18') }}</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const props = defineProps<{
  info: any;
  isPool?: boolean;
}>();

const router = useRouter();

function addLiquidity() {
  if (props.isPool) {
    const { token0, token1 } = props.info;
    router.push(`/liquidity/${token0}/${token1}`);
  } else {
    router.push(`/liquidity/${props.info.assetKey}`);
  }
}
function swap() {
  if (props.isPool) {
    const { token0, token1 } = props.info;
    router.push(`/swap/${token0}/${token1}`);
  } else {
    router.push(`/swap/${props.info.assetKey}`);
  }
}
</script>

<style lang="scss">
.handle-wrap {
  .el-button {
    min-width: 140px;
    span {
      font-size: 14px;
    }
    &:first-child {
      color: #2688f7;
      border-color: #2688f7;
    }
  }
}
</style>
