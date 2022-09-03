<template>
  <div class="node-page" v-loading="loading">
    <template v-if="!nodeHash || !nodeDeposit">
      <CreateNode
        :address="nerveAddress"
        :nvtBalance="nvtBalance"
        @refresh="refreshInfo"
      />
    </template>
    <template v-else>
      <NodeDetail
        :hash="nodeHash"
        :address="nerveAddress"
        :nvtBalance="nvtBalance"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CreateNode from './CreateNode.vue';
import NodeDetail from './NodeDetail.vue';
import useStoreState from '@/hooks/useStoreState';
import { getAccountConsensusNode } from '@/service/api';

const { nerveAddress, assetsList } = useStoreState();

const nodeHash = ref('');
const nodeDeposit = ref(0);

onMounted(() => {
  getNodeInfo();
});

const loading = ref(true);
async function getNodeInfo() {
  const address = nerveAddress.value;
  // const address = 'TNVTdTSPSaKU5hqs4NAG1FNExqXm4qsxKHrd2';
  if (address) {
    loading.value = true;
    const result = await getAccountConsensusNode<{
      txHash: string;
      deposit: number;
    }>(address);
    if (result) {
      nodeHash.value = result.txHash;
      nodeDeposit.value = result.deposit;
    }
  }
  loading.value = false;
}

const nvtBalance = computed(() => {
  return assetsList.value.find(v => v.symbol === 'NVT')?.available || '0';
});
async function refreshInfo() {
  await getNodeInfo();
  if (!nodeHash.value) {
    setTimeout(async () => {
      getNodeInfo();
    }, 2000);
  }
}
</script>

<style lang="scss">
.node-page {
  min-height: 300px;
}
</style>
