<template>
  <div class="pool-detail w1200">
    <Breadcrumb :items="breadItems"></Breadcrumb>
    <KeyInfo :info="poolInfo" is-pool />
    <div class="rate-into flex-between">
      <div class="left flex-center">
        <div class="symbol_1">
          <img src="" alt="" />
          <span>{{ rateInfo }}</span>
        </div>
        <div class="symbol_2">
          <img src="" alt="" />
          <span>{{ rateInfoReverse }}</span>
        </div>
      </div>
      <HandleBtn :info="poolInfo" is-pool />
    </div>
    <div class="overview">
      <div class="left">
        <div class="base-info bg_white radius">
          <div class="flex">
            <div class="liq">
              <p class="label mb_5">{{ $t('info.info4') }}</p>
              <p class="value fw">${{ $format(poolInfo.liq) }}</p>
            </div>
            <div class="apr">
              <p class="label mb_5">{{ $t('info.info14') }}</p>
              <p class="value fw">{{ poolInfo.apr || 0 }}%</p>
            </div>
          </div>
          <div class="lock-info">
            <p class="label">{{ $t('info.info19') }}</p>
            <div class="flex-between">
              <div class="flex-center">
                <SymbolIcon :icon="poolInfo.token0Symbol" :asset-key="poolInfo.token0"/>
                {{ poolInfo.token0Symbol }}
              </div>
              <span class="fw">{{ $format(poolInfo.reserve0) }}</span>
            </div>
            <div class="flex-between">
              <div class="flex-center">
                <SymbolIcon :icon="poolInfo.token1Symbol" :asset-key="poolInfo.token1" />
                {{ poolInfo.token1Symbol }}
              </div>
              <span class="fw">{{ $format(poolInfo.reserve1) }}</span>
            </div>
          </div>
        </div>
        <div class="tx-info bg_white radius">
          <div class="tab">
            <span
              :class="{ active: activeDataTab === '1' }"
              @click="changeDataTab('1')"
            >
              24H
            </span>
            <span
              :class="{ active: activeDataTab === '2' }"
              @click="changeDataTab('2')"
            >
              7D
            </span>
          </div>
          <div class="tab-content flex-between">
            <template v-if="activeDataTab === '1'">
              <div>
                <p class="label">{{ $t('info.info11') }}</p>
                <p class="value fw">${{ $format(poolInfo.tx_24) }}</p>
              </div>
              <div>
                <p class="label">{{ $t('info.info13') }}</p>
                <p class="value fw">${{ $format(poolInfo.lp_24) }}</p>
              </div>
            </template>
            <template v-else>
              <div>
                <p class="label">{{ $t('info.info12') }}</p>
                <p class="value fw">${{ $format(poolInfo.tx_7d) }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="right radius">
        <ChartTab is-pool :assetKey="poolInfo.address" />
      </div>
    </div>
    <TxList :assetKey="assetKey" is-pool />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Breadcrumb from '../Breadcrumb.vue';
import KeyInfo from './KeyInfo.vue';
import HandleBtn from './Handle.vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import ChartTab from './ChartTab.vue';
import TxList from './TxList.vue';
import { getPoolInfo } from '@/service/api';
import { Division, divisionAndFix, fixNumber } from '@/utils/util';
import { PoolDetail } from '../types';

const { t } = useI18n();
const route = useRoute();

const assetKey = route.params.id as string;
onMounted(() => {
  getPoolDetail();
});

const poolInfo = ref<PoolDetail>({} as PoolDetail);
async function getPoolDetail() {
  const res = await getPoolInfo(assetKey);
  if (res) {
    poolInfo.value = {
      name: res.token0Symbol + '/' + res.token1Symbol,
      address: res.address,
      tx_24: divisionAndFix(res.amountUsdtValue24H, 18, 2),
      tx_7d: divisionAndFix(res.amountUsdtValue7D, 18, 2),
      lp_24: divisionAndFix(res.feeUsdtValue, 18, 2),
      apr: fixNumber(Division(res.feeUsdtValueARP, 100).toFixed(), 2),
      liq: divisionAndFix(res.reserveUsdtValue, 18, 2),
      token0: res.token0,
      token0Decimals: res.token0Decimals,
      token0Symbol: res.token0Symbol,
      token1: res.token1,
      token1Decimals: res.token1Decimals,
      token1Symbol: res.token1Symbol,
      tokenLP: res.tokenLP,
      reserve0: divisionAndFix(res.reserve0, res.token0Decimals, 2),
      reserve1: divisionAndFix(res.reserve1, res.token1Decimals, 2)
    };
  }
}

const breadItems = computed(() => {
  return [
    { label: t('header.header12'), path: '/info' },
    { label: t('info.info2'), path: '/info/pools' },
    { label: poolInfo.value.name }
  ];
});

const rateInfo = computed(() => {
  if (!poolInfo.value.name) return '';
  const { token0Symbol, token1Symbol, reserve0, reserve1 } = poolInfo.value;
  const rate = fixNumber(Division(reserve1, reserve0).toFixed(), 4);
  return `1 ${token0Symbol} ≈ ${rate} ${token1Symbol}`;
});

const rateInfoReverse = computed(() => {
  if (!poolInfo.value.name) return '';
  const { token0Symbol, token1Symbol, reserve0, reserve1 } = poolInfo.value;
  const rate = fixNumber(Division(reserve0, reserve1).toFixed(), 4);
  return `1 ${token1Symbol} ≈ ${rate} ${token0Symbol}`;
});

const activeDataTab = ref('1');

function changeDataTab(tab: string) {
  activeDataTab.value = tab;
}
</script>

<style lang="scss">
.pool-detail {
  .rate-into {
    margin: 10px 0 30px;
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
    margin-bottom: 30px;
    .left {
      width: 310px;
      margin-right: 30px;
    }
    .right {
      width: 850px;
    }
    .base-info {
      height: 244px;
      padding: 30px;
      margin-bottom: 30px;
    }
    .liq {
      width: 60%;
    }
    .apr {
      width: 40%;
    }
    .liq,
    .apr {
      //flex: 1;
      .value {
        font-size: 20px;
      }
    }
    .label {
      font-size: 14px;
      color: #94a6ce;
      white-space: nowrap;
    }
    .mb_5 {
      margin-bottom: 5px;
    }
    .lock-info {
      margin-top: 25px;
      .label {
        margin-bottom: 10px;
      }
      .flex-between {
        margin-bottom: 10px;
      }
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .tx-info {
      height: 180px;
      padding: 30px;
      .tab {
        background-color: #f3f6fd;
        color: #94a6ce;
        margin-bottom: 25px;
        border-radius: 20px;
        text-align: center;
        span {
          display: inline-block;
          width: 50%;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          &.active {
            background-color: #78a0f3;
            color: #fff;
            border-radius: 20px;
          }
        }
      }
      .value {
        font-size: 20px;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .rate-into {
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
      }
      .tx-info {
        height: 180px;
        padding: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
