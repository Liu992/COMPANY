import React, { Component } from 'react';
import './VerifyEmail.scss';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';
import * as service from '../../service/loginService';

class VerifyEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on: true,
      defaultTime: 60,
      timer: null
    }
  }
  componentDidMount() {
    this.onSend()
  }
  // 发送邮件
  onSend = () => {
    service.sendEmail(window.localStorage.getItem('email'))
    this.setState({
      on: true,
      defaultTime: 60
    }, () => {
      this.stateTime()
    })
  }
  stateTime = () => {
    let { defaultTime } = this.state;
    let num = 0;
    this.setState({
      timer: setInterval(() => {
        num++;
        this.setState({
          defaultTime: defaultTime - num
        }, () => {
          if (this.state.defaultTime <= 0) {
            clearInterval(this.state.timer)
            this.setState({
              on: false
            })
          }
        })
      }, 1000)
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  render() {
    let { on, defaultTime } = this.state;
    let { intl } = this.props;
    let email = window.localStorage.getItem('email');
    return (
      <div className="verify-email">
        <h1 className="verify-email-header">{intl.formatMessage({ id: "verifyemail-title" })}</h1>
        <p className="verify-email-content">{intl.formatMessage({ id: "verifyemail-activate-left" })} <NavLink to="#">{email}</NavLink> {intl.formatMessage({ id: "verifyemail-activate-right" })}</p>
        <div className="verify-email-tip">
          <p>
            {intl.formatMessage({ id: "verifyemail-tip" })}
          </p>
        </div>
        <Button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "verifyemail-resend-btn" }) : defaultTime + 's'}</Button>
        <div className="tosign">
          <span>{intl.formatMessage({ id: "verifyemail-bottom" })} <NavLink to="/sign/in">{intl.formatMessage({ id: "verifyemail-tosignin" })}</NavLink></span>
        </div>
      </div>
    )
  }
}

export default VerifyEmail