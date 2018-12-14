import React, { Component } from 'react';
import './Certification.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import { Upload, Icon, message, Select } from 'antd';
import Footer from '@/component/Footer';
import util from '../../utils/util';
import * as server from '../../service/personal';
const Option = Select.Option;

class Certification extends Component {
  state = {
    loading: false,
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    timer: null,
    defaultTime: 60,
    defaultSelect: 'China',
    on: false,
    numBtn: false,
    nationKey: [],
    nationArr: []
  };
  // 切换国家
  handleChange = (value) => {
    this.setState({
      defaultSelect: value
    })
  }
  // 正面
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
      }));
    }
  }
  // 背面
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
      }));
    }
  }
  // 手持
  handleChange3 = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl3: imageUrl,
        loading: false,
      }));
    }
  }
  subBtn = () => {
    let { intl } = this.props;
    // let reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    let { username, idnumber } = this.refs;
    let { imageUrl1, imageUrl2, imageUrl3 } = this.state;
    let obj = {
      name: username.value,
      country: this.state.defaultSelect,
      number: idnumber.value
    }
    this.setState({
      numBtn: false
    })
    if (!imageUrl1 || !imageUrl2 || !imageUrl3) {
      message.error(intl.formatMessage({ id: "certification-picture-tip" }));
      return false;
    }
    if (obj.name && obj.country && obj.number) {
      server.certification(obj)
        .then(res => {
          if (res.isSuccess) {
            message.success(intl.formatMessage({ id: "upload-success" }))
            window.location.href = "/personal"
            return false;
          } else {
            message.error(intl.formatMessage({ id: "upload-error" }))
          }
        })
    } else {
      message.warning(intl.formatMessage({ id: "myassets-message-null" }))
    }
  }
  searchNation = () => {
    server.searchNation()
      .then(res => {
        this.setState({
          nationArr: Object.values(res.countries),
          nationKey: Object.keys(res.countries)
        })
      })
  }
  componentDidMount() {
    this.searchNation()
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
  handleRemove1 = () => {
    this.setState({
      imageUrl1: ''
    })
  }
  handleRemove2 = () => {
    this.setState({
      imageUrl2: ''
    })
  }
  handleRemove3 = () => {
    this.setState({
      imageUrl3: ''
    })
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl1, imageUrl2, imageUrl3, defaultSelect, numBtn, nationArr, nationKey } = this.state;
    let { intl } = this.props;
    return (
      <div className="certification">
        <Header />
        <div className="certification-box">
          <div className="certification-center">
            <div className="certification-input">
              <div className="certification-form" id="certification-form">
                <h1 className="certification-title">{intl.formatMessage({id: "certification-header"})}</h1>
                <input ref="username" type="text" placeholder={intl.formatMessage({ id: "certification-input1-name" })} />
                <Select
                  ref="select"
                  defaultValue={defaultSelect}
                  style={{ width: 360 }}
                  onChange={this.handleChange}
                  size="large"
                  getPopupContainer={() => document.getElementById('certification-form')}
                >
                  {
                    Array.isArray(nationArr) && nationArr.map((item, ind) => {
                      return (
                        <Option key={ind} value={nationKey[ind]}><span>{item}</span></Option>
                      )
                    })
                  }

                </Select>
                <input ref="idnumber" type="text" placeholder={intl.formatMessage({ id: "certification-input3-name" })} />
                {
                  numBtn ? <div className="errtip mainred font12"><i className="iconfont icon-au-warning"></i>{intl.formatMessage({ id: "not-authnumber" })}</div> : null
                }
                {/* <p><input type="text" className="borderblack12" /><Button className={`send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({ id: "certification-send" }) : defaultTime + 's'}</Button></p> */}
              </div>
              <div className="btn">
                <button onClick={this.subBtn} className="greenbackground btngreenhover borderblack12">{intl.formatMessage({ id: "certification-confirm" })}</button>
              </div>
            </div>
            <div className="camera">
              <dl>
                <dt>
                  <Upload
                    name="photo" // 发到后台的文件参数名
                    listType="picture-card"
                    className="avatar-uploader"
                    withCredentials={true} // 上传请求时是否携带 cookie
                    showUploadList={true} // 服务端渲染时需要打开这个
                    action="/api/idDocument/img" // 上传地址
                    data={{ type: "front" }}
                    headers={{
                      Authorization: "Bearer " + util.getCookie('Authorization')
                    }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange1}
                    onRemove={this.handleRemove1}
                  >
                    {imageUrl1 ? <img src={imageUrl1} alt="avatar" /> : uploadButton}
                  </Upload>
                  {!imageUrl1 ? <span className="tipimg"><span className="blackbox"></span><span className="imgbox"><img src={require('../../assets/image/add.svg')} alt="" /></span><span className="text">{intl.formatMessage({ id: "certification-photo-1" })}</span></span> : null}
                </dt>
              </dl>
              <dl>
                <dt>
                  <Upload
                    name="photo" // 发到后台的文件参数名
                    listType="picture-card"
                    className="avatar-uploader"
                    withCredentials={true} // 上传请求时是否携带 cookie
                    showUploadList={true} // 服务端渲染时需要打开这个
                    action="/api/idDocument/img" // 上传地址
                    data={{ type: "back" }}
                    headers={{
                      Authorization: "Bearer " + util.getCookie('Authorization')
                    }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange2}
                    onRemove={this.handleRemove2}
                  >
                    {imageUrl2 ? <img src={imageUrl2} alt="avatar" /> : uploadButton}
                  </Upload>
                  {!imageUrl2 ? <span className="tipimg"><span className="blackbox"></span><span className="imgbox"><img src={require('../../assets/image/add.svg')} alt="" /></span><span className="text">{intl.formatMessage({ id: "certification-photo-2" })}</span></span> : null}
                </dt>
              </dl>
              <dl>
                <dt>
                  <Upload
                    name="photo" // 发到后台的文件参数名
                    listType="picture-card"
                    className="avatar-uploader"
                    withCredentials={true} // 上传请求时是否携带 cookie
                    showUploadList={true} // 服务端渲染时需要打开这个
                    action="/api/idDocument/img" // 上传地址
                    data={{ type: "handheld" }}
                    headers={{
                      Authorization: "Bearer " + util.getCookie('Authorization')
                    }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange3}
                    onRemove={this.handleRemove3}
                  >
                    {imageUrl3 ? <img src={imageUrl3} alt="avatar" /> : uploadButton}
                  </Upload>
                  {!imageUrl3 ? <span className="tipimg"><span className="blackbox"></span><span className="imgbox"><img src={require('../../assets/image/add.svg')} alt="" /></span><span className="text">{intl.formatMessage({ id: "certification-photo-3" })}</span></span> : null}
                </dt>
              </dl>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
}

export default Certification