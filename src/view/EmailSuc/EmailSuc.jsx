import React, { Component } from 'react';
import './EmailSuc.scss';
import * as server from '../../service/registerService';

class EmailSuc extends Component {
  componentWillMount () {
    let code = window.location.href.split('suc/')[1];
    server.emailVerify(code)
    .then(res => {
      if (!res.isSuccess) {
        this.props.history.replace({
          pathname: '/sign/in',
          state: 'not_sign'
        })
      }
    })
  }
  componentDidMount () {
    
  }
  toPersonal = () => {
    this.props.history.replace('/sign/in')
  }
  render() {
    let { intl } = this.props;
    return (
      <div className="email-suc">
        <h1 className="email-suc-header">
          {intl.formatMessage({id : "activation-title"})}
        </h1>
        <p className="email-suc-content">
          {intl.formatMessage({id : "activation-tip"})}
        </p>
        <button className="btngreenhover borderblack12" onClick={this.toPersonal}>{intl.formatMessage({id : "activation-btn"})}</button>
      </div>
    )
  }
}
export default EmailSuc