import React, { Component } from 'react';
import './MyOrder.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Pagination } from 'antd';
import * as service from '../../service/otc';


class MyOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allnum: 0,
      page: 1,
      adList: []
    }
  }
  componentDidMount() {
    // 获取我的订单
    this.getMyOrders();
  }
  getMyOrders = () => {
    service.getMyAllOrder({
      limit: 10,
      page: this.state.page
    })
      .then(res => {
        this.setState({
          allnum: res.count,
          adList: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  changePage = (page) => {
    this.setState({
      page: page
    }, () => {
      this.getMyOrders()
    })
  }
  toPay (id) {
    this.props.history.push("/paypage/"+id+"")
  }
  render() {
    let { allnum, adList } = this.state;
    let {intl} = this.props;

    return (
      <div className="myorder">
        <Header />
        <div className="myorder-box">
          <h1 className="myorder-title">
            {intl.formatMessage({id:"myorder-title"})}
          </h1>
          <div className="myorder-list">
            <table className="myorder-table">
              <thead>
                <tr>
                  <th>{intl.formatMessage({id:"myorder-th1"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th2"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th3"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th4"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th5"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th6"})}</th>
                  <th>{intl.formatMessage({id:"myorder-th7"})}</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(adList)&&adList.map((item, ind) => {
                    return (
                      <tr key={ind} onClick={this.toPay.bind(this, item.id)}>
                        <td className="main-green">{item.tradeNumber}</td>
                        <td>{intl.formatMessage({id:"myorder-"+item.type+""})} {item.volume} {item.currency}</td>
                        <td>{item.funds}</td>
                        <td>{item.price}</td>
                        <td>{item.create}</td>
                        <td>{intl.formatMessage({id:"myorder-state-"+item.state+""})}</td>
                        <td className="main-green">{item.nickName}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <div className="myorder-ul">
                <ul>
                {
                  Array.isArray(adList)&&adList.map((item, ind) => {
                    return (
                      <li key={ind} onClick={this.toPay.bind(this, item.id)}>
                        <p className="main-green no"><span>{intl.formatMessage({id:"myorder-th1"})}</span>：{item.tradeNumber}</p>
                        <p className="type"><span>{intl.formatMessage({id:"myorder-th2"})}</span>：{intl.formatMessage({id:"myorder-"+item.type+""})} {item.volume} {item.currency}</p>
                        <p className="amount"><span>{intl.formatMessage({id:"myorder-th3"})}</span>：{item.funds}</p>
                        <p className="price"><span>{intl.formatMessage({id:"myorder-th4"})}</span>：{item.price}</p>
                        <p className="time"><span>{intl.formatMessage({id:"myorder-th5"})}</span>：{item.create}</p>
                        <p className="status"><span>{intl.formatMessage({id:"myorder-th6"})}</span>：{intl.formatMessage({id:"myorder-state-"+item.state+""})}</p>
                        <p className="main-green conterparty"><span>{intl.formatMessage({id:"myorder-th7"})}</span>：{item.nickName}</p>
                      </li>
                    )
                  })
                }
                </ul>
            </div>
            {
              allnum > 0 ? <Pagination onChange={this.changePage} total={allnum} /> : ""
            }

          </div>

        </div>
        <Footer />
      </div>
    )
  }
}
export default MyOrder