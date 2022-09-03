import { ref, onMounted } from 'vue';
import { Minus, divisionDecimals, isBeta } from '@/utils/util';
// import config from '@/config';
import {
  getStablePairListForSwapTrade,
  getStableSwapPairInfo,
  // getStablePairBaseInfoList,
  getNerveFeeAddress as getNerveFeeAddressApi
} from '@/service/api';

// const NVT_KEY = config.chainId + '-' + config.assetId;

const USDTN_kEY = isBeta ? '5-102' : '9-220';

// 稳定币换稳定币、稳定币换非稳定币、稳定币/稳定币N互换
export default function useSpecialSwap() {
  const isStableCoinForStableCoin = ref(false); // 稳定币换稳定币
  const isStableCoinForOthers = ref(false); // 是否是稳定币换其他资产
  const isStableCoinSwap = ref(false); // 稳定币、稳定币N互换
  const stableCoins = ref({}); // {稳定币: 稳定币+'N'}
  const stablePairList = ref([]);
  // const stableSwapFeeList = ref<any>(); // 稳定币换稳定币收取手续费信息
  const staleSwapFeeAddress = ref(''); // 稳定币换稳定币手续费地址
  const getStablePairList = async () => {
    const res = await getStablePairListForSwapTrade();
    if (res) {
      stablePairList.value = res;
      res.map((v: any) => {
        Object.keys(v.groupCoin).map((coin: any) => {
          stableCoins.value[coin] = v.lpToken;
        });
      });
    }
  };
  async function getNerveFeeAddress() {
    const res = await getNerveFeeAddressApi();
    if (res) {
      staleSwapFeeAddress.value = res.nerveFeeAddress;
    }
  }

  onMounted(() => {
    getStablePairList();
    getNerveFeeAddress();
  });

  // 判断是否是稳定币换稳定币
  function checkIsStableCoinForStableCoin(
    token1Key?: string,
    token2Key?: string
  ) {
    if (!token1Key || !token2Key) {
      isStableCoinForStableCoin.value = false;
    } else {
      isStableCoinForStableCoin.value =
        !!stableCoins.value[token1Key] && stableCoins.value[token2Key];
    }
    return isStableCoinForStableCoin.value;
  }

  // 判读是否是稳定币换其他资产, 只支持USDT - USDTN - symbol，其他的稳定币暂不支持
  function checkIsStableCoinForOthers(token1Key?: string, token2Key?: string) {
    if (!token1Key || !token2Key) {
      isStableCoinForOthers.value = false;
    } else if (checkIsStableCoinForStableCoin(token1Key, token2Key)) {
      isStableCoinForOthers.value = false;
    } else {
      const lpToken = stableCoins.value[token1Key];
      isStableCoinForOthers.value =
        lpToken && lpToken !== token2Key && lpToken === USDTN_kEY;
    }
  }

  // 判断是否是稳定币、稳定币N互换
  function checkIsStableCoinSwap(fromKey?: string, toKey?: string) {
    if (!fromKey || !toKey) {
      isStableCoinSwap.value = false;
    } else {
      isStableCoinSwap.value =
        stableCoins.value[fromKey] === toKey ||
        stableCoins.value[toKey] === fromKey;
    }
  }

  async function getReceiveOrderIndex(
    pairAddress: string,
    assetKey: string,
    amount: string
  ) {
    const { index, info } = await getStableCoinInfoAndIndex(
      assetKey,
      pairAddress
    );
    if (index !== -1) {
      const balance = divisionDecimals(
        info.balances[index],
        info.coins[index].decimals
      );
      if (Minus(amount, balance).toNumber() > 0) {
        throw 'Insufficient pool balance';
      }
      const arr = new Array(info.coins.length).fill(1).map((v, i) => i);
      return arr.splice(index, 1).concat(arr);
    }
    return [];
  }
  // 获取某个稳定池子的信息和某个稳定币在该稳定币池子中的index
  async function getStableCoinInfoAndIndex(
    assetKey: string,
    pairAddress: string
  ) {
    const info = await getStableSwapPairInfo(pairAddress);
    let index = -1;
    if (info) {
      index = info.coins.findIndex(
        (v: any) => v.assetChainId + '-' + v.assetId === assetKey
      );
    }
    return { info, index };
  }

  return {
    isStableCoinForStableCoin,
    isStableCoinForOthers,
    isStableCoinSwap,
    stableCoins,
    stablePairList,
    // stableSwapFeeList,
    staleSwapFeeAddress,
    checkIsStableCoinForStableCoin,
    checkIsStableCoinForOthers,
    checkIsStableCoinSwap,
    getReceiveOrderIndex,
    getStableCoinInfoAndIndex
  };
}
