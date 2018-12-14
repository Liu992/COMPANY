import React, { Component } from 'react';
import './Withdraw.scss';
import * as service from '@/service/myassets';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { Select, Pagination, message, Icon } from 'antd';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
// 备注加获取当前币种的可用额度的接口
const Option = Select.Option;

const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class Withdraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on1: false,
      defaultTime1: 60,
      on2: false,
      defaultTime2: 60,
      timer1: null,
      timer2: null,
      withdrawalList: [],
      page: 1,
      allPage: 0,
      fee: '',
      min: "",
      coinType: this.props.match.params.type.toUpperCase(),
      addliston: false,
      addlist: [],
      coinList: [],
      address: "",
      amount: "",
      assetpass: "",
      emailcode: "",
      gacode: "",
      smscode: "",
      dialogOn: false,
      showID: null,
      showHide: false,
      userAsset: {},
      receive: "0.00"
    }
  }
  componentDidMount() {
    this.getwithdrawal(this.state.page)
    this.getFeeAndMin()
    this.getAllAddress()
    this.getCoin()
    this.getAsset()
  }
  // 获取币种
  getCoin = () => {
    service.getCoin()
      .then(res => {
        this.setState({
          coinList: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 修改币种
  handleChange = (val) => {
    this.setState({
      coinType: val,
      addliston: false,
      address: ""
    }, () => {
      this.getFeeAndMin()
      this.getAllAddress()
      this.getAsset()
    })
  }
  getAsset = () => {
    let { coinType } = this.state;
    service.myassets()
      .then(res => {
        if (res.isSuccess) {
          for (let i = 0; i < res.result.accounts.length; i++) {
            if (coinType.toLowerCase() === res.result.accounts[i].currency) {
              this.setState({
                userAsset: {
                  myasset: res.result.accounts[i].balance,
                  mylocked: res.result.accounts[i].locked
                }
              })
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  getFeeAndMin = () => {
    let { coinType } = this.state
    service.searchNation(coinType.toLowerCase())
      .then(res => {
        this.setState({
          fee: res.fee,
          min: res.min
        })
      })
  }
  getwithdrawal = (page) => {
    service.getwithdrawal(page)
      .then(res => {
        this.setState({
          withdrawalList: res.members,
          allPage: res.count
        })
        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  changeCancel(address, currency) {
    let obj = {
      address: address,
      currency: currency
    }
    let { page } = this.state;
    service.cancelWithdrawal(obj)
      .then(res => {
        this.getwithdrawal(page)
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 点击分页
  changePage = (num) => {
    this.setState({
      page: num
    }, () => {
      this.getwithdrawal(this.state.page)
    })
  }
  // changeInput
  changeInp(attr, e) {
    let { fee, min, userAsset } = this.state;
    if (attr === "amount") {
      if (e.target.value < 0) {
        return false
      } else {
        this.setState({
          [attr]: e.target.value
        })
        if ((e.target.value * 1 < min) || (e.target.value > userAsset.myasset * 1)) {
          this.setState({
            receive: '0.00'
          })
        } else {
          this.setState({
            receive: BigNumber(e.target.value - fee).toFixed(6, 1)
          })
        }
      }
    } else {
      this.setState({
        [attr]: e.target.value
      })
    }
  }
  // 获取该币种地址
  getAllAddress() {
    let { coinType } = this.state;
    service.getAllAddress()
      .then(res => {
        if (res.isSuccess) {
          this.setState({
            addlist: res.data && res.data[coinType.toLowerCase()]
          })
        }
      })
  }
  // 发送验证码
  sendVerifyCode() {
    let { smscode, emailcode, gacode } = this.state;
    let { intl } = this.props;
    let codeObj = {
      SMSCode: smscode,
      emailCode: emailcode,
      GAcode: gacode
    }
    if (codeObj.SMSCode === "" || codeObj.emailCode === "" || codeObj.GAcode === "") {
      message.warning(intl.formatMessage({ id: "myassets-message-null" }));
      return false;
    }
    service.withdrawVerify(codeObj)
      .then(res => {
        if (res.isSuccess) {
          // 如果成功
          message.success(intl.formatMessage({ id: "myassets-validation-success" }));
          this.setState({
            dialogOn: false
          }, () => {
            this.onWithdraw()
          })
        } else {
          // 如果失败
          message.warning(intl.formatMessage({ id: "myassets-validation-error" }));
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 发送提币信息
  onWithdraw = () => {
    let { address, coinType, amount } = this.state;
    service.withdraw({
      address: address,
      amount: amount,
      currency: coinType.toLowerCase()
    })
      .then(res => {
        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 点击提币
  subWithdraw = () => {
    let { intl, member } = this.props;
    let { address, amount, min, userAsset } = this.state;
    if (!address || !amount) {
      message.warning(intl.formatMessage({ id: "myassets-message-null" }))
      return false;
    }
    if ((amount*1 >= min) && (amount*1 <= userAsset.myasset*1)) {
      if (member.sms || member.google || member.email) {
        this.setState({
          dialogOn: true
        })
      } else {
        this.onWithdraw()
      }
    } else {
      if (amount < min) {
        message.warning(intl.formatMessage({ id: "myassets-withdraw-low-of" }))
        return false
      } else {
        message.warning(intl.formatMessage({ id: "myassets-withdraw-out-of" }))
        return false
      }
    }
  }
  // 打开提币地址
  openaddList() {
    let { addlist } = this.state;
    if (addlist) {
      this.setState({
        addliston: true
      })
    } else {
      this.setState({
        addliston: false
      })
    }
  }
  // 输入地址
  inpAdd(e) {
    this.setState({
      address: e.target.value
    }, () => {
      this.setState({
        addliston: false
      })
    })
  }
  // 点击已有地址
  changeAdd(val) {
    this.setState({
      address: val
    }, () => {
      this.setState({
        addliston: false
      })
    })
  }
  // 关闭弹窗
  onClose() {
    this.setState({
      dialogOn: false
    })
  }
  // 发送手机号
  onSend1 = () => {
    this.setState({
      on1: true,
      defaultTime1: 60
    }, () => {
      service.withdrawSendSMS()
      this.stateTime1()
    })
  }
  // 请求邮箱验证码
  onSend2 = () => {
    this.setState({
      on2: true,
      defaultTime2: 60
    }, () => {
      service.withdrawSendEmail()
      this.stateTime2()
    })
  }
  // 60s 倒计时
  stateTime1 = () => {
    let { defaultTime1 } = this.state;
    let num = 0;
    this.setState({
      timer1: setInterval(() => {
        num++;
        this.setState({
          defaultTime1: defaultTime1 - num
        }, () => {
          if (this.state.defaultTime1 <= 0) {
            clearInterval(this.state.timer1)
            this.setState({
              on1: false
            })
          }
        })
      }, 1000)
    })
  }
  // 60s 倒计时
  stateTime2 = () => {
    let { defaultTime2 } = this.state;
    let num = 0;
    this.setState({
      timer2: setInterval(() => {
        num++;
        this.setState({
          defaultTime2: defaultTime2 - num
        }, () => {
          if (this.state.defaultTime2 <= 0) {
            clearInterval(this.state.timer2)
            this.setState({
              on2: false
            })
          }
        })
      }, 1000)
    })
  }
  showDetail(id) {
    this.setState({
      showID: id,
      showHide: !this.state.showHide
    })
  }
  // 地址管理
  toAddress() {
    this.props.history.push({
      pathname: "/assetaddress"
    })
  }
  render() {
    let {
      withdrawalList, addliston, coinList, addlist, address, fee, coinType, min, on1, on2, defaultTime1, defaultTime2,
      amount, assetpass, emailcode, gacode, smscode, dialogOn, showID, showHide, page, allPage, userAsset, receive
    } = this.state;
    let { intl, member } = this.props;
    return (
      <div className="withdraw">
        <Header />
        <div className="withdraw-box">
          {/* 验证码弹窗 */}
          {
            dialogOn ? <div className="dialog-verify">
              <div className="verify-box">
                <Icon type="close" className="close" onClick={this.onClose.bind(this)} />
                {
                  member.google && !member.sms ? <div className="gaverify amount">
                    <input type="text" placeholder={intl.formatMessage({ id: "myassets-ga-code-placeholder" })} value={gacode} onChange={this.changeInp.bind(this, 'gacode')} />
                  </div> : null
                }
                {
                  member.sms ? <div className="sendverify sendinp">
                    <input type="text" placeholder={intl.formatMessage({ id: "myassets-sms-code-placeholder" })} value={smscode} onChange={this.changeInp.bind(this, 'smscode')} />
                    <button className={`send ${on1 ? 'already-send' : ''}`} onClick={this.onSend1} disabled={on1}>{!on1 ? intl.formatMessage({ id: "myassets-authentication-dialog-send" }) : defaultTime1 + 's'}</button>
                  </div> : null
                }
                {
                  member.email ? <div className="emailerify sendinp">
                    <input type="text" placeholder={intl.formatMessage({ id: "myassets-email-code-placeholder" })} value={emailcode} onChange={this.changeInp.bind(this, 'emailcode')} />
                    <button className={`send ${on2 ? 'already-send' : ''}`} onClick={this.onSend2} disabled={on2}>{!on2 ? intl.formatMessage({ id: "myassets-authentication-dialog-send" }) : defaultTime2 + 's'}</button>
                  </div> : null
                }
                <button className="confirmCode withdraw-btn" onClick={this.sendVerifyCode.bind(this)}>{intl.formatMessage({ id: "myassets-withdraw-affirm" })}</button>
              </div>
            </div> : null
          }

          <h1 className="withdraw-title font24">
            {intl.formatMessage({ id: "myassets-withdrawcan-dialog-title" })}
          </h1>
          <div className="withdraw-content">
            <div className="content-left" id="withdraw-content-left">
              <Select
                className="left-coin"
                defaultValue={coinType}
                style={{ width: 545 }}
                onChange={this.handleChange}
                getPopupContainer={() => document.getElementById('withdraw-content-left')}
              >
                {
                  coinList.map(item => {
                    return (
                      <Option key={item.id} value={item.code.toUpperCase()}>{item.code.toUpperCase()}</Option>
                    )
                  })
                }
              </Select>
              <div className="left-address">
                <span>{intl.formatMessage({ id: "myassets-withdrawcan-dialog-address" })}</span>
                <input
                  className="addinp"
                  type="text"
                  value={address}
                  placeholder={intl.formatMessage({ id: "myassets-widthdraw-address-placeholder" })}
                  onFocus={this.openaddList.bind(this)}
                  onChange={this.inpAdd.bind(this)}
                />
                {
                  addliston ? <ul className="addlist">
                    {
                      addlist.map((item) => {
                        return (
                          <li key={item.id} onClick={this.changeAdd.bind(this, item.address)}>
                            <span>{intl.formatMessage({ id: "myassets-address" })}：{item.address}</span>
                            <span>{intl.formatMessage({ id: "myassets-remark" })}：{item.name}</span>
                          </li>
                        )
                      })
                    }
                  </ul> : null
                }
                <button className="add-btn" onClick={this.toAddress.bind(this)}>{intl.formatMessage({ id: "myassets-management-address" })}</button>
              </div>
              <div className="left-tip">
                <span>{intl.formatMessage({ id: "myassets-fee" })}</span>：
                <span>{fee} {coinType}</span>
              </div>
            </div>
            <div className="content-right">
              <div className="amount">
                <input type="text" placeholder={intl.formatMessage({ id: "myassets-withdraw-number" })} value={amount} onChange={this.changeInp.bind(this, 'amount')} />
              </div>
              <div className="receive">
                <input type="text" value={receive} disabled={true} onChange={this.changeInp.bind(this, "receive")}/>
                <span>{intl.formatMessage({ id: "myassets-receive-placeholder" })}</span>
              </div>
              {/* <div className="assetpass">
                <input type="text" placeholder={intl.formatMessage({id:"myassets-money-pass"})} value={assetpass} onChange={this.changeInp.bind(this, "assetpass")} />
              </div> */}
              <div className="withdraw-tip">
                <span>{min}</span>
                <span>≤{intl.formatMessage({ id: "myassets-withdraw-money" })}({coinType})≤</span>
                <span>{userAsset.myasset}</span>
                <span className="locked">{intl.formatMessage({ id: "myassets-table-th3" })}：{userAsset.mylocked}</span>
              </div>
              <button className="withdraw-btn" onClick={this.subWithdraw}>{intl.formatMessage({ id: "myassets-withdraw-btn" })}</button>
            </div>
          </div>
          <div className="withdraw-history">
            <button className="history-tip">
              {intl.formatMessage({ id: "myassets-withdrawcan-dialog-address" })}
            </button>
            <ul className="table">
              <li>
                <div className="li-list">
                  <span>{intl.formatMessage({ id: "trading-orders-table-th1" })}</span>
                  <span>{intl.formatMessage({ id: "trading-market-table-th1" })}</span>
                  <span>{intl.formatMessage({ id: "history-table-th3" })}</span>
                  <span>{intl.formatMessage({ id: "history-table-th6" })}</span>
                  <span>{intl.formatMessage({ id: "history-table-th7" })}</span>
                  <span></span>
                </div>
              </li>
              {
                Array.isArray(withdrawalList) && withdrawalList.map((item) => {
                  return (
                    <li key={item.id}>
                      <div className="li-list">
                        <span>{item.createdAt}</span>
                        <span>{item.fundExtra.toUpperCase()}</span>
                        <span>{item.sum}</span>
                        <span>{intl.formatMessage({ id: "history-" + item.aasmState + "" })}</span>
                        <span className="maingreen" onClick={this.changeCancel.bind(this, item.fundUid, item.fundExtra)}>{item.aasmState === "wait" ? intl.formatMessage({ id: "history-cancel" }) : ""}</span>
                        <span style={{ cursor: "pointer" }} onClick={this.showDetail.bind(this, item.id)}>{intl.formatMessage({ id: "myassets-details" })}</span>
                      </div>
                      <div className={"li-detail " + (showID === item.id && showHide ? "li-detail-show" : "li-detail-hide")}>
                        <span>{intl.formatMessage({ id: "myassets-withdrawcan-dialog-address" })}：{'dfghjkdfghjkldfghjkldfghjkdfghjk'}</span>
                        <span>{intl.formatMessage({ id: "myassets-deal-id" })}：{item.txid}</span>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
            {
              withdrawalList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page} total={allPage} onChange={this.changePage} />
            }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Withdraw