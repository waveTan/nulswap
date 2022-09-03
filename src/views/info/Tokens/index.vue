<template>
  <div class="info-assets">
    <!--  关注的资产  -->
    <AssetsTable
      :title="$t('info.info15')"
      :data="focusTokens"
      :total="focusTokens.length"
      :page-size="focusTokens.length"
    />
    <!-- 全部资产   -->
    <AssetsTable
      :title="$t('info.info32')"
      :data="tokens"
      :total="tokenTotal"
      @pageChange="getAssetsList"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useFocusTokens } from '../hooks/useFocusTokensAndPools';
import useTokensAndPools from '../hooks/useTokensAndPools';
import AssetsTable from '../Overview/AssetsTable.vue';

const { focusTokens } = useFocusTokens();
const { tokens, tokenTotal, getAssetsList } = useTokensAndPools();

onMounted(() => {
  getAssetsList();
});
</script>

<style></style>
