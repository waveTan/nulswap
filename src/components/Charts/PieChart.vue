<template>
  <Chart :options="pieOptions" :style="{ width, height }"></Chart>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue';
import Chart from './index.vue';
import type { EChartsOption } from 'echarts';
import _ from 'lodash';

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    options: EChartsOption;
  }>(),
  {
    width: '100%',
    height: '200px'
  }
);

const colors = ['#759bf5', '#76e9a7', '#f3a83c', '#9f95f0', '#67d1fe'];
const defaultOptions = {
  color: colors,
  legend: {
    show: false
  },
  series: {
    type: 'pie',
    label: {
      normal: {
        show: false,
        position: 'center'
      },
      emphasis: {
        show: true,
        textStyle: {
          fontSize: '18',
          fontWeight: 'bold'
        },
        formatter: '{d}%'
      }
    },
    center: ['45%', '50%'],
    radius: ['52%', '76%'],
    minAngle: 5,
    itemStyle: {
      normal: {
        borderWidth: 3,
        borderColor: '#ffffff'
      }
    }
  }
};

const pieOptions = computed(() => {
  return _.merge({}, defaultOptions, props.options);
});
</script>

<style lang="scss"></style>
