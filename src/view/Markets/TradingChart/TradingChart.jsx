import React, { PureComponent } from 'react';
import './TradingChart.scss';
import TradingChartUtil from './TradingChartUtil.js';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import Datafeeds from '@/datafeed/datafeed.js';
import Formatter from '@/utils/formatter';
import * as service from '../../../service/marketService';
import BigNumber from 'bignumber.js';

export class TVChartContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newPrice: {},
      tradeList: false
    }
    this.websocketUrl = window.location.hostname === 'localhost' ? 'http://192.168.1.63:9004' : "";
    // this.websocketUrl = window.location.hostname === 'localhost' ? 'http://192.168.1.210:8101' : "";
  }
  componentDidMount() {
    setTimeout(() => {
      this.tradingViewGetReady()
    }, 1000)
  }
  getPrice = (code) => {
    window.ws.on("k_" + code + "", (data) => {
      this.setState({
        newPrice: JSON.parse(data[1])
      })
    });
  }

  // tradeView准备
  tradingViewGetReady = () => {
    let lang = window.localStorage.getItem('lang');
    if (lang === 'zh-Hant') {
      lang = "zh_TW"
    }
    let params = {
      resolution: window.localStorage.getItem('k_line') || "5",
      Datafeeds,
      serverUrl: this.websocketUrl,
      pushInterval: 0,
      lang: lang || "zh",
      market: this.props.market
    }
    // if (!this.props.market.code) {
    //   return false;
    // }
    window.TradingView.onready((() => {
      window.tvWidget = new window.TradingView.widget(TradingChartUtil.datafeedConfig(params));
      window.tvWidget.onChartReady(() => {
        window.tvWidget.chart().executeActionById("drawingToolbarAction");
        window.tvWidget.chart().createStudy("Moving Average", false, false, [5], null, { 'Plot.color': '#965FC4' });
        window.tvWidget.chart().createStudy("Moving Average", false, false, [10], null, { 'Plot.color': '#84aad5' });
        window.tvWidget.chart().createStudy("Moving Average", false, false, [30], null, { 'Plot.color': '#55b263' });
        window.tvWidget.chart().createStudy("Moving Average", false, false, [60], null, { 'Plot.color': '#b7248a' });
        TradingChartUtil.chartReady(window.tvWidget);
      });

    })());
    this.getPrice(this.props.market.code)
  }
  handleItemClick(code) {
    window.location.href = `/tradingmarket/${code}`
  }
  changeTrade() {
    this.setState({
      tradeList: !this.state.tradeList
    })
  }
  render() {
    let { intl, market, ticker, reckonRMB, markets } = this.props;
    let { newPrice, tradeList } = this.state;
    return (
      <div className="tradingchart">
        <div className="tradingchart-header">
          <h1 className="font18" onClick={this.changeTrade.bind(this)}>{market.name}<Icon type="caret-down" theme="outlined" /></h1>
          <p className="tradingchart-header-details">
            <span>{Formatter.fixBid(newPrice.last)}</span>
            <span className="marR20">≈ {BigNumber(Formatter.fixBid(newPrice.last) * Formatter.fixBid(reckonRMB[market.quote_unit])).toFixed(4, 1)} RMB</span>
            <span>{intl.formatMessage({ id: "trading-tradeview-header-change" })}</span>
            <span className={Formatter.trend(ticker.open <= newPrice.last) + " marR20"}>{Formatter.priceChange(ticker.open * 1, newPrice.last * 1)}%</span>
            <span className="marR20">{intl.formatMessage({ id: "trading-tradeview-header-high" })} {Formatter.fixBid(newPrice.high)}</span>
            <span className="marR20">{intl.formatMessage({ id: "trading-tradeview-header-low" })} {Formatter.fixBid(newPrice.low)}</span>
            <span>24H {intl.formatMessage({ id: "trading-tradeview-header-vol" })} {BigNumber(newPrice.volume).toFixed(4, 1)=='NaN'?'0.00':BigNumber(newPrice.volume).toFixed(4, 1)}&nbsp;{market.ask.currency.toUpperCase()}</span>
          </p>
        </div>
        <div id="tv_chart_container" />
      </div>
    );
  }
}

export default injectIntl(TVChartContainer)