import http from '@/service';
import { genId } from '@/utils/util';
import { listen } from '@/service/socket/promiseSocket';
import config from '@/config';
import { OverviewData, SummaryData, SymbolReport } from './types/home';

const url = config.WS_URL;

// 我的节点信息
export async function getOverviewData() {
  const res = await http.rPost<OverviewData>('assetGet');
  return res?.result;
}

// 获取汇总信息
export async function getSummaryData() {
  const channel = 'db_summary_info';
  const params = {
    method: channel,
    id: genId(),
    params: {}
  };
  return await listen<SummaryData>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}

// 获取链上资金总量
export async function getSymbolReport() {
  const result = await http.rPost<SymbolReport[]>('symbolReport');
  return result?.result || [];
}
