import React, { Component } from 'react';
import './SetEmail.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import { Form, Input, Select, message, Tooltip,Button } from 'antd';
import Footer from '@/component/Footer';
import sign from '../../store/action/signAction';
import { connect } from 'react-redux';
import * as server from '../../service/personal';

const FormItem = Form.Item;

const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class SetEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      timer: null,
      on: false,
      defaultTime: 60,
      subbtn: false,
      binded: false,
      on: false,
      visible: false
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          subbtn: true
        })
        server.verifyEmail({
          email: this.state.email,
          emailCode: values.emailCode
        })
          .then(res => {
            if (res.isSuccess) {
              let newmember = this.props.member;
              newmember.email = this.state.email;
              this.props.dispatch(sign({
                  isLogin: true,
                  member: newmember
                }))
              this.props.history.push('/personal')
            } else {
              if (res.message === "验证码错误或邮箱不匹配") {
                message.success('验证码错误或邮箱不匹配');
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  }
  changeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }
  onSend() {
    let { intl } = this.props;
    server.setEmail({
      email: this.state.email
    })
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({ id: "setemail-send-success" }))
          this.setState({
            on: true,
            defaultTime: 60
          }, () => {
            this.stateTime()
          })
        } else {
          this.setState({
            binded: true
          })
          message.success(intl.formatMessage({ id: "setemail-send-fail" }))
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
              on: false
            })
          }
        })
      }, 1000)
    })
  }
  changeEmailCode = (e) => {
    this.setState({
      oldcode: e.target.value
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { on, defaultTime, subbtn, binded, visible } = this.state;
    let { intl } = this.props;

    return (
      <div className="setemail">
        <Header />
        <div className="setemail-center">
          <div className="setemail-router">
            <span className="maingreen"><Link className="maingreen" to="/personal">{intl.formatMessage({ id: "changephone-torouter-left" })}</Link></span>
            <span className="black60"> > {intl.formatMessage({ id: "setemail-title" })}</span>
          </div>
          <h1 className="setemail-header font24 headcolor"><span>{intl.formatMessage({ id: "setemail-title" })}</span></h1>
          <hr />
          <div className="setemail-form">
            <Form onSubmit={this.handleSubmit}>
              <span className="font12 black60">{intl.formatMessage({ id: "setemail-email" })}</span>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{
                    type: 'email', message: intl.formatMessage({ id: "register-not-valid-email" }),
                  }, {
                    required: true, message: intl.formatMessage({ id: "register-not-email" }),
                  }],
                })(
                  <div>
                    <Input type="email" placeholder={`${intl.formatMessage({ id: "register-such" })}：xiaobai@example.com`} onChange={this.changeEmail.bind(this)} />
                  </div>
                )}
              </FormItem>
              {
                binded ? <div className="errtip mainred font12" style={{ marginTop: '-16px' }}>{intl.formatMessage({ id: "sendEmail-binded" })}!</div> : null
              }
              <span className="font12 black60">{intl.formatMessage({ id: "setemail-emailcode" })}</span><br />
              <span className="font12 maingreen">{intl.formatMessage({ id: "setemail-error-tip" })}</span>
              <FormItem className="captcha">
                {getFieldDecorator('emailCode', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "setemail-input-null" }) }],
                })(
                  <Input onChange={this.changeEmailCode} />
                )}
                <Button className={`borderblack12 send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend.bind(this)} disabled={on}>{!on ? intl.formatMessage({ id: "changephone-send" }) : defaultTime + 's'}</Button>
              </FormItem>
              <FormItem>
                <button disabled={subbtn} className="btnsub borderblack12 greenbackground btngreenhover">{intl.formatMessage({ id: "changephone-confirm" })}</button>
              </FormItem>
            </Form>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(SetEmail)
export default WrappedRegistrationForm