import React, { Component } from 'react';
import './Coin.scss';
import Formatter from '@/utils/formatter';
import BigNumber from 'bignumber.js';
import Kline from '@/component/Kline';
import { connect } from 'react-redux';

let mapStateToProps = (state) => {
  return {
    kdata: state.klineAction.data
  }
}
@connect(mapStateToProps)
class Coin extends Component {
  handleItemClick(code) {
    console.log(this.props, code)
    // let { id } = this.props.match.params;
    // if (id !== code) {
      window.location.href = "/tradingmarket/" + code + ""
    // }
  }
  render() {
    let { markets, tickers, marketPrices, intl,kdata } = this.props;
    // console.log(marketPrices)
    return (
      <ul className="coin-ul">
        {
          Array.isArray(markets) && markets.map((item, index) => {
            let ticker = tickers[item.code];
            let data = kdata&&kdata[item.code];
            return (
              <li key={index} onClick={this.handleItemClick.bind(this, item.code)}>
                <div className="coin">
                  <span className="high">{item.name}</span>
                  <span className={Formatter.trend(ticker.open <= ticker.last) + " marR20"}>{Formatter.priceChange(ticker.open, ticker.last) == '+NaN' ? '0.00' : Formatter.priceChange(ticker.open, ticker.last)}%</span>
                </div>
                <div className="report">
                  <span className="high">{Formatter.fixBid(ticker.last)}</span>
                  <span className="low">≈ {BigNumber(ticker.last * marketPrices[item.code]).toFixed(4, 1).toString() == 'NaN' ? "" : BigNumber(ticker.last * marketPrices[item.code]).toFixed(4, 1)} CNY</span>
                </div>
                <div className="num">24H{intl.formatMessage({id:"trading-tradeview-header-vol"})} <span className="high">{BigNumber(ticker.volume).toFixed(4, 1)}</span></div>
                <div className="kline"><Kline name={"home-ul-li" + index} show={false} widthSize={195} heightSize={150} data={data}/></div>
              </li>
            )
          })
        }
      </ul>
    )
  }
}
export default Coin