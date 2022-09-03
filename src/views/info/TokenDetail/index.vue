<template>
  <div class="token-detail w1200">
    <Breadcrumb :items="breadItems"></Breadcrumb>
    <KeyInfo :info="tokenInfo" />
    <div class="rate-into flex-between">
      <HandleBtn :info="tokenInfo" />
    </div>
    <div class="overview">
      <div class="left">
        <div class="base-info bg_white radius">
          <div class="info-item">
            <p class="label mb_5">{{ $t('info.info4') }}</p>
            <p class="value fw">${{ $format(tokenInfo.liq) }}</p>
          </div>
          <div class="info-item">
            <p class="label mb_5">{{ $t('info.info11') }}</p>
            <p class="value fw">${{ $format(tokenInfo.tx_24) }}</p>
          </div>
          <div class="info-item">
            <p class="label mb_5">{{ $t('info.info12') }}</p>
            <p class="value fw">${{ $format(tokenInfo.tx_7d) }}</p>
          </div>
          <div class="info-item">
            <p class="label mb_5">{{ $t('info.info30') }}</p>
            <p class="value fw">{{ $format(tokenInfo.tx_24_count) }}</p>
          </div>
        </div>
      </div>
      <div class="right radius">
        <ChartTab :assetKey="tokenInfo.assetKey" />
      </div>
    </div>
    <PoolsTable
      :title="$t('info.info2')"
      :data="pools"
      :total="poolTotal"
      @pageChange="index => getPoolsList(index, assetKey)"
    />
    <TxList :assetKey="tokenInfo.assetKey" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Breadcrumb from '../Breadcrumb.vue';
import KeyInfo from '../PoolDetail/KeyInfo.vue';
import HandleBtn from '../PoolDetail/Handle.vue';
import ChartTab from '../PoolDetail/ChartTab.vue';
import PoolsTable from '../Overview/PoolsTable.vue';
import TxList from '../PoolDetail/TxList.vue';
import { getTokenInfo } from '@/service/api';
import { TokenDetail } from '@/views/info/types';
import { divisionAndFix, priceFormat } from '@/utils/util';
import useTokensAndPools from '@/views/info/hooks/useTokensAndPools';

const { t } = useI18n();
const route = useRoute();

const assetKey = route.params.id as string;
const { pools, poolTotal, getPoolsList } = useTokensAndPools();
onMounted(() => {
  getPoolsList(0, assetKey);
  getTokenDetail();
});

const tokenInfo = ref<TokenDetail>({} as TokenDetail);
async function getTokenDetail() {
  // getTxs({tokenKey:assetKey})
  const res = await getTokenInfo(assetKey);
  if (res) {
    tokenInfo.value = {
      name: res.symbol,
      assetKey: res.assetChainId + '-' + res.assetId,
      price: priceFormat(divisionAndFix(res.price, 18, 18)),
      tx_24: divisionAndFix(res.amountUsdtValue24H, 18, 2),
      tx_7d: divisionAndFix(res.amountUsdtValue7D, 18, 2),
      tx_24_count: res.transactionCount24H,
      liq: divisionAndFix(res.reserveUsdtValue, 18, 2)
    };
  }
}

const breadItems = computed(() => {
  return [
    { label: t('header.header12'), path: '/info' },
    { label: t('info.info3'), path: '/info/tokens' },
    { label: tokenInfo.value.name }
  ];
});
</script>

<style lang="scss">
.token-detail {
  .rate-into {
    margin: 20px 0 30px;
  }
  .symbol_1 {
    margin-right: 40px;
  }
  .radius {
    border-radius: 20px;
    border: 1px solid #e4e9f4;
  }
  .bg_white {
    background-color: #fff;
  }
  .overview {
    display: flex;
    margin-bottom: 25px;
    .left {
      width: 220px;
      margin-right: 30px;
    }
    .right {
      width: 950px;
    }
    .base-info {
      padding: 50px 30px;
      height: 455px;
      .info-item {
        margin-bottom: 30px;
      }
      .value {
        font-size: 20px;
      }
      .label {
        font-size: 14px;
        color: #94a6ce;
      }
      .mb_5 {
        margin-bottom: 5px;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .rate-into {
      margin-top: 5px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      .handle-wrap {
        width: 100%;
        padding-top: 10px;
      }
    }
    .overview {
      flex-wrap: wrap;
      .left {
        width: 100%;
        margin-right: 0;
      }
      .right {
        width: 100%;
      }
      .base-info {
        padding: 20px;
        margin-bottom: 20px;
        height: auto;
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          &:last-of-type {
            margin-bottom: 0;
          }
          .value {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
