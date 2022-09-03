<template>
  <div class="consensus-page">
    <div class="w1200">
      <div class="staking-info">
        <MyStaking
          ref="myStaking"
          :canStakingList="canStakingList"
          :address="nerveAddress"
          @refresh="refresh"
        />
        <StakingRate ref="stakingRate" />
      </div>
      <StakingRecord
        :canStakingList="canStakingList"
        :address="nerveAddress"
        ref="recordList"
        @refresh="refresh"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import MyStaking from './MyStaking.vue';
import StakingRate from './StakingRate.vue';
import StakingRecord from './StakingRecord.vue';
import { getCanStackingAssetList } from '@/service/api';
import useStoreState from '@/hooks/useStoreState';
import { CanStakingListItem } from '@/views/consensus/types';

const { nerveAddress } = useStoreState();

onMounted(() => {
  getCanStakingList();
});
const canStakingList = ref<CanStakingListItem[]>([]);
async function getCanStakingList() {
  const result: any = await getCanStackingAssetList();
  if (result && result.length) {
    result.map((v: any) => {
      v.assetKey = v.assetChainId + '-' + v.assetId;
    });
    canStakingList.value = result as CanStakingListItem[];
  }
}

const myStaking = ref<InstanceType<typeof MyStaking>>();
const stakingRate = ref<InstanceType<typeof StakingRate>>();
const recordList = ref<InstanceType<typeof StakingRecord>>();
/*function setRecordListRef(el: InstanceType<typeof StakingRecord>) {
  recordList.value.push(el);
}*/

function refresh() {
  // console.log(myStaking.value, 'myStaking')
  // console.log(stakingRate.value, 'stakingRate')
  // console.log(recordList.value, 'recordList')
  setTimeout(() => {
    myStaking.value.refreshList();
    stakingRate.value.refreshList();
    recordList.value.refreshList();
  }, 5000);
}
</script>

<style lang="scss">
.consensus-page {
  .staking-info {
    display: flex;
    flex-wrap: wrap;
  }
  .el-button {
    padding: 7px 12px;
    min-height: auto;
    border-radius: 6px;
    span {
      font-size: 14px;
    }
  }
}
</style>
