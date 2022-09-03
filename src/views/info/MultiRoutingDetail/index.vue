<template>
  <div class="multi-routing-detail w1200">
    <Breadcrumb :items="breadItems"></Breadcrumb>
    <div class="route-info flex-between">
      <div class="left flex-center">
        <SymbolIcon :icon="tokenInfo.logo"></SymbolIcon>
        <div class="symbol-info">
          <p class="name">{{ tokenInfo.name }}</p>
          <p class="info">${{ tokenInfo.price }}</p>
        </div>
      </div>
      <div class="right flex-center">
        <div class="symbol-info">
          <p class="name">{{ tokenInfo.lpTokenSymbol }}</p>
          <p class="info">
            {{ $t('info.info37') }} 丨 ID: {{ tokenInfo.assetKey }}
          </p>
        </div>
        <el-button type="primary" @click="getLp(tokenInfo.assetKey)">
          {{ $t('info.info43') }}
        </el-button>
      </div>
      <div class="mobile-btn">
        <el-button type="primary" @click="getLp(tokenInfo.assetKey)">
          {{ $t('info.info43') }}
        </el-button>
      </div>
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
        </div>
      </div>
      <div class="right radius">
        <ChartTab
          :assetKey="tokenInfo.address"
          is-multi-routing
          :chainKey="activeChainKey"
        >
          <div class="routes-wrap">
            <div
              :class="['route-item', activeChain === 'ALL' && 'active']"
              @click="activeChain = 'ALL'"
            >
              {{ $t('info.info20') }}
            </div>
            <div
              :class="['route-item', activeChain === item.name && 'active']"
              v-for="item in multiRoutes"
              :key="item.value"
              @click="activeChain = item.name"
            >
              {{ item.name }}
            </div>
          </div>
        </ChartTab>
      </div>
    </div>
    <FundTable
      :title="$t('info.info39')"
      :data="multiChains"
      :total="multiChains.length"
    />
    <TxList :assetKey="tokenInfo.address" is-multi-routing />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '../Breadcrumb.vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import ChartTab from '../PoolDetail/ChartTab.vue';
import FundTable from './FundTable.vue';
import TxList from '../PoolDetail/TxList.vue';
import { getMultiPair } from '@/service/api';
import { MultiChainInfo, MultiRoutingItem } from '@/views/info/types';
import { divisionAndFix, fixNumber, priceFormat } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import config from '@/config';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const assetKey = route.params.id as string;
onMounted(() => {
  getTokenDetail();
});

const tokenInfo = ref<Omit<MultiRoutingItem, 'supportChain'>>(
  {} as Omit<MultiRoutingItem, 'supportChain'>
);
const multiChains = ref<MultiChainInfo[]>([]);
async function getTokenDetail() {
  // getTxs({tokenKey:assetKey})
  const res = await getMultiPair(assetKey);
  if (res) {
    tokenInfo.value = {
      name: res.name,
      logo: res.logo || res.name,
      lpTokenSymbol: res.lpTokenSymbol,
      assetKey: res.lpTokenChainId + '-' + res.lpTokenAssetId,
      address: res.pairAddress,
      price: priceFormat(divisionAndFix(res.price, 18, 18)),
      tx_24: divisionAndFix(res.amountUsdtValue24H, 18, 2),
      tx_7d: divisionAndFix(res.amountUsdtValue7D, 18, 2),
      liq: divisionAndFix(res.reserveUsdtValue, 18, 2)
    };
    res.tokenList.map(v => {
      multiChains.value.push({
        name: getChainNameById(v.sourceChainId, v.assetChainId),
        contractAddress: v.contractAddress,
        liq: divisionAndFix(v.reserveUsdtValue, 18, 2),
        ratio: fixNumber(v.ratio / 100, 2),
        nerveId: v.assetChainId + '-' + v.assetId
      });
    });
    console.log(multiChains.value, 77);
  }
}

function getChainNameById(sourceChainId: number, assetChainId: number) {
  const chains = Object.values(_networkInfo);
  let chainName = '';
  if (sourceChainId !== 0) {
    chainName = chains.find(v => v.chainId === sourceChainId)!.name;
  } else {
    chainName = config.chainId === assetChainId ? 'NERVE' : 'NULS';
  }
  return chainName;
}

const breadItems = computed(() => {
  return [
    { label: t('header.header12'), path: '/info' },
    { label: t('info.info35'), path: '/info/multi-routing' },
    { label: tokenInfo.value.name }
  ];
});

const multiRoutes = computed(() => {
  return multiChains.value.map(v => ({
    name: v.name,
    value: v.nerveId
  }));
});

const activeChain = ref('ALL');
const activeChainKey = computed(() => {
  return multiRoutes.value.find(v => v.name === activeChain.value)?.value || 'ALL';
});

function getLp(key: string) {
  const nvtKey = config.chainId + '-' + config.assetId;
  const path = `/swap/${nvtKey}/${key}`;
  router.push(path);
}
</script>

<style lang="scss">
.multi-routing-detail {
  .route-info {
    margin-bottom: 30px;
    .left {
      img {
        width: 42px;
        height: 42px;
        margin-right: 10px;
      }
    }
    .symbol-info {
      .name {
        font-size: 20px;
        font-weight: 600;
      }
      .info {
        font-size: 14px;
        color: #94a6ce;
      }
    }
    .right .symbol-info {
      text-align: right;
    }
    .mobile-btn .el-button,.right .el-button {
      min-width: 140px;
      margin-left: 20px;
      span {
        font-size: 14px;
      }
    }
    .mobile-btn {
      display: none;
      padding-top: 10px;
      .el-button {
        margin-left: 0;
      }
    }
  }
  .chart-tab {
    background-color: #fff;
    border-radius: 20px;
    .routes-wrap {
      display: flex;
      overflow-x: auto;
      padding: 30px 30px 5px;
      margin-bottom: 5px;
      background-color: #fff;
      border-radius: 20px 20px 0 0;
    }
    .route-item {
      flex-shrink: 0;
      padding: 8px 12px;
      margin-right: 12px;
      border-radius: 10px;
      background: #f3f6fd;
      color: #94a6ce;
      cursor: pointer;
      border: 1px solid transparent;
      &.active {
        background-color: #fff;
        color: #2688f7;
        border-color: #2688f7;
      }
    }
    .tabs {
      margin: 0 30px;
      height: 42px;
      line-height: 40px;
      border-bottom: 1px solid #e4e9f4;
      .tab-item {
        background-color: #fff;
        border-radius: 0;
        color: #475472;
        span {
          display: inline-block;
          margin-bottom: 1px;
          color: #94A6CE;
          border-bottom: 2px solid transparent;
        }
      }
      .tab-item.active {
        span {
          color: #2688F7;
          border-bottom: 2px solid #2688F7;
        }
      }
    }
    .tab-content {
      height: 334px;
    }
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
        margin-bottom: 55px;
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
    .route-info {
      margin-bottom: 20px;
      flex-wrap: wrap;
      .left {
        img {
          width: 35px;
          height: 35px;
        }
      }
      .symbol-info {
        .name {
          font-size: 18px;
        }
      }
      .right .el-button {
        display: none;
      }
      .mobile-btn {
        display: block;
        width: 100%;
      }
    }
    .chart-tab {
      .routes-wrap {
        padding: 20px 20px 0;
        flex-wrap: wrap;
      }
      .route-item {
        margin-bottom: 10px;
      }
    }
    .overview {
      flex-wrap: wrap;
      margin-bottom: 20px;
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
