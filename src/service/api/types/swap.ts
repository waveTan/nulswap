export interface HotAsset {
  chainId: number;
  assetId: number;
  symbol: string;
  fromChainId: number;
  orderIndex: number;
  id: number;
}

export interface StablePairBaseInfo {
  address: string;
  feeRate: string;
  tokenLP: StablePairTokenLP;
  coins: StablePairTokenLP[];
}

interface StablePairTokenLP {
  assetChainId: number;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  heterogeneousChainId: number;
  contractAddress: string | null;
}
