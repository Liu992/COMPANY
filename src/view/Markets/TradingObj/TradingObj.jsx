import React, { Component } from 'react';
import './TradingObj.scss';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import Formatter from '@/utils/formatter';
import Kline from "@/component/Kline";

@withRouter
class TradingObj extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      exchangeList: null
    }
  }
  handleItemClick(code) {
    let { id } = this.props.match.params;
    if(id !== code) {
      this.props.history.push(`/tradingmarket/${code}`);
      window.location.reload();
    }
  }
  changeMarket = (e) => {
    let newarr = [];
    let {markets} = this.props;
    this.setState({
      search: e.target.value
    }, () => {
      if (!this.state.search) {
        this.setState({
          exchangeList: markets
        })
      } else {
        for (let i = 0; i < markets.length; i++) {
          if (markets[i].code.toUpperCase().indexOf(this.state.search.toUpperCase())>-1) {
            newarr.push(markets[i])
          }
        }
        this.setState({
          exchangeList: newarr
        })
      }
    })
  }
  render() {
    let {intl} = this.props;
    let {search} = this.state
    let {markets,tickers} = this.props
    if (this.state.exchangeList!==null) {
      markets = this.state.exchangeList
    }
    let code = window.location.pathname.split("/")[2]
    return (
      <div className="tradingobj">
        <ul>
          {
            Array.isArray(markets)&&markets.map((item, index) => {
              let ticker = tickers[item.code];
              return (
                <li key={index} onClick={this.handleItemClick.bind(this, item.code)}>
                  <div className="li-left">
                    <b>{item.name}</b>
                    <span><i>{Formatter.fixBid(ticker.last)}</i><i>{Formatter.priceChange(ticker.open, ticker.last)=='+NaN'?'+0.00':Formatter.priceChange(ticker.open, ticker.last)}%</i></span>
                  </div>
                  <div className="li-right"><Kline name={"li-right"+index} widthSize={"100%"} heightSize={"100%"} show={false} data={[12,43,54,12,435,121]}/></div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default injectIntl(TradingObj)