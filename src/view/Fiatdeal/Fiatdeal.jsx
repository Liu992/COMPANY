import React, { PureComponent } from 'react';
import './Fiatdeal.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { NavLink } from 'react-router-dom';
import { Icon, Pagination, message } from 'antd';
import { connect } from 'react-redux';
import * as service from '../../service/otc';
import utils from '../../utils/util';
import BigNumber from 'bignumber.js';

const mapStateToprops = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToprops)
class Fiatdeal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      defaultInd: 0,
      defaultCoin: 'sell',
      coinList: ["ETH", "BTC", "DFC"],
      dialogDetails: false,
      coin: "ETH",
      detailsList: [],
      total: 0,
      page: 1,
      data: {},
      count: "",
      coinAmount: ''
    }
  }
  componentDidMount() {
    this.getDealList()
  }
  // 获取订单
  getDealList = () => {
    let { defaultCoin, coin, page } = this.state;
    service.getDealList(defaultCoin, coin.toLowerCase(), 10, page)
      .then(res => {
        this.setState({
          detailsList: res.list,
          total: res.count
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  // click下单
  onDeal(ind, coin, type) {
    this.setState({
      defaultInd: ind,
      defaultCoin: coin,
      coin: type,
      page: 1
    }, () => {
      this.getDealList()
    })
  }

  // 点击购买
  goDeal(data) {
    let { member, intl } = this.props;
    if (!member.verify) {
      message.error(intl.formatMessage({ id: "fiatdeal-message-error" }));
      this.props.history.push('/certification')
      return false;
    }

    if (member.ali || member.bank || member.wechat) {
      this.setState({
        dialogDetails: true,
        data: data
      })
    } else {
      this.props.history.push('/setcny')
      return false;
    }
  }
  // 点击下单
  changeDeal(id) {
    let { defaultCoin, count, coinAmount } = this.state;
    let { intl } = this.props;
    let isLogin = utils.getCookie('Authorization');
    if (!isLogin) {
      this.props.history.push('/sign/in')
      return false;
    }
    if (!count) {
      return false
    }
    service.tradeAd(defaultCoin === 'buy' ? 'ask' : "bid", {
      orderId: id,
      amount: coinAmount
    })
      .then(res => {
        this.onClose()
        this.props.history.push("/paypage/" + res.data.id + "")
        return false;
      })
      .catch(err => {
        if (err.code) {
          message.error(intl.formatMessage({ id: `fiatdeal-${defaultCoin === 'buy' ? 'ask' : "bid"}-${err.code}` }))
        } else {
          message.error(intl.formatMessage({ id: "createAd-handle-error" }))
        }
        console.log(err)
      })
  }
  // 点击关闭购买
  onClose = () => {
    this.setState({
      dialogDetails: false
    })
  }
  // 切换页数
  changePage = (val) => {
    this.setState({
      page: val
    }, () => {
      this.getDealList()
    })
  }
  // 改变cny
  changeCount = (e) => {
    let { data } = this.state;
    this.setState({
      count: e.target.value
    }, () => {
      this.setState({
        coinAmount: BigNumber(this.state.count / data.price).toFixed(6, 1)
      })
    })
  }
  // 改变币种数量
  changeCoinAmount = (e) => {
    let { data } = this.state;
    this.setState({
      coinAmount: e.target.value
    }, () => {
      this.setState({
        count: BigNumber(this.state.coinAmount * data.price).toFixed(6, 1)
      })
    })
  }
  render() {
    let { intl, member } = this.props;
    let { coinList, defaultInd, defaultCoin, dialogDetails, total, detailsList, data, coin, count, coinAmount } = this.state;
    return (
      <div className="fiatdeal">
        <Header />
        <div className="fiatdeal-box">
          {/* 购买详情 */}
          {
            dialogDetails ?
              <div className="fiatdeal-buydetail">
                <div className="buydetail-content">
                  <div className="content-left">
                    <div className="l-t">
                      <span className="l-l">{intl.formatMessage({ id: "otc-merchant" })}</span>
                      <span className="l-c">
                        {data.member.nickname}<br />
                        {intl.formatMessage({ id: "otc-available" })}: {data.volume}{coin}
                      </span>
                      <span className="l-r">
                        {intl.formatMessage({ id: "otc-price" })}&nbsp;{data.price} CNY<br />
                        {intl.formatMessage({ id: "otc-limits" })}&nbsp;{data.limitPrice} CNY
                  </span>
                    </div>
                    <div className="l-b">
                      <span className="l-l">{intl.formatMessage({ id: "otc-pay" })}</span>
                      <span className="l-c">
                        {
                          data.member && data.member.c2c_paymodes.map((item, ind) => {
                            return <span key={ind}>
                              <img src={require("../../assets/image/" + item.type + ".svg")} alt="" />
                            </span>
                          })
                        }
                      </span>
                      <span className="l-r"></span>
                    </div>
                  </div>
                  <div className="content-right">
                    <div className="r-t">
                      <span>
                        <label>
                          <input type="text" value={count} onChange={this.changeCount} />CNY
                        </label>
                        <Icon type="swap" theme="outlined" />
                        <label>
                          <input type="text" value={coinAmount} onChange={this.changeCoinAmount} />
                          <span>{coin}</span>
                        </label>
                      </span>
                      <span>
                        <button onClick={this.changeDeal.bind(this, data.id)} className="verify">{intl.formatMessage({ id: "otc-confirm" })}</button>
                        <button onClick={this.onClose} className="cancel">{intl.formatMessage({ id: "otc-cancel" })}</button>
                      </span>
                    </div>
                    <div className="r-b">
                      {intl.formatMessage({ id: "otc-buy-tip" })}
                    </div>
                  </div>
                </div>
              </div>
              : null
          }
          {/* 买卖内容 */}
          <div className="fiatdeal-content">
            <div className="fiatdeal-title">
              <div className="fiatdeal-buy">
                <button className="head">{intl.formatMessage({ id: "otc-buy" })}</button>
                <ul>
                  {
                    Array.isArray(coinList) && coinList.map((item, ind) => {
                      return <li className={defaultInd === ind && defaultCoin === 'sell' ? 'actived' : ""} onClick={this.onDeal.bind(this, ind, 'sell', item)} key={ind}>{item}</li>
                    })
                  }
                </ul>
              </div>
              <div className="fiatdeal-sell">
                <button className="head">{intl.formatMessage({ id: "otc-sell" })}</button>
                <ul>
                  {
                    Array.isArray(coinList) && coinList.map((item, ind) => {
                      return <li className={defaultInd === ind && defaultCoin === 'buy' ? 'actived' : ""} onClick={this.onDeal.bind(this, ind, 'buy', item)} key={ind}>{item}</li>
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="fiatdeal-detail">
              <ul className="fiatdeal-table">
                  <li>
                    <span>{intl.formatMessage({ id: "otc-merchant" })}</span>
                    <span>{intl.formatMessage({ id: "otc-available" })}</span>
                    <span>{intl.formatMessage({ id: "otc-limits" })}</span>
                    <span>{intl.formatMessage({ id: "otc-price" })}</span>
                    <span>{intl.formatMessage({ id: "otc-pay-method" })}</span>
                    <span>{intl.formatMessage({ id: "otc-control" })}</span>
                  </li>
                  {
                    Array.isArray(detailsList) && detailsList.map((item, ind) => {
                      return (
                        <li key={ind}>
                          <span className="merchant">{item.member && item.member.email || item.member.phoneNumber}</span>
                          <span className="available">{item.volume} {item.currency}</span>
                          <span className="limits">{item.limitPrice} CNY</span>
                          <span className="price maingreen">{item.price} CNY</span>
                          <span className="pay">{
                            item.member && item.member.c2c_paymodes.map((item1, ind1) => {
                              return (
                                <span key={ind1}>
                                  <img src={require("../../assets/image/" + item1.type + ".svg")} alt="" />
                                </span>
                              )
                            })
                          }</span>
                          <span className="control"><button onClick={this.goDeal.bind(this, item)}>{intl.formatMessage({ id: "myorder-" + item.type + "-1" })}{coin}</button></span>
                        </li>
                      )
                    })
                  }
              </ul>

              <div className="fiatdeal-list">
                <ul>
                  {
                    Array.isArray(detailsList) && detailsList.map((item, ind) => {
                      return (
                        <li key={ind}>
                          <h2><span>{intl.formatMessage({ id: "otc-merchant" })}</span><span>{item.member && item.member.email || item.member.phoneNumber}</span></h2>
                          <p>
                            <span>{intl.formatMessage({ id: "otc-available" })} {item.volume} {item.currency}</span>
                            <span>{intl.formatMessage({ id: "otc-limits" })} {item.limitPrice} CNY</span>
                          </p>
                          <p>
                            <span>{intl.formatMessage({ id: "otc-price" })} {item.price} CNY</span>
                            <span>{intl.formatMessage({ id: "otc-pay-method" })} {
                              item.member && item.member.c2c_paymodes.map((item1, ind1) => {
                                return (
                                  <span key={ind1}><img src={require("../../assets/image/" + item1.type + ".svg")} alt="" /></span>
                                )
                              })
                            }</span>
                          </p>
                          <div className="control"><button onClick={this.goDeal.bind(this, item)}>{intl.formatMessage({ id: "myorder-" + item.type + "" })}{coin}</button></div>
                        </li>

                      )
                    })
                  }

                </ul>
              </div>
              {
                total > 0 ? <Pagination total={total} onChange={this.changePage} /> : null
              }
              {
                total == 0 ? <div className="data-null">{intl.formatMessage({ id: "trading-not-data" })}</div> : null
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Fiatdeal