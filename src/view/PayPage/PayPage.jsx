import React, { Component } from 'react';
import './PayPage.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import * as service from '../../service/otc';
import { Icon, Radio, message } from 'antd';
import Chat from './Chat';

const RadioGroup = Radio.Group;

class PayPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: 0,
      obj: {},
      time: "00分00秒",
      timer: null,
      dialog: false,
      value: "",
      payMessage: {},
      status: 0
    }
  }
  componentDidMount() {
    this.getTradeMessage()
  }
  // 获取订单信息
  getTradeMessage = () => {
    const { intl } = this.props;
    service.getTradeMessage(this.props.match.params.id)
      .then(res => {
        this.setState({
          obj: res,
          state: res.state
        })
        if (res.state !== 1) {
          this.setState({
            timer: setInterval(() => {
              this.setState({
                time: this.countDown(this.state.obj.endTime)
              }, () => {
                if (!this.countDown(this.state.obj.endTime)) {
                  clearInterval(this.state.timer)
                  this.setState({
                    time: "00" + intl.formatMessage({ id: "pay-minute" }) + "00" + intl.formatMessage({ id: "pay-second" }) + "",
                    timer: null
                  }, () => {
                    this.initTrade()
                  })
                }
              })
            }, 1000)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  initTrade = () => {
    service.getTradeMessage(this.props.match.params.id)
      .then(res => {
        this.setState({
          obj: res,
          state: res.state
        })
      })
  }
  okPay = () => {
    let { obj, value } = this.state;
    service.goPay({
      payType: obj.payModes[value].type,
      tradeId: this.props.match.params.id
    })
      .then(res => {
        this.onClose();
        this.getTradeMessage();
      })
      .catch(err => {
        if (err.code) {
          message.error(intl.formatMessage({ id: `paypage-hadpay-${err.code}` }))
        } else {
          message.error(intl.formatMessage({ id: "createAd-handle-error" }))
        }
      })
  }
  // 去支付
  goPay(state) {
    let { intl } = this.props;
    if (state != 0) {
      return false
    }
    let { value, obj } = this.state;
    if (value === "") {
      message.error(intl.formatMessage({ id: "pay-select" }))
      return false
    } else {
      this.setState({
        dialog: true,
        payMessage: obj.payModes[value]
      })
    }
  }
  // 取消订单
  cancelOrder = () => {
    const { intl } = this.props;
    service.cancelOrder({ tradeId: this.props.match.params.id })
      .then(res => {
        this.getTradeMessage()
      })
      .catch(err => {
        if (err.code) {
          message.error(intl.formatMessage({ id: `paypage-cancel-${err.code}` }))
        } else {
          message.error(intl.formatMessage({ id: "createAd-handle-error" }))
        }
        console.log(err)
      })
  }
  // 关闭弹窗
  onClose = () => {
    this.setState({
      dialog: false
    })
  }
  // 切换单选框
  onChangeRadio = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  // 倒计时
  countDown = (startTime) => {
    const { intl } = this.props;
    startTime = startTime.replace(/-/g, '/');//ios new Date 兼容问题
    var timeDiff = new Date(startTime) - new Date();
    if (timeDiff < 0) return false;
    const minutes = parseInt(timeDiff / 1000 / 60 % 60, 10) >= 10 ? parseInt(timeDiff / 1000 / 60 % 60, 10) : '0' + parseInt(timeDiff / 1000 / 60 % 60, 10);
    const seconds = parseInt(timeDiff / 1000 % 60, 10) >= 10 ? parseInt(timeDiff / 1000 % 60, 10) : '0' + parseInt(timeDiff / 1000 % 60, 10);
    return minutes + intl.formatMessage({ id: "pay-minute" }) + seconds + intl.formatMessage({ id: "pay-second" });
  }
  // 同意付款
  setAgree(state) {
    let { intl } = this.props;
    if (state != 2) {
      return false
    }
    service.setAgree({ tradeId: this.props.match.params.id })
      .then(res => {
        this.getTradeMessage()
      })
      .catch(err => {
        if (err.code) {
          message.error(intl.formatMessage({ id: `paypage-true-${err.code}` }))
        } else {
          message.error(intl.formatMessage({ id: "createAd-handle-error" }))
        }
      })
  }
  render() {
    let { obj, time, dialog, value, payMessage, state } = this.state;
    let { intl } = this.props;
    return (
      <div className="paypage">
        <Header />
        <div className="paypage-box">
          {/* 弹框 */}
          {
            dialog ? <div className="pay-dialog">
              <div className="pay-dialog-box">
                <Icon className="close" type="close" theme="outlined" onClick={this.onClose} />
                {
                  payMessage.type === 'bank'
                    ?
                    null
                    :
                    <div className="qrcode">
                      <h2>{intl.formatMessage({ id: "pay-Qrcode" })}</h2>
                      {
                        payMessage.receivePhoto ? <img src={"/uploads/" + payMessage.receivePhoto} alt="" /> : ""
                      }

                    </div>
                }
                <h1 className="mainred">{intl.formatMessage({ id: "pay-confirmPay-btn" })} {time}</h1>
                <div className="dialog-price">
                  <i>{intl.formatMessage({ id: "pay-money" })}：</i>
                  <p>{obj.funds} CNY</p>
                  <i>{intl.formatMessage({ id: "pay-peer" })}{intl.formatMessage({ id: "pay-" + payMessage.type + "" })}{intl.formatMessage({ id: "pay-number" })}</i>
                  {
                    payMessage.type === 'bank'
                      ? <p>{payMessage.bankNumber}</p>
                      : <p>{payMessage.receivePname}</p>
                  }
                  <i>{intl.formatMessage({ id: "pay-contact" })}</i>
                  <p>{obj.phone}&nbsp;&nbsp;{obj.email}</p>
                  <i>{intl.formatMessage({ id: "pay-buy-tip" })}</i>

                  <hr />
                  <div className="dialog-btn">
                    <button onClick={this.onClose}>{intl.formatMessage({ id: "pay-dialog-btn1" })}</button>
                    <button onClick={this.okPay}>{intl.formatMessage({ id: "pay-dialog-btn2" })}</button>
                  </div>
                </div>
              </div>
            </div> : null
          }
          <div className="paypage_left">
            <i className="pay-title">{intl.formatMessage({ id: "pay-order-title1" })}： #{obj.tradeNumber}</i>
            <h1 className="pay-obj">{intl.formatMessage({ id: "pay-order-title2" })}{obj.nickName}{obj.type === 'OrderBid' ? intl.formatMessage({ id: "pay-order-title4" }) : intl.formatMessage({ id: "pay-order-title3" })}{obj.volume} {obj.currency}</h1>
            <div className="price">
              <p><span>{intl.formatMessage({ id: "pay-order-title5" })}：</span><span>{obj.price} CNY</span></p>
              <p><span>{intl.formatMessage({ id: "pay-order-title6" })}：</span><span className="maingreen">{obj.funds} CNY</span></p>
            </div>
            <div className="pay-notice">
              <i className="pay-title">{intl.formatMessage({ id: "pay-order-title7" })}</i>
              <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
                {
                  obj.payModes && obj.payModes.map((item, ind) => {
                    return (
                      <Radio key={item.id} value={ind} className="pp" disabled={obj.type !== "OrderAsk" || obj.state !== 0 ? true : false}>
                        <img src={require("../../assets/image/" + item.type + ".svg")} alt="" />
                        <span>
                          {intl.formatMessage({ id: "pay-" + item.type + "" })}
                        </span>
                        {
                          item.bank ? <span>{intl.formatMessage({ id: "pay-bank" })}: {item.bank}</span> : null
                        }
                        <span>{intl.formatMessage({ id: "pay-receivePname" })}: {item.receivePname}</span>
                        {
                          item.bank ? <span>{intl.formatMessage({ id: "pay-bankNumber" })}: {item.bankNumber}</span> : null
                        }
                        {
                          item.bank ? <span>{intl.formatMessage({ id: "pay-bankAddress" })}: {item.bankAddress}</span> : null
                        }
                      </Radio>
                    )
                  })
                }
              </RadioGroup>
            </div>
            {/* 等待支付 */}
            {
              obj.state !== 1 ?
                <div className="pay-time">
                  {intl.formatMessage({ id: "pay-order-title8" })}
                  &nbsp;<span className="mainred">{time}</span>&nbsp;
              {intl.formatMessage({ id: "pay-order-title9" })}
                  &nbsp;<span>{obj.nickName}</span>
                  &nbsp;
              <span className="maingreen">
                    {intl.formatMessage({ id: "pay-order-title10" })}
                    &nbsp;
                {obj.funds}CNY,&nbsp;
              </span>

                  {intl.formatMessage({ id: "pay-contact" })}：
              <span>{obj.phone}</span>&nbsp;&nbsp;
              <span>{obj.email}</span>
                </div> :
                <div className="pay-time">
                  {intl.formatMessage({ id: "pay-contact" })}：
              <span>{obj.phone}</span>&nbsp;&nbsp;
              <span>{obj.email}</span>
                </div>
            }

            {/* 点击支付 */}
            {
              obj.type === 'OrderAsk' ?
                <div className="pay-btn">
                  <button className={state != 0 ? "disButton" : ""} onClick={this.goPay.bind(this, state)}>
                    {intl.formatMessage({ id: "pay-OrderAsk-" + state + "" })}
                  </button>
                </div>
                : <div className="pay-btn">
                  <button className={state != 2 ? "disButton" : ""} onClick={this.setAgree.bind(this, state)}>
                    {intl.formatMessage({ id: "pay-OrderBid-" + state + "" })}
                  </button>
                </div>
            }
            {
              state == 0 ? <div className="pay-not-btn">
                <button onClick={this.cancelOrder}>{intl.formatMessage({ id: "pay-order-title12" })}</button>
              </div> : null
            }
            <div className="pay-need">
              <p>{intl.formatMessage({ id: "pay-need-0" })}</p>
              <p>{intl.formatMessage({ id: "pay-need-1" })}</p>
              <p>{intl.formatMessage({ id: "pay-need-2" })}</p>
              <p>{intl.formatMessage({ id: "pay-need-3" })}</p>
              <p>{intl.formatMessage({ id: "pay-need-4" })}</p>
              <p>{intl.formatMessage({ id: "pay-need-5" })}</p>
            </div>
          </div>
          {/* 聊天 */}
          <div className="paypage_right">
            <Chat orderId={this.props.match.params.id} nickName={obj.nickName}/>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default PayPage