<template>
  <div class="staking-rate box_wrapper">
    <h3 class="title-label">
      {{ $t('staking.staking3') }}
      <span class="fr">
        {{ $t('staking.staking0') }}:
        <span class="click" @click="openExplorerUrl">
          ${{ $thousands(totalRewardUSD) }}
        </span>
      </span>
    </h3>
    <div class="rate-table">
      <el-table
        :data="stakingRate"
        stripe
        v-loading="loading"
        height="220px"
        class="staking_rate_table"
      >
        <el-table-column
          fixed
          width="135"
          :label="$t('staking.staking4')"
          align="center"
          prop="symbol"
        ></el-table-column>
        <el-table-column
          width="90"
          :label="$t('staking.staking5')"
          align="center"
          prop="rate1"
        ></el-table-column>
        <el-table-column
          width="90"
          :label="$t('staking.staking6')"
          align="center"
          prop="rate2"
        ></el-table-column>
        <el-table-column
          width="95"
          :label="$t('staking.staking7')"
          align="center"
          prop="rate3"
        ></el-table-column>
        <el-table-column
          width="95"
          :label="$t('staking.staking8')"
          align="center"
          prop="rate4"
        ></el-table-column>
        <el-table-column
          width="95"
          :label="$t('staking.staking9')"
          align="center"
          prop="rate5"
        ></el-table-column>
        <el-table-column
          width="95"
          :label="$t('staking.staking10')"
          align="center"
          prop="rate6"
        ></el-table-column>
        <el-table-column
          width="95"
          :label="$t('staking.staking11')"
          align="center"
          prop="rate7"
        ></el-table-column>
        <el-table-column
          width="100"
          :label="$t('staking.staking12')"
          align="center"
          prop="rate8"
        ></el-table-column>
      </el-table>
      <el-table
        :data="stakingRate"
        stripe
        v-loading="loading"
        height="220px"
        class="staking_rate_table_mobile"
      >
        <el-table-column
          min-width="85"
          :label="$t('staking.staking4')"
          align="center"
          prop="symbol"
        ></el-table-column>
        <el-table-column
          min-width="90"
          :label="$t('staking.staking5')"
          align="center"
          prop="rate1"
        ></el-table-column>
        <el-table-column
          min-width="90"
          :label="$t('staking.staking6')"
          align="center"
          prop="rate2"
        ></el-table-column>
        <el-table-column
          min-width="95"
          :label="$t('staking.staking7')"
          align="center"
          prop="rate3"
        ></el-table-column>
        <el-table-column
          min-width="95"
          :label="$t('staking.staking8')"
          align="center"
          prop="rate4"
        ></el-table-column>
        <el-table-column
          min-width="95"
          :label="$t('staking.staking9')"
          align="center"
          prop="rate5"
        ></el-table-column>
        <el-table-column
          min-width="95"
          :label="$t('staking.staking10')"
          align="center"
          prop="rate6"
        ></el-table-column>
        <el-table-column
          min-width="95"
          :label="$t('staking.staking11')"
          align="center"
          prop="rate7"
        ></el-table-column>
        <el-table-column
          min-width="100"
          :label="$t('staking.staking12')"
          align="center"
          prop="rate8"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  getStakingInfo as getStakingInfoApi,
  getStackingRate
} from '@/service/api';
import { fixNumber, Plus, Times } from '@/utils/util';
import config from '@/config';
import { StakingRateListItem } from './types';

const loading = ref(true);
onMounted(() => {
  getTotalStakingInfo();
  getStakingRate();
});

const totalRewardUSD = ref('0');

async function getTotalStakingInfo() {
  const result: any = await getStakingInfoApi();
  if (result && result.length) {
    let totalUsd = '0';
    result.map((v: any) => {
      totalUsd = Plus(v.usdValue, totalUsd).toFixed();
    });
    totalRewardUSD.value = fixNumber(totalUsd, 2);
  }
}

// 年化利率表
const stakingRate = ref<StakingRateListItem[]>([]);
//获取各种币种stacking收益率
async function getStakingRate() {
  const result: any = await getStackingRate();
  if (result && result.length) {
    const res: StakingRateListItem[] = [];
    result.map((v: StakingRateListItem) => {
      const obj = {} as StakingRateListItem;
      obj.symbol = v.symbol;
      v.detailList
        .filter(v => v.timeType !== 7)
        .forEach((item, index) => {
          obj['rate' + (index + 1)] =
            Number(Times(item.totalAddition, 100)).toFixed(2) + '%';
        });
      res.push(obj);
    });
    stakingRate.value = res;
    loading.value = false;
  }
}

function openExplorerUrl() {
  window.open(config.explorerUrl);
}
defineExpose({
  refreshList: getStakingRate
});
</script>

<style lang="scss">
.staking-rate {
  width: 700px;
  height: 315px;

  h3 {
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #dfe4ef;
    padding: 0 30px;
    margin-bottom: 20px;
    span {
      font-size: 14px;

      span {
        color: #2688f7;
      }
    }
  }
  .rate-table {
    padding: 0 30px;
    .el-table {
      border: none !important;
    }
  }

  .staking_rate_table {
    .el-table__fixed {
      .el-table__fixed-body-wrapper {
        .el-table__body {
          .el-table__row {
            td {
              padding: 11px 0 !important;
              font-size: 12px;
            }
          }
        }
      }
    }

    .el-table__body-wrapper {
      .el-table__row {
        td {
          font-size: 12px;
          padding: 11px 0 !important;
        }
      }
    }
  }

  .staking_rate_table_mobile {
    display: none;
  }
}

@media screen and (max-width: 1300px) {
  .staking-rate {
    //height: auto;
    width: 100%;
    margin-bottom: 20px;

    h3 {
      padding: 0 12px;
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      span {
        font-size: 14px;
      }
    }
    .rate-table {
      padding: 0 12px;
    }
    .staking_rate_table {
      display: none;
    }

    .staking_rate_table_mobile {
      display: block;
      .el-table__body-wrapper {
        overflow-x: auto;
      }
    }
  }
}
</style>
