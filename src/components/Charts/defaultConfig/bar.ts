const color = '#2688f7';
const barConfig = {
  color,
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  grid: {
    left: '10',
    right: '0',
    bottom: '5',
    top: '10',
    containLabel: true
  },
  series: [
    {
      type: 'bar'
    }
  ]
};

export default barConfig;
