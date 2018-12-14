import React, { PureComponent } from 'react';
import './MyAssets.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { NavLink } from 'react-router-dom';
import Kline from '../../component/Kline';
import { connect } from 'react-redux';
import * as service from '../../service/myassets';
import BigNumber from 'bignumber.js';
import { message } from 'antd';

const mapStateToProps = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToProps)
class MyAssets extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      assetList: [],
      newAssetList: [],
      on: false,
      conversion: "cny",
      allCny: "",
      allUsd: ""
    }
  }
  componentWillMount() {
    this.getAssets()
  }
  toWithdraw(coin) {
    let { intl } = this.props;
    service.ifVerify()
     .then(res => {
       if (res.verified) {
         this.props.history.push('/withdraw/'+ coin)
       } else {
         message.warning(intl.formatMessage({ id: "myassets-not-verify" }))
         // this.props.history.push('/certification')
       }
     })
  }
  // 请求资产列表
  getAssets = () => {
    service.myassets()
      .then(res => {
        if (res.isSuccess) {
          this.setState({
            assetList: res.result.accounts,
            newAssetList: res.result.accounts,
            allCny: res.result.cny,
            allUsd: res.result.usd
          }, () => {
            this.intlHistory()
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // socket 获取最新资产历史
  intlHistory = () => {
    let { member } = this.props;
    let { newAssetList } = this.state;
    let arr = [...newAssetList]
    window.ws.on(`private-${member.sn}-accounts`, (data) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].balance !== 0 && arr[i].currency === data.currency) {
          arr[i].balance = data.attrs.balance
          arr[i].locked = data.attrs.locked
        }
      }
      this.setState({
        newAssetList: arr
      })
    })
  }
  render() {
    let { allCny, allUsd, newAssetList, conversion } = this.state;
    let { intl } = this.props;
    return (
      <div className="myassets">
        <Header />
        <div className="myassets-box">
          <div className="myassets-details">
            <h1 className="font24 black87">{intl.formatMessage({ id: "myassets-title" })}</h1>
            <div className="asset-kline">
              <div className="asset-kline-top">
                <span><i className="font14">¥  </i>{BigNumber(allCny).toFixed(4, 1)}</span>
                <span className="font14" style={{ color: "rgba(0, 255, 113, 1)" }}>$ {BigNumber(allUsd).toFixed(4, 1)}</span>
              </div>
              <div className="asset-img">
                <Kline width={"100%"} name={"asset-img"} show={false} data={[120, 1234, 400, 230, 120, 400, 600]} lineColor={"#2277CC"} />
              </div>
            </div>
            <div className="asset-statistics">
              <button className="statistics-tip">{intl.formatMessage({ id: "myassets-alltime" })}</button>
              <div className="statistics-box">
                <span>{intl.formatMessage({ id: "myassets-allasset" })}</span>
                <span>≈ {BigNumber(allCny).toFixed(4, 1)} CNY</span>
              </div>
            </div>
            <div className="myassets-table">
              <table>
                <thead>
                  <tr>
                    <th>{intl.formatMessage({ id: "myassets-table-th1" })}</th>
                    <th>{intl.formatMessage({ id: "myassets-table-th2" })}</th>
                    <th style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }}>{intl.formatMessage({ id: "myassets-table-th3" })}</th>
                    <th style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }}>{intl.formatMessage({ id: "myassets-table-th4" })}</th>
                    <th>{intl.formatMessage({ id: "myassets-table-th5" })}</th>
                  </tr>
                </thead>
                <tbody className="font14 black60">
                  {
                    Array.isArray(newAssetList) && newAssetList.map((item, ind) => {
                      return (
                        <tr key={ind}>
                          <td>
                            <img src={require("../../assets/image/icon-" + item.currency + ".svg")} alt="" />
                            <span className="font-w">{item.currency.toUpperCase()}</span>
                          </td>
                          <td>
                            {item.balance}
                          </td>
                          <td style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }}>
                            {BigNumber(item.locked).toFixed(4, 1)}
                          </td>
                          <td style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }}>
                            {BigNumber(item[conversion]).toFixed(4, 1)}
                          </td>
                          <td>
                            <NavLink className="maingreen" to={"/deposit/" + item.currency}>{intl.formatMessage({ id: "myassets-table-deposit" })}</NavLink>
                            <a className="maingreen" onClick={this.toWithdraw.bind(this, item.currency)}>{intl.formatMessage({ id: "myassets-table-withdraw" })}</a>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default MyAssets