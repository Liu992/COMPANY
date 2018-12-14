import React, { Component } from 'react';
import './SetPhone.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Select, message } from 'antd';
import Footer from '@/component/Footer';
import { connect } from 'react-redux';
import sign from '../../store/action/signAction';
import * as server from '../../service/personal';

const Option = Select.Option;
const FormItem = Form.Item;
const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class SetPhone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on: false,
      defaultTime: 60,
      codeTip: false,
      phone: "",
      phoneCode: "",
      prefix: '86',
      codeErrTip: false,
      timer: null,
      binded: false
    }
  }
  handleSubmit = (e) => {
    let { intl } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          codeErrTip: false
        })
        server.bindPhone(values)
          .then(res => {
            if (res.isSuccess) {
              let member = Object.assign({}, this.props.member)
              member.phone = this.state.phone;
              member.sms = this.state.phone;
              this.props.dispatch(sign({
                isLogin: true,
                member
              }))
              this.props.history.push('/personal')
            } else {
              this.setState({
                codeErrTip: true
              })
            }
          })
      }
    });
  }
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
      message.error(intl.formatMessage({id: "not-phone"}))
      return false
    }
    server.bindSendSMS(prefix, phone)
    .then(res => {
      if (res.isSuccess) {
        message.success(intl.formatMessage({id: "success-tip-sms"}))
        this.setState({
          on: true,
          defaultTime: 60
        }, () => {
          this.stateTime()
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
  changeSelect = (value) => {
    this.setState({
      prefix: value
    })
  }
  changeCode = (e) => {
    this.setState({
      phoneCode: e.target.value
    })
  }
  changePhone = (e) => {
    this.setState({
      phone: e.target.value
    })
  }
  componentWillUnmount () {
    clearInterval(this.state.timer)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { on, defaultTime, prefix, codeErrTip, binded } = this.state;
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
      <div className="setphone">
        <Header />
        <div className="setphone-center">
          <div className="setphone-router">
            <span className="maingreen"><Link className="maingreen" to="/personal">{intl.formatMessage({ id: "setphone-torouter-left" })}</Link></span>
            <span className="black60"> > {intl.formatMessage({ id: "setphone-torouter-right" })}</span>
          </div>
          <h1 className="setphone-header font24 headcolor"><span>{intl.formatMessage({ id: "setphone-title" })}</span></h1>
          <hr />
          <div className="setphone-form">
            <Form onSubmit={this.handleSubmit}>
              <span className="font12 black60">{intl.formatMessage({ id: "setphone-input1-name" })}</span>
              <FormItem>
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "changephone-input1-null" }) }],
                })(
                  <Input onChange={this.changePhone} addonBefore={prefixSelector} style={{ width: '100%' }} />
                )}
              </FormItem>
              {
                binded?<div className="errtip mainred font12" style={{marginTop: '-16px'}}>{intl.formatMessage({id:"sendSMS-binded"})}!</div>:null
              }
              <span className="font12 black60">{intl.formatMessage({ id: "setphone-input2-name" })}</span>
              <FormItem className="captcha">
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: intl.formatMessage({ id: "setphone-input2-null" }) }],
                })(
                  <Input onChange={this.changeCode} />
                )}
                <Button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "setphone-send" }) : defaultTime + 's'}</Button>
              </FormItem>
              {
                codeErrTip ? <div className="font12 mainred errtip"><i style={{ marginRight: '4px', fontSize: '12px' }} className="font12 iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-smscode" })}</div> : null
              }
              <FormItem>
                <button className="btnsub borderblack12 greenbackground btngreenhover">{intl.formatMessage({ id: "setphone-btn" })}</button>
              </FormItem>
            </Form>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create()(SetPhone);
export default WrappedRegistrationForm