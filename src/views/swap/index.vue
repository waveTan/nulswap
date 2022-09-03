<template>
  <div class="w1200 trading-page">
    <Overview
      v-if="showOverview && !isMobile"
      :swapSymbol="swapSymbol"
      :swapRate="swapRate"
      :list="orderList"
      v-model:pager="pager"
      v-model:txType="txType"
      @changeList="changeList"
    ></Overview>
    <Swap
      :assetsList="assetsList"
      :hotAssets="hotAssets"
      :defaultAsset="defaultAsset"
      @toggleExpand="toggleOverview"
      @selectAsset="changeOrderList"
      @updateRate="updateRate"
    ></Swap>
    <el-dialog
      custom-class="mobile-overview-dialog"
      top="10vh"
      v-model="showMobileOverview"
      :show-close="false"
      @closed="showOverview = false"
      :title="$t('trading.trading1')"
    >
      <Overview
        :swapSymbol="swapSymbol"
        :swapRate="swapRate"
        :list="orderList"
        destroy-on-close
        v-model:pager="pager"
        v-model:txType="txType"
        @changeList="changeList"
      ></Overview>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import Overview from './Overview.vue';
import Swap from './Swap.vue';
import useOverview from './hooks/useOverview';
import useAsset from './hooks/useAsset';
import useSelectAsset from './hooks/useSelectAsset';
import { AssetItem } from '@/store/types';

export default defineComponent({
  name: 'trading',
  components: {
    Overview,
    Swap
  },
  setup() {
    const { showOverview, toggleOverview, isMobile, showMobileOverview } =
      useOverview();

    const { assetsList, defaultAsset, hotAssets } = useAsset();

    const { swapSymbol, orderList, pager, txType, selectAsset, selectedAsset } =
      useSelectAsset();

    // url带交易对信息时请求一次订单列表信息
    watch(
      defaultAsset,
      val => {
        if (val.to) {
          selectAsset(val.from, val.to);
        }
      },
      { immediate: true }
    );
    watch(
      assetsList,
      val => {
        if (val && val.length) {
          if (selectedAsset.value) {
            selectAsset(selectedAsset.value.from, selectedAsset.value.to);
          }
        }
      },
      {
        immediate: true,
        deep: true
      }
    );

    // 切换兑换资产后刷新兑换记录
    function changeOrderList(from: AssetItem, to: AssetItem) {
      pager.index = 1;
      pager.total = 0;
      selectAsset(from, to);
    }

    // 分页
    function changeList() {
      selectAsset(selectedAsset.value?.from, selectedAsset.value?.to);
    }

    watch(
      () => txType.value,
      val => {
        if (val) {
          pager.index = 1;
          pager.total = 0;
          selectAsset(selectedAsset.value?.from, selectedAsset.value?.to);
        }
      }
    );

    const swapRate = ref('');
    function updateRate(rate: string) {
      swapRate.value = rate;
    }

    return {
      showOverview,
      toggleOverview,
      isMobile,
      showMobileOverview,
      assetsList,
      hotAssets,
      defaultAsset,
      swapSymbol,
      orderList,
      selectAsset,
      pager,
      txType,
      changeList,
      swapRate,
      updateRate,
      changeOrderList
    };
  }
});
</script>

<style lang="scss">
.trading-page {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}
</style>
