import React, { Component } from 'react';
import './ChangePass.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import Footer from '@/component/Footer';
import { connect } from 'react-redux';
import util from '../../utils/util.js';
import * as server from '../../service/personal';
const FormItem = Form.Item;
const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class ChangePass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      on: false,
      defaultTime: 60,
      errtip: false,
      errCodeTip: false,
      passStrength: false
    }
  }
  handleSubmit = (e) => {
    let { intl } = this.props;
    this.setState({
      errtip: false
    })
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
        if (!reg.test(values.confirm)) {
          this.setState({
            passStrength: true
          })
          return false;
        }
        this.setState({
          passStrength: false
        })
        server.changepass(values)
          .then(res => {
            if (res.isSuccess) {
              this.setState({
                errtip: false,
                errCodeTip: false
              })
              util.removeCookie('Authorization')
              message.success(intl.formatMessage({ id: "changepass-tip-success" }))
              window.location.href = '/sign/in';
            } else {
              if (res.message === '短信验证码错误') {
                this.setState({
                  errCodeTip: true
                })
              } else {
                this.setState({
                  errtip: true
                })
              }
            }
          })
      }
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    let { intl } = this.props;
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: "changepass-password-inconsistent" }));
    } else {
      callback();
    }
  }
  onSend = () => {
    server.sendSMS()
      .then(res => {
        // console.log(res)
      })
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
  render() {
    const { getFieldDecorator } = this.props.form;
    let { on, defaultTime, errtip, errCodeTip,passStrength } = this.state;
    let { intl, member } = this.props;
    return (
      <div className="changepass">
        <Header />
        <div className="changepass-center">
          <h1 className="changepass-header font24 headcolor"><span>{intl.formatMessage({ id: "changepass-title" })}</span></h1>
          <div className="changepass-form">
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('passwordold', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changepass-input1-null" }), whitespace: true }],
                })(
                  <Input type="password" placeholder={intl.formatMessage({ id: "changepass-input1-name" })}/>
                )}
              </FormItem>
              {
                errtip ? <div className="errtip font12 mainred"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "changepass-tip-fail" })}</div> : null
              }
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: intl.formatMessage({ id: "changepass-input2-null" }),
                  }, {
                    validator: this.validateToNextPassword,
                  }],
                })(
                  <Input type="password" placeholder={intl.formatMessage({ id: "changepass-input2-name" })}/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: intl.formatMessage({ id: "changepass-input3-null" }),
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "changepass-input3-name" })}/>
                )}
              </FormItem>
              {
                passStrength?<div className="errtip font12 mainred">{intl.formatMessage({id: "error-tip-pass-short"})}</div>: null
              }
              {
                member.sms ? <FormItem className="captcha">
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: intl.formatMessage({ id: "changepass-input4-null" }) }],
                  })(
                    <Input placeholder={intl.formatMessage({ id: "changepass-input4-name" })}/>
                  )}
                  <Button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "changepass-send" }) : defaultTime + 's'}</Button>
                </FormItem> : null
              }
              {
                errCodeTip ? <div className="errtip font12 mainred"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-smscode" })}</div> : null
              }
              <FormItem>
                <button className="btnsub borderblack12 greenbackground btngreenhover">{intl.formatMessage({ id: "changepass-update-pass" })}</button>
              </FormItem>
            </Form>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(ChangePass);
export default WrappedRegistrationForm