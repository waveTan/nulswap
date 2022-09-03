import http from '@/service';

// 我的节点信息
export async function getAccountConsensusNode<T>(address: string) {
  const res = await http.rPost<T>('getAccountConsensusNode', address);
  return res?.result;
  /*const channel = 'getAccountConsensusNode';
  const params = createRPCParams(channel);
  params.params.push(address);
  return await listen<T>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'psrpc:' + JSON.stringify(params)
    }
  });*/
}

// 节点列表、获取指定节点信息
export async function getConsensusNode<T>(hash: string) {
  const res = await http.rPost<T>('getConsensusNode', hash);
  return res?.result;
  /*const channel = 'getConsensusNode';
  const params = createRPCParams(channel);
  params.params.push(hash);
  return await listen<T>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'psrpc:' + JSON.stringify(params)
    }
  });*/
}

// 根据hash获取节点委托列表
export async function getAllConsensusDeposit<T>(
  pageNumber: number,
  pageSize: number,
  hash: string
) {
  const res = await http.rPost<T>('getAllConsensusDeposit', [
    pageNumber,
    pageSize,
    hash
  ]);
  return res?.result;
  /*const channel = 'getAllConsensusDeposit';
  const params = createRPCParams(channel);
  params.params.push(...[pageNumber, pageSize, hash]);
  return await listen<T>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'psrpc:' + JSON.stringify(params)
    }
  });*/
}

// 获取退出节点/退出保证金对应的追加保证金交易列表
export async function getReduceNonceList<T>(
  agentHash: string,
  reduceAmount: string,
  quitAll: 0 | 1
) {
  const res = await http.rPost<T>('getReduceNonceList', [
    agentHash,
    reduceAmount,
    quitAll
  ]);
  return res?.result;
  /*const channel = 'getReduceNonceList';
  const params = createRPCParams(channel);
  params.params.push(...[agentHash, reduceAmount, quitAll]);
  return await listen<T>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'psrpc:' + JSON.stringify(params)
    }
  });*/
}

// 查询创建地址是否有红牌
export async function getPunishList<T>(address: string) {
  const res = await http.rPost<T>('getPunishList', [1, 10, 2, address]);
  return res?.result;
  /*const channel = 'getPunishList';
  const params = createRPCParams(channel);
  params.params.push(...[1, 10, 2, address]);
  return await listen<T>({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'psrpc:' + JSON.stringify(params)
    }
  });*/
}
