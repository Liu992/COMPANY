import React, { Component } from 'react';
import './Order.scss';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import BigNumber from 'bignumber.js';
import * as service from '@/service/marketService';
// import Formatter from '@/utils/formatter';

const mapStateToProps = (state) => {
  return {
    sign: state.signAction,
    price: state.dealAction.price
  }
}
@connect(mapStateToProps)
class Order extends Component {
  constructor(props) {
    super(props)
    // < 90低 >110高
    // *1.1 *.9
    this.state = {
      price: '',
      volume: '',
      money: '0.00000000',
      bidRMB: '0.0000',
      btnClass: 0
    }
    this.defaultMoney = '0.00000000';
  }
  componentDidMount() {

  }
  componentWillReceiveProps(props) {
    this.input(props.price, 'price', this.props.bid.fixed);
  }
  getEffectiveNo(v) {
    let c = v.c.join('').split('');
    for (let len = c.length, i = len - 1; i >= 0; i--) {
      if (c[i] != 0) break;
      c.pop();
    }
    return c;
  }

  priceInput(e, type, currency) {
    if (!this.props.sign.isLogin) {
      this.setState({
        price: e.target.value
      })
      return false
    }
    this.input(e.target.value, 'price', this.props[type].fixed, type, 'price');
    setTimeout(() => {
      this.setState({
        bidRMB: BigNumber(this.state.price * this.props.reckonRMB[currency]).toFixed(4, 1)
      })
    }, 0)
  }

  volumeInput(e, type) {
    if (!this.props.sign.isLogin) {
      this.setState({
        volume: e.target.value
      })
      return false
    }
    this.setState({
      btnClass: 0
    })
    this.input(e.target.value, 'volume', this.props.ask.fixed, type);
  }

  OnCount(num, type) {
    this.setState({
      btnClass: num
    })
    if (!this.props.sign.isLogin) {
      return false;
    }
    let { price, volume } = this.state;
    let { bid, accounts, ask } = this.props;
    let allmoney;
    let fixed;
    if (type === 'ask') {
      allmoney = accounts[ask.currency].balance;
      fixed = ask.fixed;
      this.setState({
        volume: BigNumber(allmoney).times(num).toFixed(fixed, 1)
      }, () => {
        this.setState({
          money: BigNumber(Number(this.state.price)).times(Number(this.state.volume)).toNumber()
        })
      });
      // this.input(BigNumber(allmoney).times(num).toFixed(fixed, 1), 'volume', fixed);
    }
    if (price) {
      if (type !== 'ask') {
        allmoney = accounts[bid.currency].balance;
        fixed = bid.fixed;
        this.input(BigNumber(allmoney).times(num).div(price).toFixed(fixed, 1), 'volume', fixed);
      }
    }
  }

  input(text, type, fixed, sellType, inpType) {
    let { bid, accounts, ask } = this.props;
    let value = BigNumber(text);
    if (text === '') { }
    else if (text === this.state[type] || value.isNaN() || value.lt(0) || text.length >= 14 || this.getEffectiveNo(value).length - value.e - 1 > fixed) {
      return;
    }
    if (sellType === "ask") {
      let allmoney = accounts[ask.currency].balance;
      let allSum = BigNumber(allmoney).toFixed(fixed, 1);
      if ((text * 1 > allSum * 1) && inpType !== 'price') {
        this.setState({
          [type]: allSum
        });
        return false
      } else {
        this.setState({
          [type]: text
        });
      }
      setTimeout(() => {
        this.setState({
          money: BigNumber(Number(this.state.price)).times(Number(this.state.volume)).toNumber()
        });
      }, 0)
    } else {
      this.setState({
        [type]: text
      }, this.output);
    }
  }

  output() {
    if (!this.props.sign.isLogin) {
      return false;
    }
    let { price, volume } = this.state;
    let { bid, ask, accounts } = this.props;
    if (!price || !volume) {
      return this.setState({
        money: this.defaultMoney
      });
    }
    let money = BigNumber(price).times(volume);
    let allmoney = accounts[bid.currency].balance;
    if (money.gt(allmoney)) {
      return this.reset();
    }
    this.setState({
      money: BigNumber(price).times(volume).toNumber()
    });
  }

  reset() {
    let { price } = this.state;
    let { bid, ask, accounts } = this.props;
    let allmoney = accounts[bid.currency].balance;
    this.input(BigNumber(allmoney).div(price).toFixed(ask.fixed, 1), 'volume', ask.fixed);
  }

  handleSubmit() {
    if (!this.props.sign.isLogin) {
      this.props.history.push({
        pathname: '/sign/in',
        path: window.location.pathname
      })
      return false;
    }
    let { id } = this.props.match.params;
    let { price, volume } = this.state;
    let { type, intl } = this.props;
    if (!(price && volume)) {
      return false
    }
    service[type](id, {
      price: price,
      volume: volume,
      ordType: 'limit'
    }).then((data) => {
      if (data.isSuccess) {
        this.setState({
          price: '',
          volume: ''
        })
        let mess = intl.formatMessage({ id: "trading-deal-order-success" });
        message.success(mess);
      } else {
        let mess = intl.formatMessage({ id: "trading-deal-order-fail" });
        message.error(mess);
      }
    });
  }
  // toUpperCase
  render() {
    let { price, volume, money, bidRMB, btnClass } = this.state;
    let { intl, type, bid, ask, accounts, sign } = this.props;
    let topType = this.props[type];
    return (
      <div className="orderbox">
        {
          sign.isLogin ?
            <div className="available-number">
              <p><span>{intl.formatMessage({ id: "trading-deal-available" })}</span><span>{accounts[topType.currency].balance}</span><span>{topType.currency.toUpperCase()}</span></p>
            </div> : null
        }
        <label className="price inp">
          <span className="tip">买入价</span>
          <input type="number" placeholder={intl.formatMessage({ id: "trading-deal-price-placeholder" })} value={price} onChange={(e) => { this.priceInput(e, type, bid.currency) }} />
          <i>{bid.currency.toUpperCase()}</i>
        </label>
        <span className="report">≈ ¥ {bidRMB}</span>
        <label className="amount inp">
          <span className="tip">买入量</span>
          <input type="text" placeholder={intl.formatMessage({ id: "trading-deal-amount-placeholder" })} value={volume} onChange={(e) => { this.volumeInput(e, type) }} />
          <i>{ask.currency.toUpperCase()}</i>
        </label>
        <div className="order-btns">
          <button className={btnClass == 0.25?"activeBtn":""} onClick={this.OnCount.bind(this, 0.25, type)}>25%</button>
          <button className={btnClass == 0.5?"activeBtn":""} onClick={this.OnCount.bind(this, 0.5, type)}>50%</button>
          <button className={btnClass == 0.75?"activeBtn":""} onClick={this.OnCount.bind(this, 0.75, type)}>75%</button>
          <button className={btnClass == 1?"activeBtn":""} onClick={this.OnCount.bind(this, 1, type)}>100%</button>
        </div>
        <div className="order-sum">
          <span>{intl.formatMessage({ id: "trading-deal-total-amount" })}：</span>
          <span>{money} {bid.currency.toUpperCase()}</span>
        </div>
        <div className="order-submit">
          <button onClick={this.handleSubmit.bind(this)}>{intl.formatMessage({ id: `trading-deal-${type}-btn` })}{ask.currency.toUpperCase()}</button>
        </div>
      </div>
    )
  }
}


export default injectIntl(withRouter(Order))