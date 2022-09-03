<template>
  <div class="info-search">
    <div
      class="mask"
      v-show="showMask"
      @click.stop="changeShowMask(false)"
    ></div>
    <!--    <el-input :placeholder="$t('info.info6')"></el-input>-->
    <div class="search-content" ref="wrapper">
      <el-input
        :placeholder="$t('info.info6')"
        @focus="changeShowMask(true)"
        v-model="searchVal"
      >
        <template #suffix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <div class="search-result" v-show="showMask">
        <div class="assets">
          <div class="head">
            <div>{{ $t('info.info3') }}</div>
            <div class="xs-hide">{{ $t('info.info9') }}</div>
            <div class="xs-hide">{{ $t('info.info4') }}</div>
          </div>
          <div class="content-wrap">
            <template v-if="!searchVal">
              <div>{{ $t('info.info33') }}</div>
            </template>
            <template v-else>
              <div
                class="content"
                v-for="item in assets"
                :key="item.assetKey"
                @click="toUrl('token', item.assetKey)"
              >
                <div class="symbol-wrap">
                  <SymbolInfo
                    :name="item.symbol"
                    :asset-key="item.assetKey"
                    :chain="item.originChain"
                  ></SymbolInfo>
                  <CollectIcon
                    v-model="item.isWatch"
                    @change="changeCollect(item.assetKey, $event, 'token')"
                  />
                </div>
                <div class="xs-hide">${{ item.price }}</div>
                <div class="xs-hide">${{ $format(item.liq) }}</div>
              </div>
              <div class="no-data" v-if="!assets.length">
                {{ $t('public.public19') }}
              </div>
            </template>
          </div>
        </div>
        <div class="pools">
          <div class="head">
            <div>{{ $t('info.info2') }}</div>
            <div class="xs-hide"></div>
            <div class="xs-hide">{{ $t('info.info4') }}</div>
          </div>
          <div class="content-wrap">
            <template v-if="!searchVal">
              <div>{{ $t('info.info33') }}</div>
            </template>
            <template v-else>
              <div
                class="content"
                v-for="item in pools"
                :key="item.address"
                @click="toUrl('pool', item.address)"
              >
                <div class="symbol-wrap">
                  <LiquiditySymbols
                    :symbol1="item.token0"
                    :symbol2="item.token1"
                    :asset-key1="item.token0Key"
                    :asset-key2="item.token1Key"
                  ></LiquiditySymbols>
                  <CollectIcon
                    v-model="item.isWatch"
                    @change="changeCollect(item.address, $event, 'pool')"
                  />
                </div>
                <div class="xs-hide"></div>
                <div class="xs-hide">${{ $format(item.liq) }}</div>
              </div>
              <div class="no-data" v-if="!pools.length">
                {{ $t('public.public19') }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import SymbolInfo from '@/components/SymbolInfo.vue';
import LiquiditySymbols from '@/components/LiquiditySymbols.vue';
import CollectIcon from '@/components/CollectIcon.vue';
import useClickOutside from '@/hooks/useClickOutside';
import useMask from '@/hooks/useMask';
import useCollect from './hooks/useCollect';
import { searchText } from '@/service/api';
import { debounce, divisionAndFix, getOriginChain } from '@/utils/util';
import storage from '@/utils/storage';
import { SearchToken, SearchPool } from './types';

const router = useRouter();
const { showMask, changeShowMask } = useMask();
const wrapper = ref<HTMLElement>();
const { isClickOutside } = useClickOutside(wrapper);
const { changeCollect } = useCollect();
watch(
  () => isClickOutside.value,
  val => {
    if (val) {
      changeShowMask(false);
    }
  }
);

const searchVal = ref('');
const assets = ref<SearchToken[]>([]);
const pools = ref<SearchPool[]>([]);
watch(
  () => searchVal.value,
  val => {
    assets.value = [];
    pools.value = [];
    if (val) {
      search(val);
    }
  }
);
const debounceSearch = debounce(doSearch, 1000);
const search = (key: string) => debounceSearch(key);

async function doSearch(key: string) {
  const res = await searchText(key);
  if (res && res.pool && res.token && searchVal.value) {
    const list1: SearchToken[] = [];
    const list2: SearchPool[] = [];
    const watchTokens = storage.get('watchTokens') || [];
    const watchPools = storage.get('watchPools') || [];
    res.token.sort((a, b) => {
      // @ts-ignore
      return a.reserveUsdtValue - b.reserveUsdtValue < 0 ? 1 : -1;
    });
    res.pool.sort((a, b) => {
      // @ts-ignore
      return a.reserveUsdtValue - b.reserveUsdtValue < 0 ? 1 : -1;
    });
    res.token.map(v => {
      const assetKey = v.assetChainId + '-' + v.assetId;
      list1.push({
        originChain: getOriginChain(v.sourceChainid, v.assetChainId),
        assetKey,
        symbol: v.symbol,
        price: divisionAndFix(v.price, 18, 2),
        liq: divisionAndFix(v.reserveUsdtValue, 18, 2),
        txs: divisionAndFix(v.amountUsdtValue24H, 18, 2),
        isWatch: watchTokens.includes(assetKey)
      });
    });
    assets.value = list1;
    res.pool.map(v => {
      // const assetLP = getAssetByKey(v.tokenLP);
      list2.push({
        address: v.address,
        liq: divisionAndFix(v.reserveUsdtValue, 18, 2),
        isWatch: watchPools.includes(v.address),
        token0: v.token0Symbol,
        token1: v.token1Symbol,
        lpName: v.token0Symbol + ' / ' + v.token1Symbol,
        token0Key: v.token0,
        token1Key: v.token1
      });
    });
    pools.value = list2;
  }
}

function toUrl(type: string, query: string) {
  if (type === 'token') {
    router.push(`/info/tokens/${query}`);
  } else {
    router.push(`/info/pools/${query}`);
  }
}
</script>

<style lang="scss">
.info-search {
  //position: relative;
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    //top: 80px;
    top: 0;
    bottom: 0;
    z-index: 10;
    opacity: 0.46;
    background-color: #212121;
  }
  .search-content {
    position: relative;
    z-index: 20;
    bottom: 12px;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    .el-input {
      width: 300px;
      .el-input__inner {
        padding-left: 18px;
        border-radius: 20px;
        &::-webkit-input-placeholder {
          color: #bdc4d6;
        }
      }
    }
    .search-result {
      width: 580px;
      padding: 30px;
      margin-top: 20px;
      background: #fff;
      border: 1px solid #e4e9f4;
      border-radius: 20px;
      position: absolute;
      top: 40px;
    }
  }
  .search-result {
    .assets {
      margin-bottom: 25px;
    }
    .assets,
    .pools {
      .content-wrap {
        max-height: 200px;
        overflow: auto;
      }
      .head,
      .content {
        display: grid;
        gap: 1em;
        grid-template-columns: 1.5fr 1fr 0.8fr; //repeat(2, 1fr);
        margin-bottom: 10px;
      }
      .head {
        font-size: 14px;
        color: #475472;
        margin-bottom: 15px;
      }
      .content {
        color: #475472;
        cursor: pointer;
        align-items: center;
        .symbol-wrap {
          display: flex;
          align-items: center;
          .symbol-icon {
            width: 30px;
            height: 30px;
            margin-right: 8px;
            background-color: #fff;
          }
          .collect-icon img {
            width: 25px;
            height: 25px;
            margin-left: 8px;
          }
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .pools {
      .content {
        grid-template-columns: 2.5fr 0fr 0.8fr; //repeat(2, 1fr);
      }
      .symbol-wrap {
        .symbol-icon {
          margin-right: 0;
          &:last-of-type {
            margin-left: -15px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .mask {
      //top: 60px;
    }
    .search-content .search-result {
      left: 0;
    }
    .search-result {
      .assets {
        margin-bottom: 25px;
      }
      .assets,
      .pools {
        .head {
          margin-bottom: 10px;
        }
      }
    }
  }
  @media screen and (max-width: 600px) {
    .search-content .search-result {
      width: 340px;
      padding: 20px;
      max-height: 400px;
      overflow: auto;
      .xs-hide {
        display: none;
      }
    }
  }
}
</style>
