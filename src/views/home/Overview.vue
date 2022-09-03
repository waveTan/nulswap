<template>
  <div class="overview-data">
    <div class="info-item">
      <p>{{ $t('home.home10') }}</p>
      <p>
        <CountUp :end-val="overviewData.turnoverAmount" />
        NVT
      </p>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="info-item">
      <p>{{ $t('home.home11') }}</p>
      <p>
        $<CountUp :end-val="overviewData.totalUsd" />
      </p>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="info-item">
      <p>{{ $t('home.home12') }}</p>
      <p>
        <CountUp :end-val="overviewData.totalStake" />
        NVT
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import CountUp from '@/components/CountUp.vue';
import { getOverviewData } from '@/service/api';
import { divisionDecimals, Times } from '@/utils/util';

const overviewData = ref({
  turnoverAmount: '0',
  totalUsd: '0',
  totalStake: '0'
});
onMounted(() => {
  getOverviewData().then(res => {
    if (res) {
      overviewData.value.turnoverAmount = divisionDecimals(
        res.nvtTurnoverAmount,
        8
      ).split('.')[0];
      overviewData.value.totalUsd = divisionDecimals(
        Times(res.nvtTurnoverAmount, res.nvtUsdtValue),
        8
      ).split('.')[0];
      overviewData.value.totalStake = divisionDecimals(
        res.nvtStackTotal,
        8
      ).split('.')[0];
    }
  });
});
</script>

<style lang="scss">
.overview-data {
  display: flex;
  padding-top: 25px;
  align-items: center;

  .info-item {
    width: 165px;
    text-align: center;

    p {
      color: #a7b1c3;
      font-size: 14px;
      line-height: 1;

      &:last-of-type {
        font-size: 18px;
        padding-top: 8px;
        color: #475472;
      }
    }
  }

  .el-divider {
    height: 28px;
    border-color: #afb5bf;
  }

  @media screen and (max-width: 600px) {
    padding-top: 25px;
    flex-direction: column;
    .info-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      &:last-of-type {
        margin-bottom: 0;
      }

      p {
        &:last-of-type {
          padding-top: 0;
          font-size: 16px;
        }
      }
    }
    .el-divider {
      display: none;
    }
  }
}
</style>
