import React, { Component } from 'react';
import './Header.scss';
import { Select, Menu, Dropdown, Icon, message } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import utils from '../../utils/util.js';
import sign from '../../store/action/signAction';
import socket from 'socket.io-client';
import * as service from '../../service/marketService';
import marketAction from '@/store/action/marketAction.js';
import klineAction from '@/store/action/klineAction.js';

const Option = Select.Option;
const mapStateToProps = (state) => {
  return {
    isLogin: state.signAction.isLogin,
    member: state.signAction.member,
    markets: state.marketAction.markets
  }
}
@withRouter
@connect(mapStateToProps)
class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultLang: 'zh',
      defaultLog: false,
      markets: [],
    }
    window.gon = {};
    gon.market = this.state.market;
    const wsUrl = window.location.hostname === 'localhost' ? 'http://192.168.1.63:9004' : "";
    const client = socket(wsUrl);
    window.ws = client;
  }
  componentDidMount() {
    this.init()
    this.onReconnect()
    this.changeLang()
  }
  changeLang = () => {
    if (!window.localStorage.getItem('lang')) {
      return false;
    }
    if (window.localStorage.getItem('lang') === 'zh') {
      document.title = "环球交易所"
      this.setState({
        defaultLang: "zh"
      }, () => {
        document.title = "环球交易所"
      });
    } else {
      this.setState({
        defaultLang: window.localStorage.getItem('lang')
      }, () => {
        document.title = "company"
      });
    }
  }
  getCoin = (markets) => {
    let config = {
      type: 'kline',
      period: "1440min",
      from: new Date() * 1 - 864000000,         // 开始时间戳
      to: new Date() * 1,             // 结束时间戳
      market: "btceth"
    };
    let obj = {};
    for (let i = 0; i < markets.length; i++) {
      config.market = markets[i].code;
      window.ws.emit('kline', config);
      obj[markets[i].code] = "";
    }
    let num = 0;
    window.ws.on("k_data", (data) => {
      if (num < markets.length) {
        obj[markets[num].code] = data
        if (num === (markets.length - 1)) {
          this.props.dispatch(klineAction(obj))
        }
      }
      num++;
    })
  }
  init = () => {
    service.init("btceth").then((data) => {
      gon.market = data.market;
      this.getCoin(data.markets)
      this.props.dispatch(marketAction({
        markets: data.markets,
        tickers: data.tickers,
        marketPrices: data.marketPrices
      }))
    });
  }
  onReconnect = () => {
    //error 10 stop
    window.ws.on('reconnect_attempt', (attemptNumber) => {
      if (attemptNumber > 10) {
        window.ws.close();
      }
    });
  }
  handleChange = (value) => {
    this.setState({
      defaultLang: value
    }, () => {
      if (value === 'en') {
        document.title = "TOP GLOBAL"
      } else {
        document.title = "环球交易所"
      }
      window.localStorage.setItem('lang', value)
      window.location.reload()
    });
  }
  // 退出登录
  onExit = () => {
    let { intl } = this.props;
    utils.fetch({
      url: "/api/sign/out",
      method: "get",
    }).then(res => {
      if (res.isSuccess) {
        utils.removeCookie('Authorization');
        this.props.dispatch(sign({
          isLogin: false,
          member: {}
        }))
        this.props.history.replace('/sign/in');
      } else {
        message.error(intl.formatMessage({ id: "error-tip-loginout" }))
      }
    })
  }
  toRouter = (path) => {
    this.props.history.push(path)
  }
  changeLog() {
    this.setState({
      defaultLog: !this.state.defaultLog
    })
  }
  render() {
    let { isLogin, member } = this.props;
    let { defaultLang, defaultLog } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <NavLink to="/personal"><FormattedMessage id="header-nav-center" /></NavLink>
        </Menu.Item>
        <Menu.Item onClick={this.onExit}>
          <NavLink to="#"><FormattedMessage id="header-nav-exit" /></NavLink>
        </Menu.Item>
      </Menu>
    );
    return (
      // logo
      <div className="header">
        <div className="h-l">
          <div className="logo">
            <NavLink to="/" style={{ fontSize: "20px" }}>
              {/* <img src={require('../../assets/image/2.png')} alt="" /> */}
              COMPANY
            </NavLink>
          </div>
          {/* nav  */}
          <div className="aubitex-nav">
            <ul className="aubitex-nav-ul">
              <li><NavLink to="/"><FormattedMessage id="header-nav-home" /></NavLink></li>
              <li><a href="/tradingmarket"><FormattedMessage id="header-nav-tradingmarket" /></a></li>
              <li><NavLink to="/fiatdeal"><FormattedMessage id="header-c-c" /></NavLink></li>
              <li><NavLink to="/news"><FormattedMessage id="header-nav-news" /></NavLink></li>
              <li><NavLink to="/share"><FormattedMessage id="header-share" /></NavLink></li>
              {
                isLogin ? <li><NavLink to="/createad"><FormattedMessage id="header-createad" /></NavLink></li> : null
              }

              {
                isLogin ? <li><NavLink to="/myorder"><FormattedMessage id="header-myorder" /></NavLink></li> : null
              }
            </ul>
          </div>
        </div>
        <div className="h-r">
          {/* login */}
          {
            !isLogin ? <div className="aubitex-login">
              <button onClick={this.toRouter.bind(this, '/sign/in')}><FormattedMessage id="login-sign" /></button>
              <button className="activebtn" onClick={this.toRouter.bind(this, '/sign/up')}><FormattedMessage id="login-register" /></button>
            </div>
              :
              <div className="aubitex-login islogin" id="islogin">
                <button onClick={this.toRouter.bind(this, '/myassets')}><FormattedMessage id="header-login-assets" /></button>
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('islogin')}
                >
                  <button className="username"><NavLink to="#" className="ant-dropdown-link">{member.nickname}<Icon type="down" /></NavLink></button>
                </Dropdown>
              </div>
          }
          {/* language */}
          <div className="language" id="lang">
            <Select
              value={defaultLang}
              defaultValue="zh"
              onChange={this.handleChange}
              getPopupContainer={() => document.getElementById('lang')}
            >
              <Option value="en">English</Option>
              <Option value="zh">简体中文</Option>
              <Option value="ko">한국어</Option>
              <Option value="zh-Hant">繁体</Option>
            </Select>
            <img src={require("../../assets/image/languages/en.png")} alt="" />
          </div>
        </div>

        <div className={`dialog-hide ${defaultLog ? "dialog-show" : ""}`} onClick={this.changeLog.bind(this)}></div>
        <div className={`dialog-content ${defaultLog ? "dialog-show" : ""}`}>
          <div className="content-top">
            <Icon type="user" />
            {
              !isLogin ?
                <div className="user">
                  <NavLink to="/sign/up"><FormattedMessage id="login-register" /></NavLink>
                  <NavLink to="/sign/in"><FormattedMessage id="login-sign" /></NavLink>
                </div>
                :
                <div className="user">
                  <span>{member.nickname}</span>
                </div>
            }

          </div>
          <div className="content-list">
            <ul>
              <li onClick={this.changeLog.bind(this)}><NavLink to="/"><FormattedMessage id="header-nav-home" /></NavLink></li>
              <li onClick={this.changeLog.bind(this)}><a href="/tradingmarket"><FormattedMessage id="header-nav-tradingmarket" /></a></li>
              <li onClick={this.changeLog.bind(this)}><NavLink to="/fiatdeal"><FormattedMessage id="header-c-c" /></NavLink></li>
              <li onClick={this.changeLog.bind(this)}><NavLink to="/news"><FormattedMessage id="header-nav-news" /></NavLink></li>
              <li onClick={this.changeLog.bind(this)}><NavLink to="/share"><FormattedMessage id="header-share" /></NavLink></li>
              {
                isLogin ? <li onClick={this.changeLog.bind(this)}><NavLink to="/createad"><FormattedMessage id="header-createad" /></NavLink></li> : null
              }
              {
                isLogin ? <li onClick={this.changeLog.bind(this)}><NavLink to="/myorder"><FormattedMessage id="header-myorder" /></NavLink></li> : null
              }
              {
                isLogin ? <li onClick={this.changeLog.bind(this)}><NavLink to="/personal"><FormattedMessage id="header-nav-center" /></NavLink></li> : ""
              }
              {
                isLogin ? <li onClick={this.changeLog.bind(this)}><NavLink to="/myassets"><FormattedMessage id="header-login-assets" /></NavLink></li> : ""
              }
              {
                isLogin ? <li onClick={this.onExit}><NavLink to="#"><FormattedMessage id="header-nav-exit" /></NavLink></li> : ""
              }
            </ul>
            <h3>语言</h3>
            <div className="lang" id="smalllang">
              <Select
                value={defaultLang}
                defaultValue="zh"
                onChange={this.handleChange}
                getPopupContainer={() => document.getElementById('smalllang')}
              >
                <Option value="en">English</Option>
                <Option value="zh">简体中文</Option>
                <Option value="ko">한국어</Option>
                <Option value="zh-Hant">繁体</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="smallheader">


          <Icon className="menu" type="bars" onClick={this.changeLog.bind(this)} />
        </div>
      </div>
    )
  }
}

export default injectIntl(Header)