<template>
  <div class="node-detail w1200">
    <NodeInfoCpm :nodeInfo="nodeInfo" @stopNode="stopNode" :address="address" />
    <div class="record-list-wrap">
      <div class="operation-wrap">
        <el-button type="primary" @click="addition">
          {{ $t('nodeDetail.nodeDetail14') }}
        </el-button>
        <el-button @click="quit">
          {{ $t('nodeDetail.nodeDetail13') }}
        </el-button>
      </div>
      <RecordList :data="recordList" />
      <Pagination v-model:pager="pager" @change="getRecordList"></Pagination>
    </div>
    <DepositDialog
      :loading="depositLoading"
      :handleType="handleType"
      v-model:show="showDepositDialog"
      :balance="nvtBalance"
      :totalDeposit="nodeInfo.deposit"
      @submit="handleDeposit"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import NodeInfoCpm from './NodeInfo.vue';
import RecordList from './RecordList.vue';
import Pagination from '@/components/Pagination.vue';
import DepositDialog from './DepositDialog.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import useBroadcastNerveHex from '@/hooks/useBroadcastNerveHex';
import {
  divisionAndFix,
  divisionDecimals,
  Times,
  timesDecimals
} from '@/utils/util';
import {
  getAllConsensusDeposit,
  getConsensusNode,
  getReduceNonceList
} from '@/service/api';
import dayjs from 'dayjs';
import config from '@/config';
import {
  HandleType,
  NodeInfo,
  RecordItem,
  RecordTableData
} from '@/views/node/types';
import { Pager } from '@/views/swap/types';

const props = defineProps<{
  address: string;
  hash: string;
  nvtBalance: string;
}>();

const toast = useToast();
const { handleTxInfo } = useBroadcastNerveHex();
const router = useRouter();

const pager = reactive<Pager>({
  index: 1,
  size: 5,
  total: 0
});

watch(
  () => props.hash,
  val => {
    if (val) {
      getNodeInfo();
      getRecordList();
    }
  },
  {
    immediate: true
  }
);

const nodeInfo = ref<NodeInfo>({} as NodeInfo);

async function getNodeInfo() {
  const result = await getConsensusNode<NodeInfo>(props.hash);
  if (result) {
    result.deposit = divisionAndFix(result.deposit, 8, 3);
    result.reward = divisionDecimals(result.reward);
    result.interestRate = Times(result.interestRate, 100).toFixed(2);
    result.createTime = dayjs(+result.createTime * 1000).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    nodeInfo.value = result;
  }
}

const recordList = ref<RecordItem[]>([]);

async function getRecordList() {
  const result = await getAllConsensusDeposit<RecordTableData>(
    pager.index,
    pager.size,
    props.hash
  );
  if (result?.list?.length) {
    result.list.map(v => {
      v.amount = divisionDecimals(v.amount, 8);
      v.createTime = dayjs(+v.createTime * 1000).format('YYYY-MM-DD HH:mm:ss');
    });
    recordList.value = result.list;
    pager.total = result.totalCount;
  }
}

// 注销节点
async function stopNode() {
  try {
    const { address, hash } = props;
    const reduceNonceList: any = await getReduceNonceList(hash, '0', 1);
    const transferInfo = {
      from: address,
      assetsChainId: config.chainId,
      assetsId: config.assetId,
      amount: timesDecimals(nodeInfo.value.deposit, 8),
      fee: 0,
      depositHash: hash,
      nonceList: reduceNonceList
    };
    const txData = {
      address: address,
      agentHash: hash
    };
    const result: any = await handleTxInfo(transferInfo, 9, txData);
    if (result && result.hash) {
      router.push('/');
    }
  } catch (e) {
    console.log(e, 'stop-node-error');
    toast.error(e.message || e);
  }
}

const showDepositDialog = ref(false);
const handleType = ref<HandleType>(HandleType.QUIT);

// 退出保证金
function quit() {
  handleType.value = HandleType.QUIT;
  showDepositDialog.value = true;
}

// 追加保证金
function addition() {
  handleType.value = HandleType.ADDITION;
  showDepositDialog.value = true;
}

const depositLoading = ref(false);
async function handleDeposit(amount: string, type: HandleType) {
  depositLoading.value = true;
  try {
    const { address, hash } = props;
    const newAmount = timesDecimals(amount, 8);
    const transferInfo = {
      from: address,
      assetsChainId: config.chainId,
      assetsId: config.assetId,
      amount: newAmount,
      fee: 0,
      nonceList: []
    };
    let result: any;
    if (type === HandleType.ADDITION) {
      const txData = {
        address: address,
        agentHash: hash,
        amount: newAmount
      };
      result = await handleTxInfo(transferInfo, 28, txData);
    } else {
      const reduceNonceList = await getReduceNonceList<any>(hash, newAmount, 0);
      transferInfo.fee = 100000; // 退出时底层未支持减免
      transferInfo.nonceList = reduceNonceList;
      const txData = { agentHash: hash, address: address, amount: newAmount };
      result = await handleTxInfo(transferInfo, 29, txData);
    }
    if (result && result.hash) {
      showDepositDialog.value = false;
      refreshList();
    }
  } catch (e) {
    console.log(e, 'deposit-error');
    toast.error(e.message || e);
  }
  depositLoading.value = false;
}

function refreshList() {
  setTimeout(() => {
    pager.index = 1;
    pager.total = 0;
    getNodeInfo();
    getRecordList();
  }, 5000);
}
</script>

<style lang="scss">
.node-detail {
  .record-list-wrap {
    .operation-wrap {
      padding: 40px 0 10px;
      text-align: right;
      .el-button {
        min-height: 36px;
        padding: 8px 12px;
        border-radius: 6px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .record-list-wrap {
      .operation-wrap {
        padding: 30px 0 10px;
        .el-button {
          min-height: 32px;
          padding: 6px 12px;
          border-radius: 6px;
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
