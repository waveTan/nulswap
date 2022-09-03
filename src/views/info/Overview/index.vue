<template>
  <div class="info-overview">

    <div class="io-top">
      <div class="fl">NULSWAP info & Analytics</div>
      <div class="fr">
        <span>TVL:50215k</span>
        <span>Circulation Supply:50000</span>
        <span><label>NSWAP</label> Burned:2000</span>
      </div>
    </div>
    <div class="chart-wrap flex-between">
      <div class="liquidity-chart">
        <Chart type="line" :label="$t('info.info4')" :data="lineData"></Chart>
      </div>
      <div class="tx-chart">
        <Chart type="bar" :label="$t('info.info34')" :data="barData"></Chart>
      </div>
    </div>
    <AssetsTable
      :title="$t('info.info7')"
      :data="tokens"
      :total="tokenTotal"
      @pageChange="getAssetsList"
    />
    <PoolsTable
      :title="$t('info.info31')"
      :data="pools"
      :total="poolTotal"
      @pageChange="getPoolsList"
    />
  </div>
</template>

<script lang="ts" setup>
  import {ref, onMounted} from 'vue';
  import Chart from './Chart.vue';
  import AssetsTable from './AssetsTable.vue';
  import PoolsTable from './PoolsTable.vue';
  import useTokensAndPools from '../hooks/useTokensAndPools';
  import {get300DaysData} from '@/service/api';
  import {divisionAndFix} from '@/utils/util';
  import {ChartItem} from '../types';

  const {tokens, tokenTotal, getAssetsList, pools, poolTotal, getPoolsList} =
    useTokensAndPools();

  const lineData = ref<ChartItem[]>([]);
  const barData = ref<ChartItem[]>([]);
  onMounted(() => {
    getChartData();
    getAssetsList();
    getPoolsList();
  });

  async function getChartData() {
    const res = await get300DaysData();
    lineData.value = res.map(v => {
      return {
        label: v.period,
        value: divisionAndFix(v.reserveUsdtValue, 18, 2)
      };
    });
    barData.value = res.map(v => {
      return {
        label: v.period,
        value: divisionAndFix(v.amountUsdtValue, 18, 2)
      };
    });
  }
</script>

<style lang="scss">
  .info-overview {
    .io-top {
      background-color: #fff;
      border-bottom: 1px solid #e4e9f4;
      height: 50px;
      width: 100%;
      font-weight: bold;

      color: #475472;
      margin-bottom: 20px;
      .fl {
        font-size: 22px;
        padding-top: 15px;
      }
      .fr {
        font-size: 16px;
        padding-top: 25px;
        span{
          margin-left:20px;
        }
        label{
          color:#32e08d;
        }
      }
    }
    .chart-wrap {
      margin-bottom: 38px;
    }
    .liquidity-chart,
    .tx-chart {
      width: 580px;
      height: 380px;
      background-color: #fff;
      border: 1px solid #e4e9f4;
      border-radius: 20px;
      padding: 25px 25px 15px;
    }
    @media screen and (max-width: 1200px) {
      .chart-wrap {
        display: block;
        //margin-bottom: 0;
      }
      .liquidity-chart,
      .tx-chart {
        width: 100%;
        padding: 15px;
      }
      .liquidity-chart {
        margin-bottom: 15px;
      }
    }
  }
</style>
