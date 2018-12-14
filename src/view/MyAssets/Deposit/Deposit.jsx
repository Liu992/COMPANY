import React, { Component } from 'react';
import './Deposit.scss';
import * as service from '@/service/myassets';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { Select, Pagination, message } from 'antd';

const Option = Select.Option;
const QRCode = require('qrcode.react');

class Deposit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      allPage: 0,
      depositList: [],
      depositAddress: "",
      coinType: this.props.match.params.type.toUpperCase(),
      coinList: [],
      showID: null,
      showHide: false
    }
  }
  componentDidMount() {
    this.getAddress()
    this.getdeposit(this.state.page)
    this.getCoin()
  }
  // 获取币种
  getCoin = () => {
    service.getCoin()
      .then(res => {
        this.setState({
          coinList: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  getAddress = () => {
    let { coinType } = this.state;
    // 获取充币地址
    service.getAddress(coinType.toLowerCase())
      .then(res => {
        this.setState({
          depositAddress: res.paymentAddress.address
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 点击copy地址
  btnCopy = () => {
    let { intl } = this.props;
    let text = this.refs.copyadredd.innerHTML;
    let input = this.refs.inp;
    input.value = text; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand("copy"); // 执行浏览器复制命令
    message.success(intl.formatMessage({ id: "myassets-message-copy" }))
  }
  changePage = (num) => {
    this.setState({
      page: num
    }, () => {
      this.getdeposit(this.state.page)
    })
  }
  getdeposit = (page) => {
    service.getdeposit(page)
      .then(res => {
        this.setState({
          depositList: res.members,
          allPage: res.count
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  // 修改币种
  handleChange = (val) => {
    this.setState({
      coinType: val
    }, () => {
      this.getAddress()
    })
  }
  showDetail (id) {
    this.setState({
      showID: id,
      showHide: !this.state.showHide
    })
  }
  render() {
    let { intl } = this.props;
    let { depositList, page, allPage, depositAddress, coinList, coinType, showID,showHide } = this.state;
    return (
      <div className="deposit">
        <Header />
        <div className="deposit-box">
          <h1 className="deposit-title font24">
            {intl.formatMessage({id: "myassets-table-deposit"})}
          </h1>
          <div className="deposit-content">
            <div className="content-left" id="deposit-content-left">
              <Select
                className="left-coin"
                defaultValue={coinType}
                style={{ width: 545 }}
                onChange={this.handleChange}
                getPopupContainer={() => document.getElementById('deposit-content-left')}
              >
                {
                  coinList.map(item => {
                    return (
                      <Option key={item.id} value={item.code.toUpperCase()}>{item.code.toUpperCase()}</Option>
                    )
                  })
                }
              </Select>
              <div className="left-address">
                <span>{intl.formatMessage({id: "myassets-depositcan-dialog-address"})}</span>
                <span className="address maingreen" ref="copyadredd">{depositAddress}</span>
                <img onClick={this.btnCopy} src={require('../../../assets/image/copy.svg')} alt="" />
                <textarea id="input" ref="inp" defaultValue="..."></textarea>
              </div>
              <div className="left-tip">
                <p>{intl.formatMessage({id: "myassets-content-p1"})}</p>
                <p>{intl.formatMessage({id: "myassets-content-p2"})}</p>
                <p>{intl.formatMessage({id: "myassets-content-p3"})}</p>
                <p>{intl.formatMessage({id: "myassets-content-p4"})}</p>
              </div>
            </div>
            <div className="content-right">
              <h2 className="codetitle">{intl.formatMessage({id: "myassets-Qrcode"})}</h2>
              <QRCode className="imgcode" size={180} value={depositAddress == null ? 'null' : depositAddress} />
            </div>
          </div>
          <div className="deposit-history">
            <button className="history-tip">
              {intl.formatMessage({id: "myassets-depositcan-dialog-address"})}
            </button>
            <ul className="table">
              <li>
                <div className="li-list">
                  <span>{intl.formatMessage({ id: "trading-orders-table-th1" })}</span>
                  <span>{intl.formatMessage({ id: "trading-market-table-th1" })}</span>
                  <span>{intl.formatMessage({ id: "history-table-th3" })}</span>
                  <span>{intl.formatMessage({ id: "history-table-th6" })}</span>
                  <span>{intl.formatMessage({id: "myassets-action"})}</span>
                </div>
              </li>
              {
                Array.isArray(depositList) && depositList.map((item) => {
                  return (
                    <li key={item.id}>
                      <div className="li-list">
                        <span>{item.createdAt}</span>
                        <span>{item.fundExtra.toUpperCase()}</span>
                        <span>{item.amount * 1}</span>
                        <span>{intl.formatMessage({ id: "history-" + item.aasmState + "" })}</span>
                        <span style={{cursor: "pointer"}} onClick={this.showDetail.bind(this, item.id)}>{intl.formatMessage({id: "myassets-details"})}</span>
                      </div>
                      <div className={"li-detail " + (showID === item.id&&showHide? "li-detail-show":"li-detail-hide")}>
                        <span>{intl.formatMessage({id: "myassets-deal-id"})}：{item.txid}</span>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
            {
              depositList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page} total={allPage} onChange={this.changePage} />
            }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Deposit