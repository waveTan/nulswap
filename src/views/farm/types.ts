// export type FarmType = 1 | 2; // uniFarm -1 / nerveFarm -2

export enum FarmType {
  UniFarm = 'UniFarm',
  NerveFarm = 'NerveFarm'
}

export interface SearchState {
  sortValue: '1' | '2';
  mortgageValue: false;
  farmStatus: 'pending' | 'end';
}

export interface NerveFarmItem {
  farmHash: string;
  name: string;
  lockedTime: number; // 允许解锁时间
  stakeTokenChainId: number; // 质押资产链id
  stakeTokenAssetId: number; // 质押资产id
  stakeTokenDecimals: number; // 质押资产小数位数
  stakeTokenSymbol: string; // 质押资产简写
  syrupTokenChainId: number; // 奖励资产链id
  syrupTokenAssetId: number; // 奖励资产id
  syrupTokenDecimals: number; // 奖励资产小数位数
  syrupTokenSymbol: string; // 奖励资产简写
  syrupTokenBalance: string; // pool中奖励资产余额
  stakeTokenBalance: number; // pool中质押资产总量
  totalSyrupAmount: number; // pool总的奖励资产
  apr: number; // 年化收益
  tatalStakeTokenUSD: number; // 质押资产总价值
  swapPairAddress: string; // lp资产时，对应的swap交易对地址
  orderNum: number;
  showDetail: boolean;
  stakeAmount: string; // 用户已参与质押数量
  stakeUSD: number; // 用户已参与质押USD
  pendingReward: string; // 用户未领取奖励数量
  pendingRewardUSD: number; // 用户未领取奖励USD
  isLocked: boolean; // 是否已解锁
  lpPairAssetAAssetId: number;
  lpPairAssetAChainId: number;
  lpPairAssetBAssetId: number;
  lpPairAssetBChainId: number;
  logo: string;
  logo2: string;
  rewardBalance: string; // pool中奖励资产余额
}

export interface UserStakeFarm {
  farmHash: string;
  syrupTokenBalance: number;
  stakeTokenBalance: number;
  apr: number;
  tatalStakeTokenUSD: number;
  stakedTokenAmount: string;
  pendingReward: string;
  pendingRewardUSD: number;
  stakedTokenAmountUSD: number;
}

export interface UniFarmItem {
  farmHash: string; // nerve farm 取hash，uni取index
  name: string;
  stakeTokenSymbol: string;
  syrupTokenSymbol: string;
  stakeTokenDecimals: number;
  lpToken: string; // 质押资产合约
  candyToken: string; // 奖励资产合约
  syrupTokenBalance: string;
  pendingReward: string;
  pendingRewardUSD: string;
  stakeAmount: string;
  stakeUSD: string;
  stakedTokenAmount: string;
  tatalStakeTokenUSD: string;
  syrupTokenDecimals: number;
  apr: string;
  lpBalance: string; // 质押资产余额
  showDetail: boolean;
}

export interface FarmList {
  nerveList: NerveFarmItem[];
  uniList: UniFarmItem[];
}

export enum LpOperate {
  Add = 'Add',
  Remove = 'Remove',
  Claim = 'Claim'
}

export enum LpDialogType {
  Add = 'Add',
  Minus = 'Minus'
}
