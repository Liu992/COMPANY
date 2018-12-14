import React, { Component } from 'react';
import "./AssetAddress.scss";
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Select, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import * as service from '../../service/myassets';
const Option = Select.Option;

class AssetAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      remark: "",
      allAddress: [],
      coinList: [],
      defaultCoin: ''
      // defaultSelset:""
    }
  }
  componentDidMount() {
    this.getCoin()
    this.getAllAddress()
  }
  getCoin() {
    service.getCoin()
      .then(res => {
        this.setState({
          defaultSelset: res.data[0].code,
          coinList: res.data,
          defaultCoin: res.data[0].code,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  addAddress() {
    let { defaultSelset, address, remark } = this.state;
    let { intl } = this.props;
    if (!defaultSelset || !address || !remark) {
      message.error(intl.formatMessage({ id: "myassets-message-null" }));
      return false;
    }
    service.addAddress({
      code: defaultSelset,
      address,
      mark: remark
    })
      .then(res => {
        if (res.isSuccess) {
          // message.success(intl.formatMessage({}))
          this.setState({
            address: '',
            remark: ""
          })
          this.getAllAddress()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  getAllAddress() {
    service.getAllAddress()
      .then(res => {
        this.setState({
          allAddress: res.data
        })
      })
      .catch(err => {

      })
  }
  deleteAddress(id) {
    service.deleteAddress({
      id
    })
      .then(res => {
        if (res.isSuccess) {
          this.getAllAddress()
        }
      })
  }
  handleChange1(val) {
    this.setState({
      defaultSelset: val
    })
  }
  handleChange2(val) {
    this.setState({
      defaultCoin: val
    })
  }
  Address(e) {
    this.setState({
      address: e.target.value
    })
  }
  Remark(e) {
    this.setState({
      remark: e.target.value
    })
  }
  render() {
    let { intl } = this.props;
    let { allAddress, coinList, defaultSelset, address, remark, defaultCoin } = this.state;
    return (
      <div className="assetaddress">
        <Header />
        <div className="address-content">
          <div className="add-address">
            <div className="add-detail" id="add-details">
              <span>
                <h2>{intl.formatMessage({ id: "address-add-1" })}</h2>
                {
                  defaultSelset ? <Select
                    defaultValue={defaultSelset}
                    onChange={this.handleChange1.bind(this)}
                    getPopupContainer={() => document.getElementById('add-details')}
                  >
                    {
                      Array.isArray(coinList) && coinList.map((item) => {
                        return <Option key={item.id} value={item.code}>{item.code.toUpperCase()}</Option>
                      })
                    }
                  </Select> : ""
                }

              </span>
              <span>
                <h2>{intl.formatMessage({ id: "address-add-2" })}</h2>
                <Input value={address} onChange={this.Address.bind(this)} />
              </span>
              <span>
                <h2>{intl.formatMessage({ id: "address-add-3" })}</h2>
                <Input value={remark} onChange={this.Remark.bind(this)} />
              </span>
            </div>
            <div className="add-btn">
              <Button type="primary" onClick={this.addAddress.bind(this)}>{intl.formatMessage({ id: "address-btn" })}</Button>
            </div>
          </div>
          {/* 地址列表 */}
          <div className="address-list">
            <div className="list-top" id="list-top">
              <h2>{intl.formatMessage({ id: "address-list-title" })}</h2>
              {
                defaultCoin ? <Select
                  defaultValue={defaultSelset}
                  value={defaultCoin}
                  getPopupContainer={() => document.getElementById('list-top')}
                  onChange={this.handleChange2.bind(this)}
                >
                  {
                    Array.isArray(coinList) && coinList.map((item) => {
                      return <Option key={item.id} value={item.code}>{item.code.toUpperCase()}</Option>
                    })
                  }
                </Select> : ""
              }

              <span>{intl.formatMessage({ id: "address-table-th1" })}</span>
            </div>
            <div className="list-table">
              <table>
                <thead>
                  <tr>
                    <th>{intl.formatMessage({ id: "address-table-th1" })}</th>
                    <th>{intl.formatMessage({ id: "address-table-th2" })}</th>
                    <th>{intl.formatMessage({ id: "address-table-th3" })}</th>
                    <th>{intl.formatMessage({ id: "address-table-th4" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    allAddress[defaultCoin] && allAddress[defaultCoin].map((item) => {
                      return (
                        <tr className={item.id} key={item.id}>
                          <td>{defaultCoin && defaultCoin.toUpperCase()}</td>
                          <td>{item.address}</td>
                          <td>{item.name}</td>
                          <td className="maingreen" onClick={this.deleteAddress.bind(this, item.id)}>{intl.formatMessage({ id: "address-delete" })}</td>
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

export default AssetAddress