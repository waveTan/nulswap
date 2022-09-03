import { computed } from 'vue';
import { useStore } from '@/store';

export default function useStoreState() {
  const store = useStore();
  // nerve地址
  const nerveAddress = computed(() => store.getters.nerveAddress);
  // 账户资产列表
  const assetsList = computed(() => store.state.assetList);
  // 账户信息
  const currentAccount = computed(() => store.state.addressInfo);
  // 当前插件网络
  const chain = computed(() => store.state.network);
  // 插件网络是否错误
  const wrongChain = computed(() => store.state.isWrongChain);
  // L1网络地址
  const currentAddress = computed(() => store.state.address);
  // nvt价格
  const nvtPrice = computed(() => store.state.nvtPrice);
  // 区块高度
  const height = computed(() => store.state.height);
  return {
    nerveAddress,
    assetsList,
    currentAccount,
    chain,
    wrongChain,
    currentAddress,
    nvtPrice,
    height
  };
}
