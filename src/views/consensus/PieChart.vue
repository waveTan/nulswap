<template>
  <div class="staking-pie">
    <!--    <PieChart :options="chartOptions" class="chart" />-->
    <Chart type="pie" :options="chartOptions" class="chart" />
    <div class="chart-legend">
      <div
        class="legend-item scroll"
        v-for="(item, index) in data"
        :key="item.name"
      >
        <i class="legend-circle" :style="{ backgroundColor: color[index] }"></i>
        <span class="legend-symbol">{{ item.name }}</span>
        <span>{{ item.rate }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Chart from '@/components/Charts/index.vue';
import { toThousands } from '@/utils/util';

const props = defineProps<{
  data: any;
}>();

const color = ['#759bf5', '#76e9a7', '#f3a83c', '#9f95f0', '#67d1fe'];
const chartOptions = computed(() => {
  // if (!props.data) return {};
  return {
    tooltip: {
      position: 'top',
      formatter: (item: any) => {
        // console.log(item, 123)
        return `<div class="staking-chart-tooltip">
         <i style="background-color: ${color[item.dataIndex]}"></i>
         ${item.name}: ${toThousands(
          props.data[item.dataIndex].amount
        )} ≈ $${toThousands(item.value)}
      </div>`;
      }
    },
    series: [
      {
        data: props.data || []
      }
    ]
  };
});
</script>

<style lang="scss">
.staking-pie {
  height: 100%;
  display: flex;

  .chart {
    width: 40% !important;
  }

  .chart-legend {
    width: 60%;
    padding-right: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .legend-item {
      width: 100%;
      white-space: nowrap;
      overflow: auto;
    }

    .legend-circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 5px;
      margin-bottom: 1px;
      border-radius: 50%;
    }

    span {
      display: inline-block;
      color: #8794b1;
      font-size: 16px;

      &.legend-symbol {
        color: #4f5b78;
        font-size: 14px;
        // width: 70px;
        width: auto;
        margin-right: 10px;

        & + span {
          margin-right: 10px;
          /*min-width: 80px;*/
        }
      }
    }
  }

  @media screen and (max-width: 1200px) {
    .chart-legend {
      .legend-item {
      }

      .legend-circle {
        width: 8px;
        height: 8px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;

        &.legend-symbol {
          font-size: 14px;
          //width: 1.4rem;
          margin-right: 10px;

          & + span {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

.staking-chart-tooltip {
  background-color: transparent;
  //color: #fff;
  line-height: 20px;

  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 2px;
  }
}
</style>
