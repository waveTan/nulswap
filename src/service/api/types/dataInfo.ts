export interface ListRes<T> {
  pageNumber: number;
  pageSize: number;
  total: number;
  list: T[];
}

export interface ChartItem {
  amountUsdtValue: string;
  period: number;
  price: string;
  reserveUsdtValue: string;
}

export interface TokenListParam {
  pageIndex?: number;
  pageSize?: number;
  orderby?: string;
  sorting?: 'asc' | 'desc';
}

export interface TokenItem {
  assetChainId: number;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  amountUsdtValue24H: string;
  amountUsdtValue7D: string;
  reserveUsdtValue: string;
  price: string;
  priceChange: string;
  transactionCount24H: string;
  sourceChainid: number;
}

export interface PairListParam extends TokenListParam {
  tokenKey?: string;
}

export interface PoolItem {
  address: string;
  token0: string;
  token0Decimals: number;
  token0Symbol: string;
  token1: string;
  token1Decimals: number;
  token1Symbol: string;
  tokenLP: string;
  tokenLPDecimals: number;
  tokenLPSymbol: string;
  amountUsdtValue24H: string;
  amountUsdtValue7D: string;
  reserveUsdtValue: string;
  feeUsdtValue: string;
  feeUsdtValueARP: number;
  reserve0: string;
  reserve1: string;
  decimals: number;
}

export enum TxType {
  ALL = 'ALL',
  SWAP = 'SWAP',
  ADDLP = 'ADDLP',
  REOMVELP = 'REOMVELP'
}

export interface TxParam extends TokenListParam {
  tokenKey?: string;
  address?: string;
  operation?: TxType;
}

export interface TxRes {
  amount0: string;
  amount1: string;
  blockHeight: number;
  blockTime: number;
  hash: string;
  id: string;
  lpAmount: string;
  pairAddress: string;
  receiveAddress: string;
  token0: string;
  token1: string;
  tokenIn: string;
  tokenOut: string;
  token0Price: string;
  type: string;
  userAddress: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Symbol: string;
  token1Symbol: string;
}

export interface SearchRes {
  token: TokenItem[];
  pool: PoolItem[];
}

export interface MultiPairItem {
  amountUsdtValue7D: string;
  amountUsdtValue24H: string;
  lpTokenAssetId: number;
  lpTokenChainId: number;
  lpTokenDecimal: number;
  lpTokenSymbol: string;
  name: string;
  pairAddress: string;
  price: string;
  reserveUsdtValue: string;
  tokenList: SupportChain[];
  logo: string;
}

interface SupportChain {
  assetChainId: number;
  assetId: number;
  decimals: number;
  image: string;
  name: string;
  ratio: number;
  reserveUsdtValue: string;
  sourceChainId: number;
  symbol: string;
  contractAddress: string;
}

export interface MultiPairTxParam extends TokenListParam {
  address: string;
  operation?: TxType;
}

export interface MultiPairTxRes {
  amountIn: string;
  amountOut: string;
  blockHeight: number;
  blockTime: number;
  hash: string;
  id: string;
  lpAmount: string;
  pairAddress: string;
  receiveAddress: string;
  tokenIn: string;
  tokenInDecimals: number;
  tokenInImageUrl: string;
  tokenInSymbol: string;
  tokenInSourceChainId: number;
  tokenOut: string;
  tokenOutDecaimals: number;
  tokenOutImageUrl: string;
  tokenOutSymbol: string;
  tokenOutSourceChainId: number;
  tokenPrice: string;
  type: string;
  userAddress: string;
  userTradePairAddress: string;
  userTradePairTokenIn: string;
  userTradePairTokenOut: string;
}
