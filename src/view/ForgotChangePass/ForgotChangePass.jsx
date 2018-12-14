import React, { Component } from 'react';
import './ForgotChangePass.scss';
import { Form, Input } from 'antd';
import * as server from '../../service/forgotPassService';
const FormItem = Form.Item;

class ForgotChangePass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shortTip: false
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      if (!err) {
        if (!reg.test(values.confirm)) {
          this.setState({
            shortTip: true
          })
          return false;
        }
        this.setState({
          shortTip: false
        })
        server.resetPassword(values)
          .then(res => {
            if (res.isSuccess) {
              this.props.history.push('/sign/in')
              return false;
            }
          })
      }

    });
  }
  changePass = () => {
    this.setState({
      shortTip: false
    })
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
  render() {
    const { getFieldDecorator } = this.props.form;
    let { intl } = this.props;
    let { shortTip } = this.state;
    return (
      <div className="forgotchangepass">
        <h1 className="font24 black87">{intl.formatMessage({ id: "forgot-changepassword-title" })}</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: intl.formatMessage({ id: "changepass-input2-null" }),
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input onChange={this.changePass} type="password" placeholder={intl.formatMessage({ id: "forgot-changepassword-input1-placeholder" })} />
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
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.formatMessage({ id: "forgot-changepassword-input2-placeholder" })} />
            )}
          </FormItem>
          {
            shortTip ? <div style={{width: '310px'}} className="errtip mainred font12 repetitiontip"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "error-tip-pass-short" })}</div> : null
          }
          <FormItem>
            <button className="btnsub borderblack12 greenbackground btngreenhover">{intl.formatMessage({ id: "changepass-update-pass" })}</button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(ForgotChangePass);
export default WrappedRegistrationForm