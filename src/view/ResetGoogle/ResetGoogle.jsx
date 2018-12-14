import React, { Component } from 'react';
import './ResetGoogle.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import util from '../../utils/util';
import { connect } from 'react-redux';

const mapStateToprops = (state) => {
  return {
    member: state.signAction.member
  }
}
const QRCode = require('qrcode.react');
@connect(mapStateToprops)
class ResetGoogle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on: false,
      defaultTime: 60,
      secret: '',
      disabledSend: false
    }
  }
  componentDidMount() {
    util.fetch({
      url: '/api/auth/totp/secret',
      method: 'get'
    })
      .then(res => {
        this.setState({
          secret: res.otpSecret
        })
      })
      .catch(err => {
        throw err
      })
  }
  onSend = () => {
    let { intl } = this.props;
    this.setState({
      on: true,
      defaultTime: 60
    }, () => {
      this.stateTime()
    })
    util.fetch({
      url: '/api/auth/sendemail',
      method: 'post',
      data: {
        type: 'update'
      }
    })
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: "center-dialog-send-success" }))
        } else {
          message.error(intl.formatMessage({ id: "center-dialog-send-fail" }))
        }
      })
  }
  subSend = () => {
    let { googleCode, emailCode } = this.refs;
    this.setState({
      disabledSend: true
    }, () => {
      util.fetch({
        url: '/api/auth/totp/bind',
        method: 'post',
        data: {
          type: 'update',
          GAcode: googleCode.value,
          emailCode: emailCode && emailCode.value
        }
      })
        .then(res => {
          if (res.isSuccess) {
            this.props.history.push('/personal')
          } else {
            if (res.code == 1000) {
              message.error("谷歌验证码输入错误")
            }
            if (res.code == 1001) {
              message.error("邮箱验证码输入错误")
            }
          }
          this.setState({
            disabledSend: false
          })
        })
    })
  }
  stateTime = () => {
    let { defaultTime } = this.state;
    let num = 0;
    let time1 = setInterval(() => {
      num++;
      this.setState({
        defaultTime: defaultTime - num
      }, () => {
        if (this.state.defaultTime <= 0) {
          this.setState({
            on: false
          }, () => {
            clearInterval(time1)
          })
        }
      })
    }, 1000)
  }
  onCopy = () => {
    let { intl } = this.props;
    let text = this.refs.copyadredd.innerHTML;
    let input = this.refs.inp;
    input.value = text; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand("copy"); // 执行浏览器复制命令
    message.success(intl.formatMessage({ id: "myassets-message-copy" }))
  }
  render() {
    let { intl, member } = this.props;
    let { on, defaultTime, secret, disabledSend } = this.state;
    // console
    return (
      <div className="resetgoogle">
        <Header />
        <div className="resetgoogle-center">
          <div className="resetgoogle-list">
            <div className="resetgoogle-form">
              <h1 className="resetgoogle-title">{intl.formatMessage({id: "reset-title"})}</h1>
              <input type="text" className="borderblack12" ref="googleCode" placeholder={intl.formatMessage({ id: "reset-input1-name" })} />
              {
                member.email ? <p>
                  <input type="text" className="borderblack12" ref="emailCode" placeholder={intl.formatMessage({ id: "reset-input2-name" })} />
                  <button className={`maingreen send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "reset-send" }) : defaultTime + 's'}</button>
                </p> : null
              }
              <button onClick={this.subSend} disabled={disabledSend} className="greenbackground borderblack12 btngreenhover">{intl.formatMessage({ id: "reset-btn" })}</button>
            </div>
            <div className="code">
              <div className="qrcode-img">
                <QRCode className="imgcode" size={190} value={"otpauth://totp/" + member.nickname + "?secret=" + secret + "&issuer=TOP_GLOBAL"} />
              </div>
              <textarea id="input" ref="inp" defaultValue="..."></textarea>
              <span className="address black60"><span ref="copyadredd">{secret}</span>
                <button className="maingreen" onClick={this.onCopy}>
                  <img src={require("../../assets/image/copy.svg")} alt="" />
                  {intl.formatMessage({ id: "setgoogle-copy-btn" })}
                </button></span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}


export default ResetGoogle