<template>
  <div class="n-chart-wrap" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  withDefaults
} from 'vue';
import type { EChartsOption, EChartsType } from 'echarts';
import * as echarts from 'echarts';
import { pieConfig, lineConfig, barConfig } from './defaultConfig';
import _ from 'lodash';

type chartType = 'pie' | 'line' | 'bar';

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    type: chartType;
    options: EChartsOption;
  }>(),
  {
    width: '100%',
    height: '200px'
  }
);
const emit = defineEmits(['chartClick', 'chartMouseMove']);

const chartRef = ref<HTMLElement>();
const chartInstance = ref<EChartsType>();
onMounted(() => {
  const chartDOM = chartRef.value as HTMLElement;
  chartInstance.value = echarts.init(chartDOM, '', { renderer: 'svg' });
  chartInstance.value.setOption(chartOptions.value);
  addChartListener();
  /*if (chartInstance.value) {
    addChartListener();
  }*/
});

// chart options
const chartOptions = computed(() => {
  let defaultConfig;
  if (props.type === 'pie') {
    defaultConfig = pieConfig;
  } else if (props.type === 'line') {
    defaultConfig = lineConfig;
  } else {
    defaultConfig = barConfig;
  }
  return _.merge({}, defaultConfig, props.options);
});

function addChartListener() {
  window.addEventListener('resize', resizeHandle);
  if (props.type === 'bar' || props.type === 'line') {
    chartInstance.value?.getZr().on('mousemove', chartMouseMove);
    chartInstance.value?.getZr().on('mouseout', () => {
      emit('chartMouseMove', null);
    });
  }
  /*chartInstance.value.on('click', params => {
    emit('chartClick', params);
  });*/
}

// 鼠标在画布上移动
function chartMouseMove(params: any) {
  if (!chartOptions.value?.series[0]?.data?.length) return;
  const pointInPixel = [params.offsetX, params.offsetY];
  // console.log(chartOptions.value, 77);
  if (chartInstance.value?.containPixel('grid', pointInPixel)) {
    // 将此区域的 鼠标样式变为 指针
    chartInstance.value.getZr().setCursorStyle('initial');
  }
  // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值，借助于索引值的获取到其它的信息
  const pointInGrid = chartInstance.value?.convertFromPixel(
    { seriesIndex: 0 },
    pointInPixel
  );

  if (pointInGrid && pointInGrid.length) {
    // x轴数据的索引值
    const xIndex = pointInGrid[0];
    // const op = chartInstance.getOption();

    /*// 使用getOption() 获取图表的option
    let op = chartInstance.getOption()

    // 获取当前点击位置要的数据
    var xData = op.series[0].data[xIndex]*/

    // console.log(xIndex, pointInGrid, 778888, op);
    emit('chartMouseMove', xIndex);
  }
}

// resize handle
function resizeHandle() {
  if (props.options && chartInstance) {
    chartInstance.value?.resize();
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandle);
});

watch(
  () => chartOptions.value,
  val => {
    // console.log(val, chartInstance.value);
    val && chartInstance.value && chartInstance.value.setOption(val);
  },
  {
    immediate: true,
    deep: true
  }
);

defineExpose({
  chart: chartInstance
});
</script>

<style lang="scss"></style>
