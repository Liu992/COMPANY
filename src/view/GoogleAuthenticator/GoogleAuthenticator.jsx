import React, { Component } from 'react';
import './GoogleAuthenticator.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Link } from 'react-router-dom';
import { message, Icon } from 'antd';
import { connect } from 'react-redux';
import sign from '../../store/action/signAction';
import * as server from '../../service/personal';

const QRCode = require('qrcode.react');

const mapStateToprops = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToprops)

class GoogleAuthenticator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secret: "",
      googlecodeBtn: false,
      tipOn: false
    }
  }
  componentDidMount() {
    server.searchSecret()
      .then(res => {
        this.setState({
          secret: res.otpSecret
        })
      })
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
  subCode = () => {
    let { intl } = this.props;
    if (!this.refs.googlecode.value) {
      return false
    }
    this.setState({
      googlecodeBtn: true
    })
    server.bindGoogle(this.refs.googlecode.value)
      .then(res => {
        this.setState({
          googlecodeBtn: false
        })
        if (res.isSuccess) {
          let newMessage = {
            isLogin: true,
            member: {
              ...this.props.member,
              google: true
            }
          }
          this.props.dispatch(sign(newMessage))
          message.success(intl.formatMessage({ id: "setgoogle-bind-success" }))
          this.setState({
            tipOn: false
          })
          this.props.history.push('/personal')
          return false;
        } else {
          this.setState({
            tipOn: true
          })
        }
      })
    // 清空input框
    // this.refs.googlecode.value = ''
  }
  render() {
    let { intl, member } = this.props;
    let { secret, tipOn, googlecodeBtn } = this.state;
    // let user = window.localStorage.getItem('username');
    // console.log("otpauth://totp/" + user + "?secret=" + secret + "&issuer=Aubitex")
    return (
      <div className="googleauthenticator">
        <Header />
        <div className="googleauthenticator-center">
          <h1 className="googleauthenticator-header font24 headcolor"><span>{intl.formatMessage({ id: "setgoogle-title" })}</span></h1>
          <hr />
          <div className="googleauthenticator-list">
            <ul>
              <li>
                <button className="serial">{intl.formatMessage({id: "setgoogle-serial-1"})}</button>
                <div className="cont">
                  <h2>{intl.formatMessage({ id: "setgoogle-small-title1" })}</h2>
                  <p className="font16 black60"><b>IOS</b><span> {intl.formatMessage({ id: "setgoogle-small-txt1-2" })} </span><b>{intl.formatMessage({ id: "setgoogle-small-txt1-3" })}</b><span> {intl.formatMessage({ id: "setgoogle-small-txt1-4" })}</span></p>
                </div>
                <div className="btn">
                  <a className="tag maingreen" rel="noopener noreferrer" target="_blank" href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">{intl.formatMessage({ id: "setgoogle-small-1-btn1" })}</a>
                  <a className="tag maingreen" target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">{intl.formatMessage({ id: "setgoogle-small-1-btn2" })}</a>
                </div>
              </li>
              <li>
                <button className="serial">{intl.formatMessage({id: "setgoogle-serial-2"})}</button>
                <div className="code">
                  {/* <img src={require('../../assets/image/wechat.png')} alt=""/> */}
                  <QRCode className="imgcode" size={128} value={"otpauth://totp/" + member.nickname + "?secret=" + secret + "&issuer=TOP_GLOBAL"} />
                  <div className="copy">
                    <span className="copy-title"><Icon type="caret-left" />{intl.formatMessage({id: "setgoogle-2-qrcode"})}</span>
                    <div className="codebox">
                      <span>{intl.formatMessage({id: "setgoogle-2-pass"})}</span>
                      <span style={{fontSize: "12px", color:"#2277CC"}} ref="copyadredd">{secret}</span>
                      <img style={{cursor:"pointer"}} src={require("../../assets/image/copy.svg")} alt="" onClick={this.onCopy}/>
                    </div>
                  </div>
                  <textarea id="input" ref="inp" defaultValue="..."></textarea>
                  {/* <span className="address black60"><span ref="copyadredd">{secret}</span> <button className="maingreen" onClick={this.onCopy}>{intl.formatMessage({ id: "setgoogle-copy-btn" })}</button></span> */}
                </div>
                <div className="cont">
                  <h2>{intl.formatMessage({id: "setgoogle-2-title"})}</h2>
                  <p className="font16">{intl.formatMessage({id: "setgoogle-2-title2"})}</p>
                  <p className="font14 black60 notice">
                    <span>{intl.formatMessage({id: "setgoogle-2-content-1"})}</span>
                    <span>{intl.formatMessage({id: "setgoogle-2-content-2"})}</span>
                    <span>{intl.formatMessage({id: "setgoogle-2-content-3"})}</span>
                  </p>
                </div>
              </li>
              <li>
                <button className="serial">{intl.formatMessage({id: "setgoogle-serial-3"})}</button>
                <div className="cont">
                  <p className="cont black60 font16" style={{color: "#333"}}><span>{intl.formatMessage({ id: "setgoogle-small-txt3" })}</span></p>
                </div>
                <div className="sub">
                  <input type="text" ref="googlecode" className="borderblack12" placeholder={intl.formatMessage({ id: "setgoogle-small-input-placeholder" })} />
                  {
                    tipOn ? <div className="errtip font12 mainred"><i className="font10 iconfont icon-au-warning"></i> {intl.formatMessage({ id: "error-tip-code" })}</div> : null
                  }
                  <button onClick={this.subCode} disabled={googlecodeBtn} className="greenbackground btngreenhover borderblack12">{intl.formatMessage({ id: "setgoogle-small-bingding" })}</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default GoogleAuthenticator