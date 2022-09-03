<template>
  <div class="my-staking-info box_wrapper">
    <h3 class="title-label">
      {{ $t('staking.staking32') }}丨${{ myTotalStake }}
      <el-button class="fr" type="primary" @click="joinStakingDialog = true">
        {{ $t('staking.staking1') }}
      </el-button>
    </h3>
    <div class="info-wrap">
      <div class="infos clear">
        <p class="info-name">{{ $t('staking.staking33') }}</p>
        <p class="info-val">
          {{ $thousands(myReward) }} ≈ ${{ $thousands(myRewardUsd) }}
        </p>
      </div>
      <div class="chart-wrap">
        <PieChart :data="pieData" />
      </div>
    </div>

    <!--加入staking弹窗-->
    <JoinStake
      v-model:show="joinStakingDialog"
      :canStakingList="props.canStakingList"
      :address="address"
      @refresh="refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import PieChart from './PieChart.vue';
import JoinStake from './JoinStake.vue';
import useStoreState from '@/hooks/useStoreState';
import {
  getStakingInfo as getStakingInfoApi,
  getStakingReward
} from '@/service/api';
import { divisionAndFix, Plus, fixNumber, Times } from '@/utils/util';

import { CanStakingListItem } from '@/views/consensus/types';

interface PieData {
  name: string;
  amount: number;
  value: number;
  rate: string;
}

const props = defineProps<{
  address?: string;
  canStakingList: CanStakingListItem[];
}>();

const emit = defineEmits(['refresh']);

const { nerveAddress, nvtPrice } = useStoreState();
onMounted(() => {
  getStakingInfo();
  getRewardInfo();
  // getCanStakingList();
});

// 我的质押信息
const pieData = ref<PieData[]>([]);
const myTotalStake = ref('0');
async function getStakingInfo() {
  if (!nerveAddress.value) return;
  pieData.value = [];
  const result: any = await getStakingInfoApi(nerveAddress.value);
  if (result && result.length) {
    let totalUsd = 0;
    result.map((v: any) => {
      totalUsd += Plus(v.usdValue, totalUsd).toNumber();
      if (v.symbol === 'ETH') {
        v.amount = divisionAndFix(v.amount, v.decimal, 8);
      } else {
        v.amount = divisionAndFix(v.amount, v.decimal, 4);
      }
      pieData.value.push({
        name: v.symbol,
        amount: v.amount,
        value: v.usdValue.toFixed(2),
        rate: parseFloat((v.rate * 100).toFixed(4)) + '%'
      });
    });
    myTotalStake.value = fixNumber(totalUsd, 2);
  }
}

// 我的奖励信息
const myReward = ref('0');
const myRewardUsd = ref('0');
async function getRewardInfo() {
  const result: any = await getStakingReward(nerveAddress.value);
  if (result) {
    // const nvtInfo = assetsList.value.find(v => v.symbol === 'NVT') as AssetItem;
    myReward.value = divisionAndFix(result.totalReward, 8, 2);
    myRewardUsd.value = fixNumber(
      Times(myReward.value, nvtPrice.value).toFixed(),
      2
    );
  }
}

const joinStakingDialog = ref(false);

function refresh() {
  emit('refresh');
}
defineExpose({
  refreshList: () => {
    getStakingInfo();
    getRewardInfo();
  }
});
</script>

<style lang="scss">
.my-staking-info {
  width: 460px;
  height: 315px;
  margin-right: 40px;
  margin-bottom: 30px;
  h3 {
    padding-left: 30px;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #dfe4ef;
    .el-button {
      margin-right: 30px;
      margin-top: 9px;
    }
  }
  .info-wrap {
    margin-top: 25px;
    .infos {
      padding: 0 30px;
      display: flex;
      .info-name {
        width: auto;
        font-size: 14px;
        color: #8794b1;
      }
      .info-val {
        flex: 1;
        margin-left: 20px;
        font-size: 15px;
        font-weight: 600;
        color: #2688f7;
      }
    }
    .chart-wrap {
      padding-left: 15px;
      height: 200px;
      .legend-item {
        height: 25px;
      }
    }
  }
  @media screen and (max-width: 1300px) {
    width: 100%;
    height: 280px;
    margin-right: 0;
    h3 {
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      padding: 0 8px 0 12px;
      .el-button {
        margin-top: 3px;
        margin-right: 0;
      }
    }
    .info-wrap {
      margin-top: 12px;
      .infos {
        padding: 0 12px;
      }
    }
  }
}
</style>
