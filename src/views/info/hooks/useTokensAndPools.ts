import { ref } from 'vue';
import { getTokenList, getPairList } from '@/service/api';
import { TokenItem, PoolItem } from '../types';
import { divisionAndFix, Division, fixNumber, priceFormat, getOriginChain } from '@/utils/util';

export default function useTokensAndPools() {
  const tokens = ref<TokenItem[]>([]);
  const tokenTotal = ref(0);
  const pools = ref<PoolItem[]>([]);
  const poolTotal = ref(0);

  async function getAssetsList(pageIndex?: number) {
    const params = pageIndex ? { pageIndex } : {};
    const res = await getTokenList(params);
    if (res) {
      const list: TokenItem[] = [];
      res.list.map(v => {
        list.push({
          originChain: getOriginChain(v.sourceChainid, v.assetChainId),
          name: v.symbol,
          assetKey: v.assetChainId + '-' + v.assetId,
          price: priceFormat(divisionAndFix(v.price, 18, 18)),
          priceChange: fixNumber(Division(v.priceChange, 100).toFixed(), 2),
          txs: divisionAndFix(v.amountUsdtValue24H, 18, 2),
          liq: divisionAndFix(v.reserveUsdtValue, 18, 2)
        });
      });
      tokens.value = list;
      tokenTotal.value = res.total;
    }
  }
  async function getPoolsList(pageIndex?: number, tokenKey?: string) {
    const params = pageIndex ? { pageIndex, tokenKey } : { tokenKey };
    const res = await getPairList(params);
    if (res) {
      const list: PoolItem[] = [];
      res.list.map(v => {
        // console.log(v.tokenLPSymbol, 888);
        list.push({
          name: v.tokenLPSymbol,
          address: v.address,
          token0Symbol: v.token0Symbol,
          token1Symbol: v.token1Symbol,
          token0: v.token0,
          token1: v.token1,
          tx_24: divisionAndFix(v.amountUsdtValue24H, 18, 2),
          tx_7d: divisionAndFix(v.amountUsdtValue7D, 18, 2),
          lp_24: divisionAndFix(v.feeUsdtValue, 18, 2),
          apr: fixNumber(Division(v.feeUsdtValueARP, 100).toFixed(), 2),
          liq: divisionAndFix(v.reserveUsdtValue, 18, 2)
        });
      });
      pools.value = list;
      poolTotal.value = res.total;
    }
  }
  return {
    tokens,
    tokenTotal,
    getAssetsList,
    pools,
    poolTotal,
    getPoolsList
  };
}
