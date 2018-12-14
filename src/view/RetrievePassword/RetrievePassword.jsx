import React, { Component } from 'react';
import './RetrievePassword.scss';
import * as server from '../../service/forgotPassService';

class RetrievePassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errtip: false,
      btnOn: false
    }
  }
  toAuthentication = () => {
    let {intl} = this.props;
    let {email} = this.refs;
    if (email.value) {
      this.setState({
        btnOn: true
      })
      server.sendEmail(email.value)
      .then(res => {
        this.setState({
          btnOn: false
        })
        if (res.isSuccess) {
          this.setState({
            errtip: false
          }, () => {
            window.localStorage.setItem('email', email.value)
            window.localStorage.setItem('hasPhone', res.hasPhone)
            window.localStorage.setItem('hasEmail', res.hasEmail)
            this.props.history.push({
              pathname: '/sign/authentication',
              on: true
              // state: email.value,
              // phone: res.hasPhone
            })  
          })
        }else{
          this.setState({
            errtip: true
          })
        }
      })
      
    }
  }
  render() {
    let { intl } = this.props;
    let {errtip, btnOn} = this.state
    return (
      <div className="retrievepassword">
        <h1 className="retrievepassword-header font24 black87">
          {intl.formatMessage({id : "forgot-user-title"})}
        </h1>
        <p className="retrievepassword-content black60">
          {intl.formatMessage({id : "forgot-user-content"})}
        </p>
        <input type="text" ref="email" placeholder={intl.formatMessage({id: "forgot-user-input-placeholder"})} className="borderblack12 black87"/>
        {
          errtip?<div style={{width: '310px'}} className="errtip mainred font12"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({id: "error-tip-not-register"})}</div>:null
        }
        
        <button disabled={btnOn} className="btngreenhover borderblack12 greenbackground" onClick={this.toAuthentication}>{intl.formatMessage({id : "forgot-user-btn"})}</button>
      </div>
    )
  }
}
export default RetrievePassword