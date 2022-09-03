<template>
  <div class="overview-data-info">
    <div class="total-data">
      <div class="info-item">
        <p>{{ $t('home.home13') }}</p>
        <p>${{ $format(chainData.total) }}</p>
      </div>
      <div class="info-item">
        <p>{{ $t('home.home14') }}</p>
        <p>${{ $format(chainData.tx_24h) }}</p>
      </div>
    </div>
    <div class="trading-data">
      <div class="info-item">
        <p>{{ $t('home.home7') }}</p>
        <p>
          ${{ $format(summaryData.txAmount) }}
          <!--        $<CountUp :end-val="summaryData.txAmount" />-->
        </p>
      </div>
      <div class="info-item">
        <p>TVL</p>
        <p>
          ${{ $format(summaryData.tvl) }}
          <!--        $<CountUp :end-val="summaryData.tvl" />-->
        </p>
      </div>
      <div class="info-item">
        <p>{{ $t('home.home8') }}</p>
        <p>
          {{ summaryData.apr }}%
          <!--        <CountUp :end-val="summaryData.apr" :options="{ separator: '' }" />%-->
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getSummaryData, getSymbolReport } from '@/service/api';
import { divisionAndFix, Plus } from '@/utils/util';
// import CountUp from '@/components/CountUp.vue';

const summaryData = ref({
  txAmount: '',
  tvl: '',
  apr: ''
});
const chainData = ref({
  total: '0',
  tx_24h: '0'
});
onMounted(() => {
  getSummaryData().then(res => {
    summaryData.value = {
      txAmount: divisionAndFix(res.amountUsdtValue, 18, 2),
      tvl: divisionAndFix(res.tvl, 18, 2),
      apr: res.maxFarmApr
    };
  });

  getSymbolReport().then(res => {
    let total = '0',
      tx_24h = '0';
    res.map(v => {
      total = Plus(v.totalUsdVal, total).toFixed();
      tx_24h = Plus(
        Plus(v.convert24UsdVal, v.redeem24UsdVal),
        tx_24h
      ).toFixed();
    });
    chainData.value = {
      total,
      tx_24h
    };
  });
});
</script>

<style lang="scss">
.overview-data-info {
  background-color: #fff;
  border-radius: 15px;
  .total-data,
  .trading-data {
    display: flex;
    padding: 50px 0;
  }
  .total-data {
    border-bottom: 1px solid #f3f6fd;
    .info-item:last-of-type {
      border-right: none;
    }
  }

  .info-item {
    flex: 1;
    text-align: center;

    p {
      color: #a7b1c3;
      line-height: 1;

      &:last-of-type {
        font-size: 24px;
        padding-top: 16px;
        color: #475472;
        font-weight: 600;
      }
    }

    &:nth-child(2) {
      border-left: 1px solid #f3f6fd;
      border-right: 1px solid #f3f6fd;
    }
  }

  @media screen and (max-width: 1200px) {
    border: 1px solid #e4e9f4;
    .total-data,
    .trading-data {
      display: block;
      padding: 15px 10px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      p {
        font-size: 14px;
        &:last-of-type {
          font-size: 16px;
          padding-top: 0;
        }
      }

      &:nth-child(2) {
        border: none;
      }

      &:last-of-type {
        margin: 0;
      }
    }
  }
}
</style>
