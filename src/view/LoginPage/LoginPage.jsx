import React, { Component } from 'react';
import './LoginPage.scss';
import { connect } from 'react-redux';
import { Input, Button, Form, Tabs, message } from 'antd';
import { NavLink } from 'react-router-dom';
import * as service from '../../service/loginService';
import * as server from '../../service/personal';
import util from '../../utils/util';
import sign from '../../store/action/signAction';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      defaultTime: 60,
      on: false,
      visible: false,
      errortip: false,
      active_key: '1',
      signBtn: false,
      userID: null,
      errCodeTip: false,
      notUserTip: false
    }
  }
  componentWillMount () {

  }
  componentDidMount() {
    if (this.props.location.state === 'not_sign') {
      this.emailerrortip();
    }
    this.isImg();
  }
  emailerrortip = () => {
    let { intl } = this.props;
    message.warning(intl.formatMessage({ id: "email-error" }))
  }
  // 是否显示图片验证码
  isImg = () => {
    if (window.localStorage.imgcode) {
      this.setState({
        showVerify: true
      }, () => {
        service.getCode().then(data => {
          this.refs.imgs.src = URL.createObjectURL(data)
        })
      })
    } else {
      this.setState({
        showVerify: false
      })
    }
  }
  changeCode() {
    service.getCode().then(data => {
      this.refs.imgs.src = URL.createObjectURL(data)
    })
  }
  changeTab = (key) => {
    this.setState({
      active_key: key,
      errCodeTip: false
    })
  }
  // 点击验证码确认
  verifyCode(type) {
    let { intl } = this.props;
    service.verifyCode(type, this.state.googleCode, this.state.smsCode)
      .then(res => {
        if (res.isSuccess) {
          let mess = intl.formatMessage({ id: "signin-message-login-success" });
          this.setState({
            visible: false,
            errCodeTip: false
          }, () => {
            message.success(mess);
            this.props.dispatch(sign({
              isLogin: true,
              member: this.state.userID
            }));
            if (this.props.location.path) {
              this.props.history.push(this.props.location.path)
              return false
            }
            this.props.history.push("/")
            return false;
          })
        } else {
          this.setState({
            errCodeTip: true
          })
        }
      })
  }
  // 发送手机验证码
  onSend = () => {
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
      on: true,
      defaultTime: 60
    }, () => {
      this.stateTime()
    })
  }
  changeSmsCode = (e) => {
    this.setState({
      smsCode: e.target.value
    })
  }
  changeGoogleCode = (e) => {
    this.setState({
      googleCode: e.target.value
    })
  }
  toHide = () => {
    this.setState({
      visible: false
    })
  }
  toStop = (event) => {
    event.stopPropagation()
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
            this.setState({
              on: false
            }, () => {
              clearInterval(this.state.timer)
            })
          }
        })
      }, 1000)
    })
  }
  // 点击登录
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let { intl } = this.props;
      if (!err) {
        this.setState({
          signBtn: true,
          errCodeTip: false,
          errortip: false,
          notUserTip: false
        })
        let { email, password, confirm } = values,
          param = {};
          param.username = email;
          param.password = password;
          param.grant_type = "password"
          param.captchaCode = confirm
        service.signin(param).then(data => {
          this.setState({
            signBtn: false
          });
          // 显示验证码
          if (data && data.error_description && data.error_description.verifyCaptchaCode == true) {
            this.setState({ showVerify: true }, () => {
              window.localStorage.setItem('imgcode', 'show');
              this.changeCode();
            });
          }
          if (data && data.access_token) {
            this.props.form.resetFields();
            window.localStorage.setItem('email', email)
            if (!data.userID.activated) {
              window.localStorage.setItem('email', email)
              this.props.history.push('/sign/email')
              return false
            }
            // 需要验证code
            if (data.userID.sms || data.userID.google) {
              this.setState({
                userID: data.userID,
                visible: true
              }, () => {
                this.props.dispatch(sign({
                  isLogin: false,
                  member: data.userID
                }));
                util.setCookie('Authorization', data.access_token, 7);
                window.localStorage.removeItem('imgcode');
              })
            } else {
              this.setState({
                errortip: false,
                showVerify: false
              }, () => {
                let mess = intl.formatMessage({ id: "signin-message-login-success" });
                util.setCookie('Authorization', data.access_token, 7);
                window.localStorage.removeItem('imgcode');
                message.success(mess);
                this.props.dispatch(sign({
                  isLogin: true,
                  member: data.userID
                }));
                if (this.props.location.path) {
                  window.location.href=this.props.location.path
                  return false
                }
                this.props.history.push("/")
                return false;
              })
            }
          } else if (data.message) {
            if (data.message === '验证码错误') {
              this.setState({
                showVerify: true,
                errtype: "codeError",
                errortip: true,
              }, () => {
                window.localStorage.setItem('imgcode', 'show');
                this.changeCode();
              });
            }
          } else if (data.error_description.error === 'pwdWrong') {
            this.setState({
              errtype: "pwdError",
              errortip: true,
            });
          } else if (data.error_description.error === "notUser") {
            this.setState({
              notUserTip: true
            })
          } else {
            message.error(intl.formatMessage({ id: "signin-message-login-error" }))
          }
        })
      }
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { visible, errortip, active_key, signBtn, errtype, errCodeTip, notUserTip, on, defaultTime } = this.state;
    let { intl, member } = this.props;
    return (
      <div className="loginpage">
        <div className={`verify-dialog ${(member.sms || member.google) && visible ? '' : 'none'}`} onClick={this.toHide}>
          <div className="verify-dialog-box" onClick={this.toStop}>
            {
              member.sms && member.google ? <Tabs activeKey={active_key} onChange={this.changeTab}>
                <TabPane tab={intl.formatMessage({ id: "signin-dialog-google-verify" })} key="1">
                  <Input onChange={this.changeGoogleCode} placeholder={intl.formatMessage({ id: "signin-dialog-verify-placeholder" })} />
                  {
                    errCodeTip ? <div className="errtip font12 mainred"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-code" })}</div> : null
                  }
                  <Button onClick={this.verifyCode.bind(this, 'GA')} className="btngreenhover">{intl.formatMessage({ id: "signin-dialog-btn" })}</Button>
                </TabPane>
                <TabPane tab={intl.formatMessage({ id: "signin-dialog-sms-verify" })} key="2">
                  <p className="sms"><Input onChange={this.changeSmsCode} placeholder={intl.formatMessage({ id: "signin-dialog-verify-placeholder" })} /><button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "signin-send" }) : defaultTime + 's'}</button></p>
                  {
                    errCodeTip ? <div className="errtip font12 mainred"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-code" })}</div> : null
                  }
                  <Button onClick={this.verifyCode.bind(this, 'phone')}>{intl.formatMessage({ id: "signin-dialog-btn" })}</Button>
                </TabPane>
              </Tabs> :
                <div className="one-verify">
                  <h1 className="font24 black87" style={{ textAlign: "center", marginBottom: "40px" }}>{!member.sms ? intl.formatMessage({ id: "signin-dialog-google-verify" }) : intl.formatMessage({ id: "signin-dialog-sms-verify" })}</h1>
                  {
                    member.sms ? <p className="sms"><Input onChange={!member.sms ? this.changeGoogleCode : this.changeSmsCode} placeholder={intl.formatMessage({ id: "signin-dialog-verify-placeholder" })} /><button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "signin-send" }) : defaultTime + 's'}</button></p> : <Input onChange={!member.sms ? this.changeGoogleCode : this.changeSmsCode} placeholder={intl.formatMessage({ id: "signin-dialog-verify-placeholder" })} />
                  }

                  {
                    errCodeTip ? <div className="errtip font12 mainred"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-code" })}</div> : null
                  }
                  <Button onClick={this.verifyCode.bind(this, member.sms ? 'phone' : 'GA')}>{intl.formatMessage({ id: "signin-dialog-btn" })}</Button>
                </div>
            }

          </div>
        </div>
        <h1 className="loginpage-content-header" style={{fontSize: "20px", fontSize: "30px", color:"rgb(52, 169, 255)"}}>Company</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                required: true, message: intl.formatMessage({ id: "login-not-name" }),
              }],
            })(
              <Input placeholder={intl.formatMessage({ id: "login-name" })} />
            )}
          </FormItem>
          {
            notUserTip ? <div className="errtip mainred font12"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "not-user" })}</div> : null
          }
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: intl.formatMessage({ id: "signin-not-password" }), whitespace: true }],
            })(
              <Input type="password" placeholder={intl.formatMessage({ id: "signin-password-placeholder" })} />
            )}
          </FormItem>
          {this.state.showVerify ?
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [{ required: true, message: intl.formatMessage({ id: "signin-not-captcha" }), whitespace: true }],
              })(
                <Input placeholder={intl.formatMessage({ id: "signin-code-img-error" })} />
              )}
              <img ref="imgs" style={{ marginLeft: '16px' }} alt="" onClick={this.changeCode.bind(this)} />
            </FormItem> :
            null
          }
          {
            errortip ? <div className="errtip mainred font12"><i className="iconfont icon-au-warning"></i>{errtype === 'codeError' ? intl.formatMessage({ id: "error-tip-code" }) : intl.formatMessage({ id: "error-tip-sign-error" })}</div> : null
          }
          <FormItem>
            <Button type="primary" disabled={signBtn} htmlType="submit" className="login-form-button">
              {intl.formatMessage({ id: "signin-btn" })}
            </Button>
          </FormItem>
        </Form>
        <div className="loginpage-forgot">
          <NavLink to="/sign/retrievepassword"><span>{intl.formatMessage({ id: "signin-forgot-password" })}</span></NavLink>
        </div>
        <div className="loginpage-create">
          <span>{intl.formatMessage({ id: "signin-noaccount" })}<NavLink to="/sign/up">{intl.formatMessage({ id: "signin-create" })}</NavLink></span>
        </div>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(LoginPage);
export default WrappedRegistrationForm