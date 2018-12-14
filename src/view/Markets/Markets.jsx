import React, { Component } from 'react';
import './Markets.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import TradingObj from './TradingObj';
import MarketTrades from './MarketTrades';
import TradingChart from './TradingChart';
import Latest from './Latest';
import MyOrders from './MyOrders';
// import DepthChart from './DepthChart'// 深度图
import Order from './Order';
import * as service from '../../service/marketService';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    member: state.signAction.member,
    isLogin: state.signAction.isLogin
  }
}
@connect(mapStateToProps)
class Markets extends Component {
  constructor(props) {
    super(props);
    window.gon = {};
    this.state = {
      accounts: { 'bid': {}, 'ask': {} },
      asks: [],
      bids: [],
      market: { bid: { currency: 'bid', fixed: 2 }, ask: { currency: 'ask', fixed: 2 } },
      markets: [],
      member: {},
      myOrders: [],
      myTrades: [],
      ticker: {},
      tickers: {},
      trades: [],
      language: "zh" && window.localStorage.getItem('lang'),
      reckonRMB: { dftb: 0, btc: 0, eth: 0, dfc: 0 },
      dealType: 'buyTab'
    }
    gon.market = this.state.market;
  }
  componentDidMount() {
    this.init();
    this.getRMB();
  }
  getRMB = () => {
    service.getValuation()
      .then(res => {
        this.setState({
          reckonRMB: res.prices
        })
      })
  }
  init() {
    let { id } = this.props.match.params;
    if (!id) {
      this.props.history.push('/tradingmarket/btceth');
      return false;
    }
    service.init(id).then((data) => {
      gon.market = data.market;
      this.setState(data);
      this.setState({
        market: data.market
      })
    });

    window.ws.on(`market-${id}-global-trade`, (data) => {
      let { trades } = this.state;
      trades = [].concat(trades);
      trades.unshift(data);

      this.setState({
        trades: trades
      });
    });

    window.ws.on(`market-${id}-global-orderbook`, (data) => {
      this.setState({
        asks: data.asks,
        bids: data.bids
      });
    });

    if (this.props.isLogin) {
      let { member } = this.props;
      window.ws.on(`private-${member.sn}-account`, (data) => {
        let { accounts } = this.state;
        accounts = Object.assign({}, accounts);
        accounts[data.currency] = data.attrs;
        this.setState({
          accounts: accounts
        });
      });

      window.ws.on(`private-${member.sn}-order`, (data) => {
        let { myOrders } = this.state;
        let newOrders = [];
        let isNew = true;
        for (var i = 0, len = myOrders.length; i < len; i++) {
          let order = myOrders[i];
          if (order.id === data.id) {
            isNew = false;
            if (data.state === 'wait') {
              newOrders.push(data);
            }
          } else if (order.id !== data.id) {
            newOrders.push(order);
          }
        }
        if (isNew) {
          newOrders.unshift(data);
        }
        this.setState({
          myOrders: newOrders
        });
      });

      window.ws.on(`private-${member.sn}-trade`, (data) => {
        let { myTrades } = this.state;
        myTrades = [].concat(myTrades);
        myTrades.unshift(data);
        this.setState({
          myTrades: myTrades
        });
      });
    }
  }
  checkDeal(type) {
    this.setState({
      dealType: type
    })
  }
  render() {
    let { accounts, asks, bids, market, markets, member, myOrders, myTrades, ticker, tickers, trades, language, reckonRMB, dealType } = this.state;
    return (
      <div className="markets">
        <Header />
        <div className="markets-content">
          {/* <div className="markets-content-left">
            <div className="market">
              <TradingObj markets={markets} tickers={tickers} />
            </div>
            <div className="market-trades">
              <MarketTrades trades={trades} />
            </div>
          </div>
          <div className="markets-content-right">
            <div className="content-top">
              <TradingChart market={market} ticker={ticker} language={language} reckonRMB={reckonRMB} markets={markets} />
            </div>
            <div className="content-center">
              <div className={`dealTab ${dealType}`}>
                <button className="buybtn" onClick={this.checkDeal.bind(this, "buyTab")}>买</button>
                <button className="sellbtn" onClick={this.checkDeal.bind(this, "sellTab")}>卖</button>
              </div>
              <div className="buysell">
                <div className="buy">
                  <Order bid={market.bid} ask={market.ask} type='bid' accounts={accounts} reckonRMB={reckonRMB} />
                </div>
                <div className="sell">
                  <Order bid={market.bid} ask={market.ask} type='ask' accounts={accounts} reckonRMB={reckonRMB} />
                </div>
              </div>
              <Latest bids={bids} asks={asks} />
            </div>
            <div className="content-bottom">
              <MyOrders myOrders={myOrders} myTrades={myTrades} market={market} />
            </div>
          </div> */}
          <div className="markets-content-top">
            <div className="content-top-t">
              <div className="t-left">
                <TradingChart market={market} ticker={ticker} language={language} reckonRMB={reckonRMB} markets={markets} />
              </div>
              <div className="t-right">
                <TradingObj markets={markets} tickers={tickers} />
              </div>
            </div>
            <div className="content-top-b">
              <div className="b-left">
                <div className="buy">
                  <Order bid={market.bid} ask={market.ask} type='bid' accounts={accounts} reckonRMB={reckonRMB} />
                </div>
                <div className="sell">
                  <Order bid={market.bid} ask={market.ask} type='ask' accounts={accounts} reckonRMB={reckonRMB} />
                </div>
              </div>
              <div className="b-right">
                <Latest bids={bids} asks={asks} />
              </div>
            </div>
          </div>
          <div className="markets-content-bottom">
            <div className="content-bottom-l">
              <MyOrders myOrders={myOrders} myTrades={myTrades} market={market} />
            </div>
            <div className="content-bottom-r">
              <MarketTrades trades={trades} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default injectIntl(Markets)