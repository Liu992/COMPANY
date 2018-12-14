import React, { Component } from 'react';
import './ChangePhone.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import { Form, Input, Select, message } from 'antd';
import Footer from '@/component/Footer';
import sign from '../../store/action/signAction';
import { connect } from 'react-redux';
import * as server from '../../service/personal';

const FormItem = Form.Item;
const Option = Select.Option;

const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class ChangePhone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      timer1: null,
      timer2: null,
      on1: false,
      defaultTime1: 60,
      on2: false,
      defaultTime2: 60,
      subbtn: false,
      binded: false,
      errType: 0
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      errType:0
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          subbtn: true
        })
        let { phone, newcode, oldcode } = this.state;
        server.changePhone(phone, newcode, oldcode)
          .then(res => {
            this.setState({
              subbtn: false
            })
            if (res.isSuccess) {
              let member = { ...this.props.member }
              member.phone = phone;
              member.sms = true;
              this.props.dispatch(sign({
                isLogin: true,
                member
              }))
              this.props.history.replace('/personal')
            } else {
              if (res.message === "新手机验证码错误") {
                this.setState({
                  errType:1
                })
              } else {
                this.setState({
                  errType:2
                })
              }
            }
          })
      }
    });
  }
  onSend1() {
    let {intl} = this.props;
    let {phone} = this.state;
    this.setState({
      binded: false
    })
    if (!phone) {
      return false
    }
    if (!(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone))) {
      message.error(intl.formatMessage({id: "not-phone"}))
      return false
    }
    server.newSendPhone(phone)
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({id: "success-tip-sms"}))
          this.setState({
            on1: true,
            defaultTime1: 60
          }, () => {
            this.stateTime1()
          })
        } else {
          if (res.message === "此手机号已经绑定") {
            // message.error(intl.formatMessage({id:"sendSMS-binded"}))
            this.setState({
              binded: true
            })
            return false
          }
          message.error(intl.formatMessage({id: "error-tip-sms"}))
        }
      })
    
  }
  onSend2() {
    let {intl} = this.props;
    server.sendSMS()
    .then(res => {
      if (res.isSuccess) {
        message.success(intl.formatMessage({id: "success-tip-sms"}))
        this.setState({
          on2: true,
          defaultTime2: 60
        }, () => {
          this.stateTime2()
        })
      } else {
        message.success(intl.formatMessage({id: "error-tip-sms"}))
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
  componentWillUnmount() {
    clearInterval(this.state.timer1)
    clearInterval(this.state.timer2)
  }
  changePhone = (e) => {
    this.setState({
      phone: e.target.value
    })
  }
  changeNewCode = (e) => {
    this.setState({
      newcode: e.target.value
    })
  }
  changeOldCode = (e) => {
    this.setState({
      oldcode: e.target.value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { on1, on2, defaultTime1, defaultTime2, subbtn,binded, errType } = this.state;
    let { intl } = this.props;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}
      getPopupContainer={() => document.getElementsByClassName('phone')[0]}
      >
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
      <div className="changephone">
        <Header />
        <div className="changephone-center">
          <h1 className="changephone-header font24 headcolor"><span>{intl.formatMessage({ id: "changephone-title" })}</span></h1>
          <div className="changephone-form">
            <Form onSubmit={this.handleSubmit}>
              <FormItem className="phone" id="phonebox">
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changephone-input1-null" }) }],
                })(
                  <Input placeholder={intl.formatMessage({ id: "changephone-input1-name" })} onChange={this.changePhone} addonBefore={prefixSelector} style={{ width: '100%' }} />
                )}
              </FormItem>
              {
                binded?<div className="errtip mainred font12" style={{marginTop: '-16px'}}>{intl.formatMessage({id:"sendSMS-binded"})}!</div>:null
              }
              <FormItem className="captcha">
                {getFieldDecorator('captcha1', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changephone-input2-null" }) }],
                })(
                  <Input placeholder={intl.formatMessage({ id: "changephone-input2-name" })} onChange={this.changeNewCode} />
                )}
                <button className={`borderblack12 send ${on1 ? 'already-send' : 'not-send'}`} onClick={this.onSend1.bind(this)} disabled={on1}>{!on1 ? intl.formatMessage({ id: "changephone-send" }) : defaultTime1 + 's'}</button>
              </FormItem>
              {
                errType === 1?<div className="errtip mainred font12">{intl.formatMessage({id: "error-tip-smscode"})}</div>:null
              }
              <FormItem className="captcha">
                {getFieldDecorator('captcha2', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changephone-input3-null" }) }],
                })(
                  <Input placeholder={intl.formatMessage({ id: "changephone-input3-name" })} onChange={this.changeOldCode} />
                )}
                <button className={`borderblack12 send ${on2 ? 'already-send' : 'not-send'}`} onClick={this.onSend2.bind(this)} disabled={on2}>{!on2 ? intl.formatMessage({ id: "changephone-send" }) : defaultTime2 + 's'}</button>
              </FormItem>
              {
                errType === 2?<div className="errtip mainred font12">{intl.formatMessage({id: "error-tip-smscode"})}</div>:null
              }
              <FormItem>
                <button disabled={subbtn} className="btnsub borderblack12 greenbackground btngreenhover">{intl.formatMessage({ id: "changephone-confirm" })}</button>
              </FormItem>
            </Form>
            {/* <Link className="maingreen" to="/sign/retrievepassword">{intl.formatMessage({ id: "changephone-forgot-pass" })}?</Link> */}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(ChangePhone)
export default WrappedRegistrationForm