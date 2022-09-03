import {
  divisionAndFix,
  Plus,
  Times,
  checkCanToL1,
  genId,
  isBeta,
  checkCanToL1OnCurrent
} from '@/utils/util';
import { listen } from '@/service/socket/promiseSocket';
import config from '@/config';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import http from '@/service';
import { HeterogeneousInfo } from '@/store/types';

const url = config.WS_URL;

//广播hex
export async function broadcastHex(txHex: string) {
  const res = await http.rPost('broadcastTx', txHex);
  return res.result || res;
}

// 获取区块信息
export async function getBlockInfo() {
  const res = await http.rPost('getNodeInfo');
  return res?.result || null;
}

/**
 * @desc 通过symbol获取资产价格
 * @param symbol 资产symbol
 */
export async function uniAssetPrice(symbol: string) {
  const channel = 'uniAssetPrice';
  const params = {
    method: channel,
    id: genId(),
    params: {
      symbol
    }
  };
  return await listen({
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
 * @desc 查询资产价格
 * @param chainId 资产chainId
 * @param assetId 资产assetId
 * @param isForCalFee 是否是提现手续费资产
 */
export async function getAssetPrice(
  chainId: number,
  assetId: number,
  isForCalFee?: boolean
) {
  const params = isForCalFee ? [chainId, assetId, 'FEE'] : [chainId, assetId];
  const res = await http.rPost('getBestSymbolPrice', params);
  return res?.result || null;
}

/**
 * @desc 查询NVT价格, getBestSymbolPrice会在基础上扣除20%
 * @param chainId 资产chainId
 * @param assetId 资产assetId
 */
export async function getNVTPrice(chainId: number, assetId: number) {
  const res = await http.rPost('getSymbolInfo', [chainId, assetId]);
  return res?.result || null;
}

/**
 * @desc 查询账户资产详情
 * @param chainId 资产chainId
 * @param assetId 资产assetId
 * @param address 账户nerve地址
 */
export async function getAssetBalance(
  chainId: number,
  assetId: number,
  address: string
) {
  const res = await http.rPost('getAccountBalance', [
    chainId,
    assetId,
    address
  ]);
  return res?.result || null;
}

/**
 * @desc 获取账户资产列表
 * @param address 账户nerve地址
 */
export async function getAssetList(address = config.destroyAddress) {
  const result = await http.rPost('getAccountLedgerList', address);
  let res = result?.result;
  if (!res) return [];
  // 主网隐藏tron相关内容
  if (!isBeta) {
    // 过滤tron资产
    /*res = res.filter((asset: any) => {
      // return asset.assetKey !== '9-218' && asset.assetKey !== '9-219' && asset.registerChainId !== 108
      return asset.assetKey !== '9-219';
    });*/

    // 禁止SNEGY, MC2, XTMC跨链
    res.map((asset: any) => {
      const assetKey = asset.assetKey;
      if (
        assetKey === '9-76' ||
        assetKey === '9-211' ||
        assetKey === '9-240' ||
        assetKey === '9-302'
      ) {
        asset.source = 1;
      }
    });
  }
  res.map((item: any) => {
    const decimal = item.decimals;
    item.number = divisionAndFix(item.totalBalanceStr, decimal, decimal);
    item.locking = divisionAndFix(
      Plus(item.timeLock, item.consensusLockStr).toString(),
      decimal
    );
    // item.available = divisionAndFix(item.balanceStr, decimal, decimal);
    item.valuation = Times(item.number || 0, item.usdPrice).toFixed(2);
    item.available = divisionAndFix(item.balanceStr, decimal, decimal);
    item.listAvailable = divisionAndFix(item.balanceStr, decimal, 6);
    item.originNetwork = Object.values(_networkInfo).find(
      v => v.chainId === item.registerChainId
    )?.name;
    item.canToL1 = checkCanToL1(item);
    item.canToL1OnCurrent = checkCanToL1OnCurrent(item);
    item.registerContract = getContractAddress(item.heterogeneousList, item.registerChainId);
  });
  // 返回按字母排序
  const sortDataBySymbol = [...res]
    .sort((a, b) => (a.symbol.toUpperCase() < b.symbol.toUpperCase() ? 1 : -1))
    .sort((a, b) => (Number(a.available) < Number(b.available) ? 1 : -1));
  // .sort((a, b) => (a.valuation < b.valuation ? 1 : -1));
  const mainSymbol = sortDataBySymbol.find(item => item.symbol === 'NVT');
  const mainSymbolIndex = sortDataBySymbol.findIndex(
    item => item.symbol === 'NVT'
  );
  sortDataBySymbol.splice(mainSymbolIndex, 1);
  sortDataBySymbol.unshift(mainSymbol);
  return sortDataBySymbol;
}

function getContractAddress(
  heterogeneousList: HeterogeneousInfo[],
  registerChainId: number
): string {
  if (!heterogeneousList || !heterogeneousList.length) {
    return '';
  }
  const info = heterogeneousList.find(
    v => v.heterogeneousChainId === registerChainId
  );
  return info ? info.contractAddress : '';
}

export async function getTx(hash: string) {
  const res = await http.rPost('getTx', hash);
  return res?.result || null;
}

export async function getTronTx(hash: string) {
  const origin = config.isBeta ? 'https://shastapi.tronscan.org' : 'https://apilist.tronscan.org';
  const baseUrl = origin.split('/#')[0];
  const res = await http.get({
    url: baseUrl + '/api/transaction-info?hash=' + hash
  });
  if (res && res.confirmed === true) {
    return {
      status: 1,
      ...res
    };
  }
  return {
    status: 0,
    ...res
  };
}
