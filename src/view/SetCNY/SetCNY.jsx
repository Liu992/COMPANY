import React, { Component } from 'react';
import './SetCNY.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import * as service from '../../service/otc';
import util from '../../utils/util';
const FormItem = Form.Item;

class SetCNY extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paytype: [],
      loading: false,
      imageUrl1: "",
      imageUrl2: "",
      typeName: "",
      type: "",
      receivePhoto1: "",
      receivePhoto2: ""
    }
  }
  componentDidMount() {
    // 获取验证方式
    this.getPayType()
  }
  handleSubmit = (e) => {
    let {intl} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.bankNumber !== values.repeatbankNumber) {
          message.error(intl.formatMessage({id:"setcny-bank-error"}))
          return false;
        }
        service.payMode({
          type: this.state.type,
          typeName: this.state.typeName,
          receivePname: values.receivePname,
          bank: values.bank,
          bankAddress: values.bankAddress,
          bankNumber: values.bankNumber
        })
          .then(res => {
            if (res.isSuccess) {
              message.success(intl.formatMessage({id:"upload-success"}))
              this.props.history.push('/fiatdeal')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  }

  getPayType = () => {
    service.getPayType()
      .then(res => {
        this.setState({
          paytype: res,
          typeName: res[0].typeName,
          type: res[0].type
        })
      })
  }
  changeCallback = (type, typeName) => {
    this.setState({
      type,
      typeName,
      loading: false,
      receivePhoto1: "",
      receivePhoto2: ""
    })
  }


  beforeUpload = (file) => {
    let { intl } = this.props;
    const isJPG = file.type;
    if (isJPG.indexOf('image') < 0) {
      message.error(intl.formatMessage({ id: "upload-type-error" }));
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error(intl.formatMessage({ id: "upload-size-error" }));
    }
    return !(isJPG.indexOf('image') < 0) && isLt3M;
  }
  handleChange1 = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl1: imageUrl,
        loading: false,
        receivePhoto1: info.file.response && info.file.response.fileName
      }));
    }
  }
  
  handleChange2 = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl2: imageUrl,
        loading: false,
        receivePhoto2: info.file.response && info.file.response.fileName
      }));
    }
  }
  handleRemove1 = () => {
    this.setState({
      imageUrl1: '',
      receivePhoto1:""
    })
  }
  handleRemove2 = () => {
    this.setState({
      imageUrl2: '',
      receivePhoto2:""
    })
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  subMessage(paytype) {
    let {intl} = this.props;
    let { receivePhoto1, receivePhoto2 } = this.state;
    if (paytype === 'zfb') {
      if (!this.refs[paytype].value || !receivePhoto1) {
        message.error(intl.formatMessage({id:"myassets-message-null"}))
        return false;
      }
      this.subVerify(paytype)
    }
    if (paytype == 'weixin') {
      if (!this.refs[paytype].value || !receivePhoto2) {
        message.error(intl.formatMessage({id:"myassets-message-null"}))
        return false;
      }
      this.subVerify(paytype)
    }
  }
  subVerify = (paytype) => {
    let {intl} = this.props;
    let { typeName, type, receivePhoto1, receivePhoto2 } = this.state;
    service.payMode({
      typeName,
      type,
      receivePname: this.refs[paytype].value,
      receivePhoto: paytype === "zfb" ? receivePhoto1 : receivePhoto2
    })
      .then(res => {
        if (res.isSuccess) {
          message.success(intl.formatMessage({id:"upload-success"}));
          this.props.history.push('/fiatdeal');
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { intl } = this.props;
    const { imageUrl1, imageUrl2, paytype, typeName } = this.state;
    const uploadButton1 = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{intl.formatMessage({ id: "setcny-upload" })}</div>
      </div>
    );
    const uploadButton2 = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{intl.formatMessage({ id: "setcny-upload" })}</div>
      </div>
    );
    return (
      <div className="setcny">
        <Header />
        <div className="setcny-box">
          <h1 className="setcny-title">{intl.formatMessage({ id: "setcny-title" })}</h1>
          <div className="setcny-content">
            <ul className="nav">
              {
                Array.isArray(paytype)&&paytype.map((item, ind) => {
                  return <li className={typeName === item.typeName ? 'actived' : ""} key={item.id} onClick={this.changeCallback.bind(this, item.type, item.typeName)}>{intl.formatMessage({ id: "setcny-tab" + (ind + 1) + "" })}</li>
                })
              }
            </ul>
            <div className="setcny-matter">
              <div className={`zfb ${typeName === "支付宝" ? "show" : ""}`}>
                <label className="number">
                  <span>{intl.formatMessage({ id: "setcny-tab1" })}</span>
                  <input type="text" ref="zfb" placeholder={intl.formatMessage({ id: "setcny-pay-placeholder" })} />
                </label>
                <div className="codeupdata">
                  <span>{intl.formatMessage({ id: "setcny-ali-inp2" })}</span>
                  <Upload
                    name="photo" // 发到后台的文件参数名
                    listType="picture-card"
                    className="avatar-uploader"
                    withCredentials={true} // 上传请求时是否携带 cookie
                    showUploadList={true} // 服务端渲染时需要打开这个
                    action="/api/idDocument/img" // 上传地址
                    data={{ type: "c2c" }}
                    headers={{
                      Authorization: "Bearer " + util.getCookie('Authorization')
                    }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange1}
                    onRemove={this.handleRemove1}
                  >
                    {imageUrl1 ? "" : uploadButton1}
                  </Upload>
                </div>
                <div className="btn">
                  <button onClick={this.subMessage.bind(this, "zfb")}>{intl.formatMessage({ id: "setcny-btn" })}</button>
                </div>
              </div>
              <div className={`weixin ${typeName === "微信" ? "show" : ""}`}>
                <label className="number">
                  <span>{intl.formatMessage({ id: "setcny-weixin-inp1" })}</span>
                  <input type="text" ref="weixin" placeholder={intl.formatMessage({ id: "setcny-weixin-placeholder" })} />
                </label>
                <div className="codeupdata">
                  <span>{intl.formatMessage({ id: "setcny-ali-inp2" })}</span>
                  <Upload
                    name="photo" // 发到后台的文件参数名
                    listType="picture-card"
                    className="avatar-uploader"
                    withCredentials={true} // 上传请求时是否携带 cookie
                    showUploadList={true} // 服务端渲染时需要打开这个
                    action="/api/idDocument/img" // 上传地址
                    data={{ type: "c2c" }}
                    headers={{
                      Authorization: "Bearer " + util.getCookie('Authorization')
                    }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange2}
                    onRemove={this.handleRemove2}
                  >
                    {imageUrl2 ? "" : uploadButton2}
                  </Upload>
                </div>
                <div className="btn">
                  <button onClick={this.subMessage.bind(this, "weixin")}>{intl.formatMessage({ id: "setcny-btn" })}</button>
                </div>
              </div>
              <div className={`bank ${typeName === "银行卡" ? "show" : ""}`}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                    label={intl.formatMessage({ id: "setcny-bank-inp1" })}
                  >
                    {getFieldDecorator('receivePname', {
                      rules: [{ required: true, message: intl.formatMessage({ id: "setcny-name-placeholder" }) }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: "setcny-name-placeholder" })} />
                    )}
                  </FormItem>
                  <FormItem
                    label={intl.formatMessage({ id: "setcny-bank-inp2" })}
                  >
                    {getFieldDecorator('bank', {
                      rules: [{ required: true, message: intl.formatMessage({ id: "setcny-bank-placeholder" }) }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: "setcny-bank-placeholder" })} />
                    )}
                  </FormItem>
                  <FormItem
                    label={intl.formatMessage({ id: "setcny-bank-inp3" })}
                  >
                    {getFieldDecorator('bankAddress', {
                      rules: [{ required: true, message: intl.formatMessage({ id: "setcny-bankaddress-placeholder" }) }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: "setcny-bankaddress-placeholder" })} />
                    )}
                  </FormItem>
                  <FormItem
                    label={intl.formatMessage({ id: "setcny-bank-inp4" })}
                  >
                    {getFieldDecorator('bankNumber', {
                      rules: [{ required: true, message: intl.formatMessage({ id: "setcny-banknumber" }) }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: "setcny-banknumber" })} />
                    )}
                  </FormItem>
                  <FormItem
                    label={intl.formatMessage({ id: "setcny-bank-inp5" })}
                  >
                    {getFieldDecorator('repeatbankNumber', {
                      rules: [{ required: true, message: intl.formatMessage({ id: "setcny-confirm-banknumber" }) }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: "setcny-confirm-banknumber" })} />
                    )}
                  </FormItem>

                  <FormItem>
                    <Button type="primary" htmlType="submit">{intl.formatMessage({ id: "setcny-btn" })}</Button>
                  </FormItem>
                </Form>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(SetCNY);

export default WrappedRegistrationForm