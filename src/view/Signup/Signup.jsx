import React, { Component } from 'react';
import './Signup.scss';
import { NavLink } from 'react-router-dom';
import { Form, Input, Button, Select, Tooltip, Checkbox, message } from 'antd';
import * as service from '../../service/loginService';


const Option = Select.Option;
const FormItem = Form.Item;
class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on: false,
      defaultTime: 60,
      timer: null,
      confirmDirty: false,
      visible: false,
      subBtn: false,
      errorType: '',
      checked: true,
      prefix: '86',
      tabType: 'email',
      binded: false,
      phoneCode: ""
    };
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    let { intl } = this.props;
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: "register-not-pass-match" }));
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  changeVisible(on) {
    this.setState({
      visible: on
    })
  }
  onChangeCheck = (event) => {
    this.setState({
      checked: event.target.checked
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  changePhone = (e) => {
    this.setState({
      phone: e.target.value
    })
  }
  toBack() {
    let { history } = this.props;
    history.go(-1)
  }
  // 邮箱注册
  handleSubmit = (e) => {
    let { intl } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      if (!err) {
        if (!this.state.checked) {
          message.error(intl.formatMessage({ id: "check-not" }));
          return false;
        }
        this.setState({
          subBtn: true
        })
        if (!reg.test(values.confirm)) {
          this.setState({
            errorType: "pwdShort",
            subBtn: false
          })
          return false;
        }
        service.signup(values).then((data) => {
          this.setState({
            subBtn: false
          })
          if (data.isSuccess) {
            message.success(intl.formatMessage({ id: "register-message-success" }));
            if (values.phone) {
              this.props.history.push("/sign/in")
              return false;
            } else {
              window.localStorage.setItem('email', values.email)
              this.props.history.push("/sign/email");
              return false;
            }
          } else {
            if (data.message === '验证码错误') {
              message.error(intl.formatMessage({ id: "error-tip-smscode" }))
            }
          }
          if (data.error) {
            if (data.error.userRepeat) {
              this.setState({
                errorType: 'userRepeat'
              })
            }
            this.setState({
              timer: setTimeout(() => {
                this.setState({
                  errorType: ""
                })
              }, 3000)
            })
            message.error(intl.formatMessage({ id: "register-message-error" }))
          }
        })
      } else {
        this.setState({
          subBtn: false
        })
      }
    });
  }
  changeCode = (e) => {
    this.setState({
      phoneCode: e.target.value
    })
  }
  handleChange = (tab) => {
    this.setState({
      tabType: tab,
      binded: false
    })
  }
  // 发送手机验证码
  onSend = () => {
    let { intl } = this.props;
    let { phone, prefix } = this.state;
    this.setState({
      binded: false
    })
    if (!phone) {
      return false;
    }
    if (!(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone))) {
      message.error(intl.formatMessage({ id: "not-phone" }))
      return false
    }
    service.sendSMS({ phone, prefix })
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: "success-tip-sms" }))
          this.setState({
            on: true,
            defaultTime: 60
          }, () => {
            this.stateTime()
          })
        }
        else {
          if (res.message === "此手机号已经绑定") {
            this.setState({
              binded: true
            })
            return false
          }
          message.error(intl.formatMessage({ id: "error-tip-sms" }))
        }
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
              on: false,
              defaultTime: 60
            })
          }
        })
      }, 1000)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { visible, subBtn, errorType, checked, prefix, tabType, on, defaultTime, binded } = this.state;
    let { intl } = this.props;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: prefix,
    })(
      <Select onChange={this.changeSelect} style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="852">+852</Option>
        <Option value="853">+853</Option>
        <Option value="82">+82</Option>
        <Option value="81">+81</Option>
        <Option value="1">+1</Option>
        <Option value="44">+44</Option>
        <Option value="65">+65</Option>
        <Option value="60">+60</Option>
        <Option value="66">+66</Option>
        <Option value="84">+84</Option>
        <Option value="63">+63</Option>
        <Option value="62">+62</Option>
        <Option value="39">+39</Option>
        <Option value="7">+7</Option>
        <Option value="64">+64</Option>
        <Option value="31">+31</Option>
        <Option value="46">+46</Option>
        <Option value="61">+61</Option>
        <Option value="380">+380</Option>
        <Option value="33">+33</Option>
        <Option value="49">+49</Option>
        <Option value="93">+93</Option>
        <Option value="355">+355</Option>
        <Option value="213">+213</Option>
        <Option value="1684">+1684</Option>
        <Option value="376">+376</Option>
        <Option value="244">+244</Option>
        <Option value="1264">+1264</Option>
        <Option value="1268">+1268</Option>
        <Option value="54">+54</Option>
        <Option value="374">+374</Option>
        <Option value="297">+297</Option>
        <Option value="43">+43</Option>
        <Option value="994">+994</Option>
        <Option value="973">+973</Option>
        <Option value="880">+880</Option>
        <Option value="1246">+1246</Option>
        <Option value="375">+375</Option>
        <Option value="32">+32</Option>
      </Select>
    );
    return (
      <div className="signup" id="signup">
        <h1 className="loginpage-content-header" style={{color: "#34A9FF", fontSize:"30px"}}>Company</h1>

        {/* 注册 */}
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            <Select
              defaultValue="email"
              onChange={this.handleChange}
              getPopupContainer={() => document.getElementById('signup')}
            >
              <Option value="email">{intl.formatMessage({id:"register-email"})}</Option>
              <Option value="phone">{intl.formatMessage({id:"register-phone"})}</Option>
            </Select>
          </FormItem>
          {
            tabType === 'email' ? <FormItem>
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: intl.formatMessage({ id: "register-not-valid-email" }),
                }, {
                  required: true, message: intl.formatMessage({ id: "register-not-email" }),
                }],
              })(
                <div id="email">
                  <Input type="email" placeholder={`${intl.formatMessage({ id: "register-such" })}：xiaobai@example.com`} onFocus={this.changeVisible.bind(this, true)} onBlur={this.changeVisible.bind(this, false)} />
                  <Tooltip
                    className="usertip"
                    placement="right"
                    title={<span>{intl.formatMessage({ id: "register-email-tip" })}</span>}
                    trigger="focus" visible={visible}
                    getPopupContainer={() => document.getElementById('email')}
                  >
                  </Tooltip>
                </div>
              )}
            </FormItem> : <FormItem>
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changephone-input1-null" }) }],
                })(
                  <Input className="phone" onChange={this.changePhone} addonBefore={prefixSelector} style={{ width: '100%' }} placeholder={intl.formatMessage({ id: "setphone-input1-name" })} />
                )}
              </FormItem>
          }
          {
            tabType === 'phone' ?
              <FormItem className="captcha">
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "setphone-input2-null" }) }],
                })(
                  <Input onChange={this.changeCode} placeholder={intl.formatMessage({ id: "forgot-authentication-input2-placeholder" })} />
                )}
                <Button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "setphone-send" }) : defaultTime + 's'}</Button>
              </FormItem>
              : ""
          }
          {
            binded ? <div className="errtip mainred font12" style={{ marginTop: '-16px' }}>{intl.formatMessage({ id: "sendSMS-binded" })}!</div> : null
          }
          {
            errorType === "userRepeat" && tabType == "email" ? <div className="mainred font12 repetitiontip"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-registered" })}</div> : null
          }
          {
            errorType === "userRepeat" && tabType == "phone" ? <div className="mainred font12 repetitiontip"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-phone-registered" })}</div> : null
          }
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: intl.formatMessage({ id: "register-not-password" }),
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" placeholder={intl.formatMessage({ id: "register-password-placeholder" })} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: intl.formatMessage({ id: "register-not-password" }),
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "register-repeat-password-placeholder" })} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('inviteCode', {
              rules: [{
                required: false,
              }],
            })(
              <Input type="text" placeholder={intl.formatMessage({ id: "invite-code" })} />
            )}
          </FormItem>
          {
            errorType === "pwdShort" ? <div className="mainred font12 repetitiontip"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-pass-short" })}</div> : null
          }
          <FormItem className="signup-btn">
            <Button type="primary" className="signup-btn-sure" htmlType="submit" disabled={subBtn}>{intl.formatMessage({ id: "register-btn" })}</Button>
          </FormItem>
          {/* <FormItem> */}
          {/* </FormItem> */}
        </Form>

        <Checkbox onChange={this.onChangeCheck} defaultChecked={checked}><span className="black60">{intl.formatMessage({ id: "register-readagreed" })}</span></Checkbox><span>《<NavLink to="/sign/agreement" target="_blank" className="maincolor toRouter"><span>{intl.formatMessage({ id: "register-agreement" })}</span></NavLink>》</span>

        <div className="tosign">
          <span className="black60">{intl.formatMessage({ id: "register-have-already-account" })}</span>
          <NavLink to="/sign/in" className="maincolor toRouter"><span> {intl.formatMessage({ id: "register-tosignin" })}</span></NavLink>
        </div>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(Signup);
export default WrappedRegistrationForm
