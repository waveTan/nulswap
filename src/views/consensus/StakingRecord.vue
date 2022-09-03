<template>
  <div class="staking-record" v-loading="loading">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane :label="$t('staking.staking13')" name="first">
        <StakingList
          :data="stakingList"
          :staking="staking"
          @quitStaking="quitStaking"
          @batchHandle="batchHandle"
          :canStakingList="props.canStakingList"
        />
      </el-tab-pane>
    </el-tabs>
    <Pagination v-model:pager="pager" @change="changeList"></Pagination>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import StakingList from './StakingList.vue';
import Pagination from '@/components/Pagination.vue';
import { Pager } from '@/views/swap/types';
import { getStakingListByAddress } from '@/service/api';
import { divisionDecimals, Times, Plus, Minus } from '@/utils/util';
import useStoreState from '@/hooks/useStoreState';
import useBroadcastNerveHex from '@/hooks/useBroadcastNerveHex';
import { useToast } from 'vue-toastification';
import config from '@/config';
import {
  CanStakingListItem,
  StakingListItem,
  StakingInfo,
  BatchHandle
} from './types';

const props = defineProps<{
  address?: string;
  canStakingList: CanStakingListItem[];
}>();
const emit = defineEmits(['refresh']);

const toast = useToast();
const { handleTxInfo } = useBroadcastNerveHex();

const loading = ref(true);

const activeTab = ref('first');

function handleClick() {
  pager.index = 1;
  pager.total = 0;
  changeList();
}

// 质押中
const staking = ref(true);

onMounted(() => {
  getStakingList();
});

const { nerveAddress } = useStoreState();
const stakingList = ref([]);

async function getStakingList(isLoading = true) {
  loading.value = isLoading;
  try {
    const result: any = await getStakingListByAddress(
      pager.index,
      pager.size,
      nerveAddress.value
    );
    if (result) {
      const nowDate = Math.round(Number(new Date()) / 1000);
      for (let item of result.list as StakingListItem[]) {
        // item.amounts = divisionDecimals(item.amount, item.decimal);
        item.amount = divisionDecimals(item.amountStr, item.decimal);
        item.interest = Number(Times(item.interest, 100)).toFixed(2);
        item.createTime = dayjs(+item.createTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        if (item.fixedType === 'NONE') {
          item.status = 0; // 0:活期 1:定期（未到期）2：定期（已到期）
        } else {
          //console.log(item.endTime-newData);
          item.status = +item.endTime - nowDate > 0 ? 1 : 2;
        }
        item.endTime = item.endTime
          ? dayjs(+item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      }
      pager.total = result.totalCount;
      stakingList.value = result.list;
    }
  } catch (e) {
    //
  }
  loading.value = false;
}

const pager = reactive<Pager>({
  index: 1,
  size: 5,
  total: 0
});

async function changeList() {
  if (activeTab.value === 'first') {
    staking.value = true;
    await getStakingList();
  } else {
    staking.value = false;
    // await getStakingRecord();
  }
}

// 退出质押
async function quitStaking(asset: StakingListItem) {
  try {
    loading.value = true;
    const { assetChainId, assetId, amountStr, txHash } = asset;
    const transferInfo = {
      from: props.address,
      assetsChainId: assetChainId,
      assetsId: assetId,
      amount: amountStr,
      fee: 0,
      nonce: txHash.substring(txHash.length - 16) // 使用当前条目的txHash的后16位
    };
    const txData = {
      address: props.address,
      agentHash: txHash,
      deposit: amountStr,
      assetsChainId: assetChainId, //退出staking链ID
      assetsId: assetId, //退出staking资产ID
      depositType: 0, //委托类型 只能退出活期 0:代表活期
      timeType: 0 //委托时长
    };
    const result: any = await handleTxInfo(transferInfo, 6, txData);
    if (result && result.hash) {
      refreshList();
    }
  } catch (e) {
    console.log(e, 'quit-error');
    toast.error(e.message || e);
  }
  loading.value = false;
}

// 批量操作
async function batchHandle(info: any) {
  loading.value = true;
  try {
    if (info.type === BatchHandle.QUIT) {
      await batchQuit(info);
    } else {
      await batchJoin(info);
    }
  } catch (e) {
    console.log(e, 'batch-handle-error');
    toast.error(e.message || e);
  }
  loading.value = false;
}
// 批量转定期/合并
async function batchJoin(info: StakingInfo) {
  let amount = '0',
    agentHash: string[] = [],
    nonceList: string[] = [],
    amountList: string[] = [];
  const batchItems = info.items;
  batchItems.map(item => {
    agentHash.push(item.txHash);
    amountList.push(Plus(0, item.amountStr).toFixed());
    amount = Plus(amount, item.amountStr).toFixed();
    nonceList.push(item.txHash.substring(item.txHash.length - 16));
  });
  const chainId = batchItems[0].assetChainId;
  const assetId = batchItems[0].assetId;
  const depositType = info.deadLine ? 1 : 0;
  const timeType = info.deadLine ? info.deadLine - 1 : 0;
  const transferInfo = {
    from: props.address,
    assetsChainId: chainId,
    assetsId: assetId,
    amount: amount,
    amountList,
    fee: 100000,
    nonceList
  };
  let totalDeposit = amount;
  if (chainId !== config.chainId || assetId !== config.assetId) {
    //
  } else {
    // 要收取0.001个手续费
    totalDeposit = Minus(amount, transferInfo.fee).toFixed();
  }
  const txData = {
    deposit: totalDeposit,
    address: props.address,
    assetsChainId: chainId, // 链ID
    assetsId: assetId, // 资产ID
    depositType: depositType, // 委托类型
    timeType: timeType, //委 托时长
    agentHash: agentHash
  };
  const result: any = await handleTxInfo(transferInfo, 33, txData);
  if (result && result.hash) {
    refreshList();
  }
}

// 批量退出
async function batchQuit(info: StakingInfo) {
  const agentHash: string[] = [];
  const batchItems = info.items;
  batchItems.map(item => {
    agentHash.push(item.txHash);
  });
  const transferInfo = {
    from: props.address,
    fee: 100000,
    stakingList: batchItems
  };
  const txData = {
    address: props.address,
    agentHash: agentHash
  };
  const result: any = await handleTxInfo(transferInfo, 32, txData);
  if (result && result.hash) {
    refreshList();
  }
}

function refreshList() {
  emit('refresh');
}
defineExpose({
  refreshList: () => getStakingList(false)
});
</script>

<style lang="scss">
.staking-record {
  .el-tabs {
    .el-tabs__nav-wrap::after {
      width: 100%;
    }
    .el-tabs__item {
      font-size: 16px;
      font-weight: 600;
      color: #475472;
      &.is-active {
        color: #608fff;
      }
    }
  }
}
</style>
