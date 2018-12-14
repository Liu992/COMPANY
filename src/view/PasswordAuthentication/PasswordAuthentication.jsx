import React, { Component } from 'react';
import './PasswordAuthentication.scss';
import * as server from '../../service/forgotPassService';
import { message } from 'antd';

class PasswordAuthentication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer1: null,
      timer2: null,
      on1: false,
      defaultTime1: 60,
      on2: false,
      defaultTime2: 60,
      btnOn: false,
      phone: null,
      errtip: false
    }
  }
  componentDidMount() {
    if (this.props.location.on) {
      this.setState({
        on1: true,
        defaultTime1: 60
      }, () => {
        this.stateTime1()
      })
    }
    if (this.props.location.on && window.localStorage.getItem('hasPhone') === 'true') {
      this.onSend2();
    }
  }

  onSend1 = () => {
    let { intl } = this.props;
    let email = window.localStorage.getItem('email')
    this.setState({
      on1: true,
      defaultTime1: 60
    }, () => {
      this.stateTime1()
    })
    server.sendEmail(email)
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: "center-dialog-send-success" }))
        } else {
          message.error(intl.formatMessage({ id: "center-dialog-send-fail" }))
        }
      })
  }
  onSend2 = () => {
    let { intl } = this.props;
    this.setState({
      on2: true,
      defaultTime2: 60
    }, () => {
      this.stateTime2()
    })
    server.sendSMS(window.localStorage.getItem('email'))
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: "success-tip-sms" }))
        } else {
          message.error(intl.formatMessage({ id: "error-tip-sms" }))
        }
      })
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
  toChangePass = () => {
    if (this.refs.smscode) {
      if (!this.refs.smscode.value) {
        return false;
      }
    } else {
      if (!this.refs.emailCode.value) {
        return false;
      }
    }
    this.setState({
      btnOn: true,
      errtip: false
    });
    server.resetVerify(window.localStorage.getItem('email'), this.refs.emailCode&&this.refs.emailCode.value, this.refs.smscode&&this.refs.smscode.value)
      .then(res => {
        this.setState({
          btnOn: false
        }, () => {
          if (res.isSuccess) {
            window.localStorage.setItem('email', this.props.history.location.state)
            this.props.history.push('/sign/forgotchangepass')
          } else {
            this.setState({
              errtip: true
            })
          }
        })
      })
  }
  render() {
    let { on1, on2, defaultTime1, defaultTime2, btnOn, errtip } = this.state;
    let { intl } = this.props;
    let hasPhone = window.localStorage.getItem('hasPhone');
    let hasEmail = window.localStorage.getItem('hasEmail');
    return (
      <div className="authentication">
        <div className="authentication-box">
          <h1 className="font24 black87">{intl.formatMessage({ id: "forgot-authentication-title" })}</h1>
          {
            hasEmail === "true" ? <p>
              <input className="borderblack12 black87" ref="emailCode" type="text" placeholder={intl.formatMessage({ id: "forgot-authentication-input1-placeholder" })} />
              <button className={`borderblack12 send ${on1 ? 'already-send' : 'not-send'}`} onClick={this.onSend1} disabled={on1}>{!on1 ? intl.formatMessage({ id: "forgot-authentication-send" }) : defaultTime1 + 's'}</button>
            </p> : null
          }

          {
            hasPhone === "true" ? <p>
              <input className="borderblack12 black87" ref="smscode" type="text" placeholder={intl.formatMessage({ id: "forgot-authentication-input2-placeholder" })} />
              <button className={`borderblack12 send ${on2 ? 'already-send' : 'not-send'}`} onClick={this.onSend2} disabled={on2}>{!on2 ? intl.formatMessage({ id: "forgot-authentication-send" }) : defaultTime2 + 's'}</button>
            </p> : null
          }
          {
            errtip ? <div className="errtip font12 mainred">{intl.formatMessage({ id: "error-tip-code" })}</div> : null
          }
          <button disabled={btnOn} className="confirm btngreenhover greenbackground borderblack12" onClick={this.toChangePass}>{intl.formatMessage({ id: "forgot-user-btn" })}</button>
        </div>
      </div>
    )
  }
  componentWillUnmount() {
    clearInterval(this.state.timer1)
    clearInterval(this.state.timer2)
  }
}

export default PasswordAuthentication