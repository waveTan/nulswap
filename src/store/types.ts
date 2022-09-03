export interface HeterogeneousInfo {
  chainName: string;
  contractAddress: string;
  heterogeneousChainId: number;
  heterogeneousChainMultySignAddress: string;
  isToken: boolean;
}

// InjectionKey 将store安装到Vue应用程序时提供类型,将类型传递InjectionKey给useStore方法
export interface AssetItem {
  chainId: number;
  assetId: number;
  assetKey: string;
  number: string;
  locking: string;
  valuation: string;
  available: string;
  registerChainId: number;
  symbol: string;
  decimals: number;
  heterogeneousList?: HeterogeneousInfo[];
  originNetwork: string;
  canToL1: boolean;
  canToL1OnCurrent: boolean;
  listAvailable?: string;
  contractAddress?: string;
  usdPrice: string;
  source: number;
  registerContract: string;
}

export interface AccountFarm {
  type: string;
  hash: string;
  name: string;
}

export interface Account {
  address: any;
  pub: string;
  farms?: AccountFarm[];
  focusAssets?: string[];
  hideSmall?: boolean;
  txs?: TxInfo[];
  slippageTolerance?: string;
}

export interface TxInfo {
  hash: string;
  time: number;
  status: 0 | 1;
  type?: number;
  L1Chain?: string;
  L1Type?: string;
  expand?: boolean;
}

// 手动声明 state 类型
export interface State {
  addressInfo: Account;
  address: string;
  network: string;
  isWrongChain: boolean;
  showConnect: boolean;
  lang: string | null;
  assetList: AssetItem[] | [];
  nvtPrice: string;
  height: number;
  watchTokens: string[];
  watchPools: string[];
}
