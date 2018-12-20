import React, { Component } from 'react';
import ECharts from 'echarts';

class EchartsTest extends Component {
  componentDidMount(){
    this.getData(this.props)
  }
  componentWillReceiveProps(newProps) {
    this.getData(newProps)
  }
  getData = (newProps) => {
    let { name, show, data, lineColor, fontSize, xdata } = newProps;
    var myChart = ECharts.init(document.getElementsByClassName(name)[0]);
    data&&data.length == 0 ? data = 0 : data
    // console.log(data)
    myChart.setOption({
      xAxis: {
        type: 'category',
        data: xdata && [],
        show: show,
        grid: {
          x: 10,
          x2: 10,
          y: 15,
          y2: 10,
          height: 170
        },
      },
      yAxis: {
        type: 'value',
        show: show
      },
      series: [{
        data: data || [123, 400, 100, 500, 400, 190, 800],
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#00FF71' && lineColor
            }
          }
        },
      }]
    });
  }
  render() {
    let { name, widthSize, heightSize } = this.props;
    return (
      <div className={name} style={{ width: widthSize, height: heightSize }}></div>
    );
  }
}

export default EchartsTest;