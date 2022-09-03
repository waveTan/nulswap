export interface CanStakingListItem {
  assetChainId: number;
  assetId: number;
  symbol: string;
  nvtPrice: number;
  canBePeriodically: boolean;
  rate: any;
  assetKey: string;
}

export interface StakingRateListItem {
  canBePeriodically: boolean;
  symbol: string;
  detailList: RateInfo[];
}

interface RateInfo {
  depositType: number; // 质押类型
  timeType: number; // 质押时长
  totalAddition: number;
}

export interface StakingListItem {
  address: string;
  assetChainId: number;
  assetId: number;
  decimal: number;
  amountStr: string;
  amount: string;
  symbol: string;
  txHash: string;
  fixedType: string;
  interest: string | number;
  createTime: string | number;
  endTime: string | number;
  status: number; // 0:活期 1:定期（未到期）2：定期（已到期）
  type: number;
  checked?: boolean;
}

export enum BatchHandle {
  QUIT = 1,
  CHANGE = 2,
  MERGE = 3
}

export interface StakingInfo {
  type: BatchHandle;
  deadLine: number | null;
  items: StakingListItem[];
}
