export interface NodeInfo {
  deposit: string;
  totalDeposit: string;
  totalReward: string;
  agentId: string;
  agentAddress: string;
  rewardAddress: string;
  packingAddress: string;
  status: number;
  reward: string;
  interestRate: string;
  creditValue: string;
  txHash: string;
  yellowCardCount: number;
  agentAlias: string;
  bankNode: boolean;
  createTime: string;
}

export interface RecordTableData {
  pageNumber: number;
  totalCount: number;
  list: RecordItem[];
}

export interface RecordItem {
  address: string;
  agentHash: string;
  amount: string;
  decimal: number;
  blockHeight: number;
  createTime: string;
  txHash: string;
  type: number;
}

export enum HandleType {
  ADDITION = 1,
  QUIT = 2
}
