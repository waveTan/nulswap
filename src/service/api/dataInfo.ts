import { listen } from '@/service/socket/promiseSocket';
import config from '@/config';
import { genId } from '@/utils/util';
import {
  ChartItem,
  ListRes, MultiPairItem, MultiPairTxParam, MultiPairTxRes,
  PairListParam,
  PoolItem,
  SearchRes,
  TokenItem,
  TokenListParam,
  TxParam,
  TxRes,
  TxType
} from './types/dataInfo';

const url = config.WS_URL;

/**
 * @desc 资产收藏列表信息
 * @params [assetKey]
 */

export async function getFocusAssetsInfo(data: string[]) {
  const keys = data.join();
  const channel = 'db_fav_tokens';
  const params = {
    method: channel,
    id: genId(),
    params: { array: keys }
  };
  return await listen<TokenItem[]>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 获取100天内某个资产的交易量、流动性、价格
 * @params tokenKey
 */

export async function getTokenAnalytics(tokenKey: string) {
  const channel = 'db_token_analytics';
  const params = {
    method: channel,
    id: genId(),
    params: { tokenKey }
  };
  return await listen<ChartItem[]>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 获取300天内的总流动量数据和24小时交易量数据，支持pool过滤
 * @params tokenKey
 */
export async function get300DaysData(address?: string) {
  const channel = 'db_analytics';
  const params = {
    method: channel,
    id: genId(),
    params: { address }
  };
  return await listen<ChartItem[]>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 资产排名列表
 * @params
 */
export async function getTokenList(data?: TokenListParam) {
  const pageIndex = data?.pageIndex || 1;
  const pageSize = data?.pageSize || 10;
  const orderby = data?.orderby || 'reserveUsdtValue';
  const sorting = data?.sorting || 'desc';
  const channel = 'db_tokens';
  const params = {
    method: channel,
    id: genId(),
    params: { pageIndex, pageSize, orderby, sorting }
  };
  return await listen<ListRes<TokenItem>>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 交易对排名列表，支持根据token-key查询
 * @params
 */
export async function getPairList(data?: PairListParam) {
  const pageIndex = data?.pageIndex || 1;
  const pageSize = data?.pageSize || 10;
  const orderby = data?.orderby || 'reserveUsdtValue';
  const sorting = data?.sorting || 'desc';
  const tokenKey = data?.tokenKey || '';
  const channel = 'db_pools';
  const params = {
    method: channel,
    id: genId(),
    params: { pageIndex, pageSize, orderby, sorting, tokenKey }
  };
  return await listen<ListRes<PoolItem>>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 交易对收藏列表信息
 * @params [pairAddress]
 */

export async function getFocusPairsInfo(data: string[]) {
  const keys = data.join();
  const channel = 'db_fav_pools';
  const params = {
    method: channel,
    id: genId(),
    params: { array: keys }
  };
  return await listen<PoolItem[]>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 资产详情
 * @params tokenKey
 */

export async function getTokenInfo(tokenKey: string) {
  const channel = 'db_token';
  const params = {
    method: channel,
    id: genId(),
    params: { tokenKey }
  };
  return await listen<TokenItem>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 交易对详情
 * @params pairAddress
 */

export async function getPoolInfo(address: string) {
  const channel = 'db_pool';
  const params = {
    method: channel,
    id: genId(),
    params: { address }
  };
  return await listen<PoolItem>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 交易列表：支持过滤条件pool、token、operation
 * @params pairAddress
 */
export async function getTxs(data: TxParam) {
  const pageIndex = data.pageIndex || 1;
  const pageSize = data.pageSize || 10;
  const channel = 'db_transactions';
  if (data.operation === TxType.ALL) delete data.operation;
  const params = {
    method: channel,
    id: genId(),
    params: { ...data, pageIndex, pageSize }
  };
  return await listen<ListRes<TxRes>>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 搜索token或者pool
 * @params text
 */
export async function searchText(text: string) {
  const channel = 'db_search';
  const params = {
    method: channel,
    id: genId(),
    params: { text }
  };
  return await listen<SearchRes>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 多链资金池列表
 */
export async function getMultiPairs(data?: TokenListParam) {
  const pageIndex = data?.pageIndex || 1;
  const pageSize = data?.pageSize || 10;
  const orderby = data?.orderby || 'reserveUsdtValue';
  const sorting = data?.sorting || 'desc';
  const channel = 'db_stable_pairs';
  const params = {
    method: channel,
    id: genId(),
    params: { pageIndex, pageSize, orderby, sorting }
  };
  return await listen<ListRes<MultiPairItem>>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 多链资金详情
 */
export async function getMultiPair(address: string) {
  const channel = 'db_stable_pair';
  const params = {
    method: channel,
    id: genId(),
    params: { address }
  };
  return await listen<MultiPairItem>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 多链资金详情曲线图数据
 * @param address pairAddress
 * @param tokenKey 网络
 */
export async function getMultiPairChartData(
  address: string,
  tokenKey?: string
) {
  const channel = 'db_stable_pair_analytics';
  const params = {
    method: channel,
    id: genId(),
    params: { address, tokenKey }
  };
  return await listen<ChartItem[]>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

/**
 * @desc 交易列表：支持过滤条件pool、token、operation
 * @params pairAddress
 */
export async function getMultiPairTxs(data: MultiPairTxParam) {
  const pageIndex = data.pageIndex || 1;
  const pageSize = data.pageSize || 10;
  const channel = 'db_stable_transactions';
  if (data.operation === TxType.ALL) delete data.operation;
  const params = {
    method: channel,
    id: genId(),
    params: { ...data, pageIndex, pageSize }
  };
  return await listen<ListRes<MultiPairTxRes>>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}
