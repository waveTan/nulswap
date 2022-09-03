const colors = ['#759bf5', '#76e9a7', '#f3a83c', '#9f95f0', '#67d1fe'];
const pieConfig = {
  color: colors,
  legend: {
    show: false
  },
  series: [
    {
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
  ]
};

export default pieConfig;
