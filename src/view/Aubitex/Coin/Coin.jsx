import React, { Component } from 'react';
import './Coin.scss';
import Formatter from '@/utils/formatter';
import BigNumber from 'bignumber.js';
import Kline from '@/component/Kline';
import { intlShape } from 'react-intl';

class Coin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      kdata: {},
    }
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps (newprops) {
    let { markets } = newprops;
    let obj = {}
    let config = {
      type: 'kline',
      period: '60min',
      from: new Date() * 1 - 60 * 60 * 5,         // 开始时间戳
      to: new Date() * 1,             // 结束时间戳
      market: ""
    };
    for (let i = 0; i < markets.length; i++) {
      config.market = markets[i].code
      window.ws.emit('kline', config);
      window.ws.on('k_data', function (data) {
        obj[markets[i].code] = data
      });
    }
    setTimeout(() => {
      this.setState({
        kdata: obj
      })
    },200)
  }
  handleItemClick(code) {
    console.log(this.props, code)
    // let { id } = this.props.match.params;
    // if (id !== code) {
      window.location.href = "/tradingmarket/" + code + ""
    // }
  }
  render() {
    let { markets, tickers, marketPrices, intl } = this.props;
    let { kdata } = this.state;
    return (
      <ul className="coin-ul">
        {
          Array.isArray(markets) && markets.map((item, index) => {
            let ticker = tickers[item.code];
            return (
              <li key={index} onClick={this.handleItemClick.bind(this, item.code)}>
                <div className="coin">
                  <span className="high">{item.name}</span>
                  <span className={Formatter.trend(ticker.open <= ticker.last) + " marR20"}>{Formatter.priceChange(ticker.open, ticker.last) == '+NaN' ? '0.00' : Formatter.priceChange(ticker.open, ticker.last)}%</span>
                </div>
                <div className="report">
                  <span className="high">{Formatter.fixBid(ticker.last)}</span>
                  <span className="low">≈ {BigNumber(ticker.last * marketPrices[item.quote_unit]).toFixed(4, 1).toString() == 'NaN' ? "" : BigNumber(ticker.last * marketPrices[item.quote_unit]).toFixed(4, 1)} CNY</span>
                </div>
                <div className="num">24H{intl.formatMessage({id:"trading-tradeview-header-vol"})} <span className="high">{BigNumber(ticker.volume).toFixed(4, 1)}</span></div>
                <div className="kline"><Kline name={"home-ul-li" + index} show={false} widthSize={195} heightSize={150} data={kdata[item.code]}/></div>
              </li>
            )
          })
        }
      </ul>
    )
  }
}
export default Coin