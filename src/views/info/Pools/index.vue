<template>
  <div class="info-pools">
    <!--  关注的池子  -->
    <PoolsTable
      :title="$t('info.info15')"
      :data="focusPools"
      :page-size="focusPools.length"
      :total="focusPools.length"
    />
    <!-- 全部池子   -->
    <PoolsTable
      :title="$t('info.info16')"
      :data="pools"
      :total="poolTotal"
      @pageChange="getPoolsList"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useFocusPools } from '../hooks/useFocusTokensAndPools';
import useTokensAndPools from '../hooks/useTokensAndPools';
import PoolsTable from '../Overview/PoolsTable.vue';

const { focusPools } = useFocusPools();
const { pools, poolTotal, getPoolsList } = useTokensAndPools();

onMounted(() => {
  getPoolsList();
});
</script>

<style></style>
