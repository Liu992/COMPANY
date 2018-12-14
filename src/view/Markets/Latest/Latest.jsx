import React, { Component } from 'react';
import './Latest.scss';
import { connect } from 'react-redux';
import dealAction from '@/store/action/dealAction.js';
import { injectIntl } from 'react-intl';
import Formatter from '@/utils/formatter';

@connect()
class Latest extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  changeBuySell (price) {
    this.props.dispatch(dealAction(price))
  }

  render() {
    let { intl, bids, asks } = this.props;
    bids = bids.slice(0,5)
    asks = asks.slice(-5)
    return (
      <div className="latest">
        <div className="latest-header">
          <h1 className="font16">{intl.formatMessage({ id: "trading-latest-title" })}</h1>
        </div>
        <div className="latest-table">
          <table>
            <thead>
              <tr>
                <th>{intl.formatMessage({ id: "trading-latest-table-th1" })}</th>
                <th>{intl.formatMessage({ id: "trading-latest-table-th2" })}</th>
                <th>{intl.formatMessage({ id: "trading-latest-table-th3" })}</th>
              </tr>
            </thead>
            <tbody style={{borderBottom: '1px solid rgba(0,0,0,0.3)'}}>
              {
                Array.isArray(asks)&&asks.map((ask, id) => {
                  return (
                    <tr key={id} onClick={this.changeBuySell.bind(this, ask[0])}>
                      <td className="mainred">{ Formatter.fixBid(ask[0]) }</td>
                      <td>{ Formatter.fixAsk(ask[1]) }</td>
                      <td>{ Formatter.amount(ask[0], ask[1]) }</td>
                    </tr>
                  )
                })
              }
            </tbody>
            <tbody style={{backgroundColor:"rgba(34, 119, 204, 0.04)"}}>
              {
                Array.isArray(bids)&&bids.map((bid, id) => {
                  return (
                    <tr key={id} onClick={this.changeBuySell.bind(this, bid[0])}>
                      <td className="main-green">{ Formatter.fixBid(bid[0]) }</td>
                      <td>{ Formatter.fixAsk(bid[1]) }</td>
                      <td>{ Formatter.amount(bid[0], bid[1]) }</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default injectIntl(Latest)