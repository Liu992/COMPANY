import React, { Component } from 'react';
import './Share.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Pagination, message } from 'antd';

class Share extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      allPage: 10
    }
  }
  changePage = () => {

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
  render() {
    let { page, allPage } = this.state;
    let { intl } = this.props;
    return (
      <div className="share">
        <Header />
        <div className="share_box">
          <div className="share_top">
            <div className="top_l">
              <p className="title">{intl.formatMessage({id: "share-top-1"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-2"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-3"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-4"})}</p>
              <p className="address" ref="copyadredd">234asdfghj3456df5cfty78cft7cftycfty</p>
              <button className="copy_btn" onClick={this.btnCopy}>
                <img src={require("../../assets/image/copy1.svg")} alt="" />
                {intl.formatMessage({id: "share-top-5"})}
              </button>
              <textarea id="input" ref="inp" defaultValue="..."></textarea>
            </div>
            <div className="top_r">
              <h2 className="title">{intl.formatMessage({id: "share-top-6"})}</h2>
              <p className="num">{intl.formatMessage({id: "share-top-7"})}<b>30</b>{intl.formatMessage({id: "share-top-8"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-9"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-10"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-11"})}</p>
              <p className="txt">{intl.formatMessage({id: "share-top-12"})}</p>
            </div>
          </div>
          <div className="share_bottom">
            <button className="history-tip">
              {intl.formatMessage({id: "share-bottom-1"})}
            </button>
            <ul className="table">
              <li>
                <div className="li-list">
                  <span>{intl.formatMessage({id: "share-bottom-2"})}</span>
                  <span>{intl.formatMessage({id: "share-bottom-3"})}</span>
                  <span>{intl.formatMessage({id: "share-bottom-4"})}</span>
                </div>
              </li>


              <li>
                <div className="li-list">
                  <span>2018.01.01</span>
                  <span>123****1212</span>
                  <span>+3%BTC存币利息</span>
                </div>
              </li>
              <li>
                <div className="li-list">
                  <span>2018.01.01</span>
                  <span>123****1212</span>
                  <span>+3%BTC存币利息</span>
                </div>
              </li>
              <li>
                <div className="li-list">
                  <span>2018.01.01</span>
                  <span>123****1212</span>
                  <span>+3%BTC存币利息</span>
                </div>
              </li>

            </ul>
            {
              false ? <div className="nullfile">
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

export default Share