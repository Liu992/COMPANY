import React, { PureComponent } from 'react';
import './MarketTrades.scss';
import * as service from '@/service/marketService';
import { injectIntl } from 'react-intl';
import Formatter from '@/utils/formatter';
import Item from 'antd/lib/list/Item';

class MarketTrades extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      defaultActive: ''
    }
  }

  componentDidMount() {
  }

  checkActive (id) {
    this.setState({
      defaultActive: id
    });
  }

  render() {
    let { intl, trades } = this.props;
    const { defaultActive } = this.state;
    return (
      <div className="markettrades">
        <div className="markettrades-header">
          <h1 className="font16">{intl.formatMessage({id: "trading-market-trades-title"})}</h1>
        </div>
        <div className="markettrades-table">
          <table>
            <thead>
              <tr>
                <th>{intl.formatMessage({id: "trading-market-trades-table-th1"})}</th>
                <th>{intl.formatMessage({id: "trading-market-trades-table-th2"})}</th>
                <th>{intl.formatMessage({id: "trading-market-trades-table-th3"})}</th>
              </tr>
            </thead>
            <tbody>
              {
                Array.isArray(trades)&&trades.map((trade, id) => {
                  return (
                    <tr key={id} className={id === defaultActive ? 'trhover' : ''} onClick={this.checkActive.bind(this, id)}>
                      <td>{trade.date.substring(11)}</td>
                      <td>{Formatter.fixBid(trade.price)}</td>
                      <td className="main-green">{Formatter.fixAsk(trade.volume)}</td>
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

export default injectIntl(MarketTrades)