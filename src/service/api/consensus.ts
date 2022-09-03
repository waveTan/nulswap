import http from '@/service';

// 我的质押信息/所有质押信息(不传地址)
export async function getStakingInfo(address?: string) {
  const res = await http.rPost('getStackingInfo', address);
  return res?.result;
}

// 我的质押奖励信息
export async function getStakingReward(address: string) {
  const res = await http.rPost('getAccount', address);
  return res?.result;
}

// 获取各种币种stacking收益率
export async function getStackingRate() {
  const res = await http.rPost('getStackingRate');
  return res?.result;
}

// 获取可参与stacking资产的列表
export async function getCanStackingAssetList() {
  const res = await http.rPost('getCanStackingAssetList');
  return res?.result;
}

// 根据地址获取质押列表
export async function getStakingListByAddress(
  pageNumber: number,
  pageSize: number,
  address: string
) {
  const res = await http.rPost('pageStackingListByAddress', [
    pageNumber,
    pageSize,
    address
  ]);
  return res?.result;
}

// 根据地址获取已到期质押记录
export async function getStakingRecordByAddress(
  pageNumber: number,
  pageSize: number,
  address: string
) {
  const res = await http.rPost('pageStackRecordByAddress', [
    pageNumber,
    pageSize,
    address
  ]);
  return res?.result;
}
