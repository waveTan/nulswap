import { onMounted, reactive, ref } from 'vue';
import useStoreState from '@/hooks/useStoreState';
import nerve from 'nerve-sdk-js';
import config from '@/config';
import {
  userTradeHistoryPage,
  userStableTradeHistoryPage,
  getStablePairListForSwapTrade
} from '@/service/api';
import dayjs from 'dayjs';
import { divisionDecimals, getOriginChain } from '@/utils/util';
import {
  SwapSymbol,
  OrderItem,
  Pager,
  DefaultAsset,
  AssetItem
} from '../types';

export default function useSelectAsset() {
  const { nerveAddress } = useStoreState();
  // let selectedAsset = null as DefaultAsset | null;

  let stablePairList: any = [];
  const getStablePairList = async () => {
    const res = await getStablePairListForSwapTrade();
    if (res) {
      stablePairList = res;
    }
  };
  onMounted(getStablePairList);

  const selectedAsset = ref<DefaultAsset>();
  const swapSymbol = ref<SwapSymbol>({} as SwapSymbol);
  const orderList = ref<OrderItem[]>([] as OrderItem[]);
  const pager = reactive<Pager>({
    index: 1,
    size: 5,
    total: 0
  });
  const txType = ref('swap'); // swap | multiRouting
  async function selectAsset(fromAsset?: AssetItem, toAsset?: AssetItem) {
    if (!nerveAddress.value || !fromAsset || !toAsset) return;
    selectedAsset.value = {
      from: fromAsset,
      to: toAsset
    };
    swapSymbol.value = {
      from: fromAsset.symbol,
      to: toAsset.symbol
    };
    const fromToken = nerve.swap.token(fromAsset.chainId, fromAsset.assetId);
    const toToken = nerve.swap.token(toAsset.chainId, toAsset.assetId);
    const pairAddress = nerve.swap.getStringPairAddress(
      config.chainId,
      fromToken,
      toToken
    );
    const data = {
      pairAddress,
      userAddress: nerveAddress.value,
      pageIndex: pager.index,
      pageSize: pager.size
    };
    // state.orderLoading = true;
    const isMultiRouting = txType.value === 'multiRouting';
    let res: any;
    if (isMultiRouting) {
      stablePairList.map((pair: any) => {
        if (pair.groupCoin[fromAsset.assetKey] && pair.groupCoin[toAsset.assetKey]) {
          // 稳定币换稳定币
          data.pairAddress = pair.address;
        } else if (pair.lpToken === fromAsset.assetKey && pair.groupCoin[toAsset.assetKey]) {
          // 稳定币N换稳定币
          data.pairAddress = pair.address;
        } else if (pair.lpToken === toAsset.assetKey && pair.groupCoin[fromAsset.assetKey]) {
          // 稳定币换稳定币N
          data.pairAddress = pair.address;
        } else {
          //
        }
      });
      // console.log(data, '------------data-------------', pairAddress);
      res = await userStableTradeHistoryPage(data);
      // console.log(res, '77675555');
    } else {
      res = await userTradeHistoryPage(data);
    }
    // state.orderLoading = false;
    if (res) {
      pager.total = res.total || 0;
      const list: OrderItem[] = [];
      res.list.map((v: any) => {
        const fromToken = v.paidTokenAmount.token;
        const fromAmount = v.paidTokenAmount.amount;
        const toToken = v.receivedTokenAmount.token;
        const toAmount = v.receivedTokenAmount.amount;
        const fromChain = getOriginChain(fromToken.heterogeneousChainId);
        const toChain = getOriginChain(toToken.heterogeneousChainId);
        list.push({
          time: dayjs(v.txTime * 1000).format('MM-DD HH:mm'),
          fromAmount: divisionDecimals(fromAmount, fromToken.decimals),
          fromSymbol: isMultiRouting ? fromToken.symbol + '(' + fromChain + ')' : fromToken.symbol,
          toAmount: divisionDecimals(toAmount, toToken.decimals),
          toSymbol: isMultiRouting ? toToken.symbol + '(' + toChain + ')' : toToken.symbol,
          status: true,
          hash: v.hash
        });
      });
      orderList.value = list;
    }
  }
  return {
    swapSymbol,
    orderList,
    pager,
    txType,
    selectAsset,
    selectedAsset
  };
}
