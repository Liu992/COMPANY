import React, { Component } from 'react';
import './Personal.scss';
import Header from '../../component/Header';
import { Switch, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Footer from '@/component/Footer';
import { connect } from 'react-redux';
import sign from '../../store/action/signAction';
import LoginHistory from './LoginHistory';
import * as server from '../../service/personal';

const mapStateToprops = (state) => {
  return {
    member: state.signAction.member,
    sign: state.signAction.isLogin
  }
}

@connect(mapStateToprops)
class Personal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer1: null,
      timer2: null,
      veribleDialog: false,
      on1: false,
      defaultTime1: 60,
      on2: false,
      defaultTime2: 60,
      intensity: '',
      switchType: '',
      switchOn: false,
      authBtn: false,
      defaultNav: "message"
    }
  }
  componentDidMount() {
    this.getUserMessage(this.props.member) // 计算安全等级
  }
  componentWillReceiveProps(nextProps) {
    this.getUserMessage(nextProps.member)
  }
  onHide = () => {
    this.setState({
      veribleDialog: false
    })
  }
  onStop = (event) => {
    event.stopPropagation()
  }
  onSend1() {
    let { intl } = this.props;
    server.sendSMS()
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: 'success-tip-sms' }))
        } else {
          message.error(intl.formatMessage({ id: 'error-tip-sms' }))
        }
      })
    this.setState({
      on1: true,
      defaultTime1: 60
    }, () => {
      this.stateTime1()
    })
  }
  onSend2() {
    let { intl } = this.props;
    this.setState({
      on2: true,
      defaultTime2: 60
    }, () => {
      server.sendEmail({
        type: this.state.switchOn,
        submitType: this.state.switchType === 'google' ? "GA" : "phone"
      })
        .then(res => {
          if (res.isSuccess) {
            message.success(intl.formatMessage({ id: "center-dialog-send-success" }))
          } else {
            message.error(intl.formatMessage({ id: "center-dialog-send-fail" }))
          }
        })
      this.stateTime2()
    })
  }

  toSubmitCode = () => {
    let { smscode, emailcode, googlecode } = this.refs;
    let { intl } = this.props;
    let codeObj = {
      smscode: smscode && smscode.value,
      emailcode: emailcode && emailcode.value,
      googlecode: googlecode && googlecode.value
    }
    if (codeObj.smscode === '' || codeObj.emailcode === '') {
      message.warning(intl.formatMessage({ id: "myassets-message-null" }));
      return false;
    }
    this.setState({
      authBtn: true
    })
    let type = this.state.switchType === "google" ? "totp" : "phone";
    this.verifyOn(type, this.state.switchOn, codeObj)
  }
  // 验证
  verifyOn = (type, switchOn, codeObj) => {
    let { intl } = this.props;
    server.switchOn(type, switchOn, codeObj)
      .then(res => {
        let { google, activated, email, verify, phone, sms, nickname } = this.props.member;
        this.setState({
          authBtn: false
        })
        if (res.isSuccess) {
          this.resetTime();
          let newmember = this.props.member;
          newmember.google = this.state.switchType === "google" ? !google : google;
          newmember.sms = this.state.switchType === "phone" ? !sms : sms;
          let obj = {
            isLogin: this.props.sign,
            member: newmember
            // member: {
            //   nickname:nickname,
            //   google: this.state.switchType === "google" ? !google : google,
            //   activated: activated,
            //   email: email,
            //   phone: phone,
            //   sms: this.state.switchType === "phone" ? !sms : sms,
            //   verify: verify
            // }
          }
          this.props.dispatch(sign(obj))
          this.getUserMessage(obj.member)
        } else {
          message.error(intl.formatMessage({ id: "myassets-validation-error" }));
        }
      })
  }
  // 去实名认证
  toCertification = () => {
    this.props.history.push('/certification')
  }

  // 绑定邮箱
  toVerifyEmaild = () => {
    this.props.history.push('/setemail')
  }
  // 开关
  changeSwitch(type, bool) {
    let { email, google, sms } = this.props.member;
    let { smscode, emailcode, googlecode } = this.refs;
    let codeObj = {
      smscode: smscode && smscode.value,
      emailcode: emailcode && emailcode.value,
      googlecode: googlecode && googlecode.value
    }
    if (type === 'phone' && !google && !email) {
      this.setState({
        switchOn: bool ? 'open' : "close",
        veribleDialog: false,
        switchType: type
      }, () => {
        this.verifyOn(type, this.state.switchOn, codeObj)
      })
    } else if (type === "google" && !sms && !email) {
      this.setState({
        switchOn: bool ? 'open' : "close",
        veribleDialog: false,
        switchType: type
      }, () => {
        this.verifyOn("totp", this.state.switchOn, codeObj)
      })
    } else {
      this.setState({
        switchOn: bool ? 'open' : "close",
        veribleDialog: true,
        switchType: type
      })
    }
  }
  ellipsisPhone = (str) => {
    let start = str.substring(0, 3);
    let end = str.substring(7, 11);
    return start + '****' + end;
  }
  ellipsisEmail = (str) => {
    let valAryy = str.split('@');
    let start = str.substring(0, 3);
    let username = start + '****' + valAryy[valAryy.length - 1]
    return username
  }
  resetTime = () => {
    clearInterval(this.state.timer1)
    clearInterval(this.state.timer2)
    this.setState({
      veribleDialog: false,
      defaultTime1: 60,
      defaultTime2: 60,
      on1: false,
      on2: false
    })
  }
  // 计算安全等级
  getUserMessage = (obj) => {
    let annotation = {
      sms: 0.2,
      email: 0.2,
      google: 0.2,
      verify: 0.4
    }
    let len = annotation.sms * !!obj.sms + annotation.email * !!obj.email + annotation.google * !!obj.google + annotation.verify * !!obj.verify;
    if (len < 0.5) {
      this.setState({
        intensity: "weak"
      })
    } else if (len >= 0.5 && len < 1) {
      this.setState({
        intensity: "medium"
      })
    } else {
      this.setState({
        intensity: 'strong'
      })
    }
  }
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
  changeNav(val) {
    this.setState({
      defaultNav: val
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer1)
    clearInterval(this.state.timer2)
  }
  render() {
    let { veribleDialog, on1, on2, defaultTime1, defaultTime2, intensity, switchType, authBtn, defaultNav } = this.state;

    let { member, intl } = this.props;
    let { sms, verify, email, google, phone, sn, nickname, bank, ali, wechat } = member
    if (!member) {
      return false;
    }
    if (sms !== null) {
      phone = this.ellipsisPhone(phone + '')
    }
    if (email) {
      email = this.ellipsisEmail(email)
    }
    return (
      <div className="personal">
        <Header />
        <div className="personal-center">
          <div className="personal-header">
            <h1 className="font24 headcolor">{nickname}</h1>
            <ul className="personal-nav">
              <li className={defaultNav=== "message"?"activeli":""} onClick={this.changeNav.bind(this, "message")}>{intl.formatMessage({id: "center-nav-1"})}</li>
              <li className={defaultNav=== "verify"?"activeli":""} onClick={this.changeNav.bind(this, "verify")}>{intl.formatMessage({id: "center-nav-2"})}</li>
              <li className={defaultNav=== "security"?"activeli":""} onClick={this.changeNav.bind(this, "security")}>{intl.formatMessage({id: "center-nav-3"})}</li>
              <li className={defaultNav=== "loghistory"?"activeli":""} onClick={this.changeNav.bind(this, "loghistory")}>{intl.formatMessage({id: "center-nav-4"})}</li>
            </ul>
          </div>
          <hr />
          <div className="personal-verify">
            {
              defaultNav === "message" ? <div className="my-message">
                <ul className="message-ul">
                  <li>
                    <span>{intl.formatMessage({ id: "center-account" })}</span><span className="black60">{nickname}</span>
                  </li>
                  <li><span>{intl.formatMessage({ id: "center-phone" })}</span>
                    {
                      sms === null ? <span className="maingreen"><Link className="maingreen" to="/setphone">{intl.formatMessage({ id: "center-security-table-setting" })}</Link></span> : <span className="black60">{phone}</span>
                    }
                  </li>
                  <li><span className="invite">{intl.formatMessage({ id: 'invite' })}: </span><span>{sn}</span></li>
                </ul>
              </div> : null
            }
            {
              defaultNav === "verify" ? <div className="verify">
                <ul className="verify-ul">
                  <li>
                    <div className="spans">
                      <span>{intl.formatMessage({ id: "identity-certification" })}</span>
                      <span>{intl.formatMessage({ id: "center-senior-" + verify + "" })}</span>
                    </div>
                    <Link to="/certification">{intl.formatMessage({id: "center-verify-action"})}</Link>
                  </li>
                  <li>
                    <div className="spans">
                      <span>{intl.formatMessage({ id: "senior-certification" })}</span>
                      <span>[{intl.formatMessage({ id: "setcny-tab3" })}：{intl.formatMessage({ id: "center-senior-" + bank + "" })}]</span>
                      <span>，[{intl.formatMessage({ id: "setcny-tab1" })}：{intl.formatMessage({ id: "center-senior-" + ali + "" })}]，</span>
                      <span>[{intl.formatMessage({ id: "setcny-tab2" })}：{intl.formatMessage({ id: "center-senior-" + wechat + "" })}]</span>
                    </div>
                    <Link to="/setcny">{intl.formatMessage({id: "center-verify-setting"})}</Link>
                  </li>
                </ul>
              </div> : null
            }
            {
              defaultNav === "security" ? <div className="security-list">
                <ul className="security-ul">
                  <li>
                    <span className="black60 font16">{intl.formatMessage({ id: "center-security-table-txt1-left" })}</span>

                    <span className="maingreen"><i className="iconfont icon-au-success"></i></span>

                    <span className="font12">
                      <span className="black38">{intl.formatMessage({ id: "center-security-table-txt1-left" })}</span>
                      <span className="schedule">
                        <span className={`schedule-box ${intensity}`}></span>
                      </span>
                      {
                        intensity && <span className="mainred">{intl.formatMessage({ id: "center-security-" + intensity + "" })}</span>
                      }
                    </span>
                    <span></span>
                  </li>
                  <li>
                    <span className="black60 font16">{intl.formatMessage({ id: "center-security-table-th1" })}</span>
                    <span className="maingreen">
                      <i className="iconfont icon-au-success"></i>
                    </span>
                    <span className="font12">
                      <span className="font12 black38">
                        {intl.formatMessage({ id: "center-security-tbale-txt1" })}
                      </span>
                    </span>
                    <span className="maingreen"><Link className="maingreen" to="/changepass">{intl.formatMessage({ id: "center-security-table-change" })}</Link></span>
                  </li>
                  <li>
                    <span className="black60 font16">
                      {intl.formatMessage({ id: "center-security-table-th2" })}
                    </span>
                    <span className="maingreen">
                      {
                        email ? <span className="maingreen"><i className="iconfont icon-au-success"></i></span> : <span className="nosuc"><i className="nosuc iconfont icon-au-warning"></i></span>
                      }
                    </span>
                    <span className="font12 black38">
                      {intl.formatMessage({ id: "center-security-table-txt2" })}
                    </span>
                    <span className="black60">
                      {
                        email ?
                          email :
                          <span className="maingreen" onClick={this.toVerifyEmaild}>{intl.formatMessage({ id: "center-security-table-setting" })}</span>
                      }
                    </span>
                  </li>
                  <li>
                    <span className="font16 black60">{intl.formatMessage({ id: "center-security-table-th3" })}</span>
                    <span className="maingreen">
                      {
                        sms !== null ? <span className="maingreen"><i className="iconfont icon-au-success"></i></span> : <span className="nosuc"><i className="nosuc iconfont icon-au-warning"></i></span>
                      }
                    </span>
                    <span className="font12 black38">
                      {intl.formatMessage({ id: "center-security-table-txt3" })}
                    </span>
                    {
                      sms !== null ? <span>
                        <span className="black60">{phone}</span>
                        <span className="maingreen"><Link className="maingreen" to="/changephone">{intl.formatMessage({ id: "center-security-table-change" })}</Link></span>
                        <span>
                          <Switch onChange={this.changeSwitch.bind(this, 'phone')} checked={!!sms} checkedChildren={intl.formatMessage({ id: "center-security-on" })} unCheckedChildren={intl.formatMessage({ id: "center-security-off" })} defaultChecked />
                        </span>
                      </span>
                        :
                        <Link className="phone-set maingreen" to="/setphone">{intl.formatMessage({ id: "center-security-table-setting" })}</Link>
                    }
                  </li>
                  <li>
                    <span className="font16 black60">{intl.formatMessage({ id: "center-security-table-th4" })}</span>

                    {
                      google !== null ? <span className="maingreen"><i className="iconfont icon-au-success"></i></span> : <span className="nosuc"><i className="nosuc iconfont icon-au-warning"></i></span>
                    }

                    <span className="black38 font12">
                      {intl.formatMessage({ id: "center-security-table-txt4" })}
                    </span>
                    <span className="maingreen">
                      {
                        google !== null ? <span>
                          <span className="black60">{google}</span>
                          <span className="maingreen email-set"><Link className="maingreen" to="/resetgoogle">{intl.formatMessage({ id: "center-security-table-change" })}</Link></span>
                          <span>
                            <Switch onChange={this.changeSwitch.bind(this, 'google')} checked={!!google} checkedChildren={intl.formatMessage({ id: "center-security-on" })} unCheckedChildren={intl.formatMessage({ id: "center-security-off" })} defaultChecked />
                          </span>
                        </span> : <Link to="/gaauth">{intl.formatMessage({ id: "center-security-table-setting" })}</Link>
                      }
                    </span>
                  </li>
                </ul>
              </div> : null
            }
            {
              defaultNav === "loghistory" ? <LoginHistory intl={intl} /> : null
            }
          </div>

        </div>
        {
          veribleDialog ? <div className="personal-dialog" onClick={this.onHide}>
            <div className="dialog-authentication" onClick={this.onStop}>
              <Icon type="close" className="close" onClick={this.onHide} />
              <h1 className="font20 black87">{intl.formatMessage({ id: "center-dialog-title" })}</h1>
              {
                switchType !== 'google' && google ? <p>
                  <input className="borderblack12" ref="googlecode" type="text" placeholder={intl.formatMessage({ id: "center-dialog-google-placeholder" })} />
                  {/* <button className={`borderblack12 send ${on1 ? 'already-send' : 'not-send'}`} onClick={this.onSend1.bind(this, 'google')} disabled={on1}>{!on1 ? intl.formatMessage({ id: "center-dialog-send" }) : defaultTime1 + 's'}</button> */}
                </p> : ''
              }
              {
                switchType !== "phone" && sms ? <p>
                  <input className="borderblack12" ref="smscode" type="text" placeholder={intl.formatMessage({ id: "center-dialog-sms-placeholder" })} />
                  <button className={`borderblack12 send ${on1 ? 'already-send' : 'not-send'}`} onClick={this.onSend1.bind(this)} disabled={on1}>{!on1 ? intl.formatMessage({ id: "center-dialog-send" }) : defaultTime1 + 's'}</button>
                </p> : ''
              }
              {
                email ? <p>
                  <input className="borderblack12" ref="emailcode" type="text" placeholder={intl.formatMessage({ id: "center-dialog-email-placeholder" })} />
                  <button className={`borderblack12 send ${on2 ? 'already-send' : 'not-send'}`} onClick={this.onSend2.bind(this)} disabled={on2}>{!on2 ? intl.formatMessage({ id: "center-dialog-send" }) : defaultTime2 + 's'}</button>
                </p> : null

              }
              <button disabled={authBtn} className="confirm btngreenhover greenbackground borderblack12" onClick={this.toSubmitCode}>{intl.formatMessage({ id: "center-dialog-btn" })}</button>
            </div>
          </div> : ''
        }
        <Footer />
      </div>
    )
  }
}

export default Personal