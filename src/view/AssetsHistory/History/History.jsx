import React, { PureComponent } from 'react';
import './History.scss';
import { Tabs, message } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import * as service from '@/service/myassets';
import * as marketService from '@/service/marketService';

const TabPane = Tabs.TabPane;
function callback(key) {
  // console.log(key);
}

@connect()
class History extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      page1: 1,
      page2: 1,
      page3: 1,
      page4: 1,
      allPages1: 0,
      allPages2: 0,
      allPages3: 0,
      allPages4: 0,
      tradeList: [],
      orderList: [],
      depositList: [],
      withdrawalList: [],
      actionId: []
    }
  }
  changePage1 = (num) => {
    this.setState({
      page1: num
    }, () => {
      this.getOrderList(this.state.page1)
    })
  }
  changePage2 = (num) => {
    this.setState({
      page2: num
    }, () => {
      this.getTradeList(this.state.page2)
    })
  }
  changePage3 = (num) => {
    this.setState({
      page3: num
    }, () => {
      this.getdeposit(this.state.page3)
    })
  }
  changePage4 = (num) => {
    this.setState({
      page4: num
    }, () => {
      this.getwithdrawal(this.state.page4)
    })
  }
  componentDidMount() {
    this.getOrderList(this.state.page1)
    this.getTradeList(this.state.page2)
    this.getdeposit(this.state.page3)
    this.getwithdrawal(this.state.page4)
  }
  getOrderList = (page) => {
    service.orderHistory(page)
      .then(res => {
        if (res.isSuccess) {
          this.setState({
            allPages1: res.count,
            orderList: res.result
          })
        }
      })
  }
  getTradeList = (page) => {
    service.tradeHistory(page)
      .then(res => {
        if (res.isSuccess) {
          this.setState({
            allPages2: res.count,
            tradeList: res.result,
            actionId: []
          })
        }
      })
  }
  getdeposit = (page) => {
    service.getdeposit(page)
      .then(res => {
        this.setState({
          depositList: res.members,
          allPages3: res.count
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  getwithdrawal = (page) => {
    service.getwithdrawal(page)
      .then(res => {
        this.setState({
          withdrawalList: res.members,
          allPages4: res.count
        })
        // console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  changeCancel (address, currency) {
    let obj = {
      address: address,
      currency: currency
    }
    let { page4 } = this.state;
    service.cancelWithdrawal(obj)
      .then(res => {
        this.getwithdrawal(page4)
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleCancelClick(orderId, id, e) {
    e.preventDefault();
    let { intl } = this.props;
    let { actionId, page1, page2 } = this.state;
    marketService.cancel(id, { orderId: orderId }).then((data) => {
      if (data.isSuccess) {
        let mess = intl.formatMessage({ id: "trading-deal-cancel-success" });
        actionId.push(orderId)
        this.setState({
          actionId: actionId
        })
        // this.getOrderList(page1)
        // this.getTradeList(page2)
        // message.success(mess);
      } else {
        let mess = intl.formatMessage({ id: "trading-deal-cancel-fail" });
        message.error(mess);
      }
    });
  }
  render() {
    let { intl } = this.props;
    let { page1, page2, page3, page4, allPages1, allPages2, allPages3, allPages4, orderList, tradeList, actionId, withdrawalList, depositList } = this.state;
    return (
      <div className="history-table">
        <Tabs className="table-tabs" defaultActiveKey="1" onChange={callback}>
          <TabPane className="tabpane" tab={intl.formatMessage({ id: "trading-orders-title" })} key="1">
            <table className="table font12">
              <thead>
                <tr className="black38 font12">
                  <th>{intl.formatMessage({ id: "trading-orders-table-th1" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th2" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th3" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th4" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th5" })}</th>
                  <th style={{display: window.innerWidth <=1040? 'none':'table-cell'}}>{intl.formatMessage({ id: "trading-orders-table-th6" })}</th>
                  <th style={{display: window.innerWidth <=1040? 'none':'table-cell'}}>{intl.formatMessage({ id: "trading-orders-table-th7" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th8" })}</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(orderList)&&orderList.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.createdAt.substr(-8)}</td>
                        <td>{item.name}</td>
                        <td>{item.type === "bid" ? intl.formatMessage({ id: "trading-deal-bid-title" }) : intl.formatMessage({ id: "trading-deal-ask-title" })}</td>
                        <td>{item.price}</td>
                        {
                          item.volume === 0 ? <td className={`${item.type === 'bid' ? "maingreen" : "mainred"}`}>
                            {item.volume}
                          </td> : <td className={`${item.type === 'bid' ? "maingreen" : "mainred"}`}>
                              {/* {item.type === 'bid' ? "+" : "-"} */}
                              {item.volume}
                            </td>
                        }
                        <td style={{display: window.innerWidth <=1040? 'none':'table-cell'}}>{item.price}</td>
                        <td style={{display: window.innerWidth <=1040? 'none':'table-cell'}}>{item.usedVolume == 0 ? intl.formatMessage({ id: "history-not-mark" }) : intl.formatMessage({ id: "history-smome-mark" })}</td>
                        <td>
                          {
                            actionId.indexOf(item.id) > -1 ? <a className="back-btn mainred" style={{ fontWeight: 500 }}>{intl.formatMessage({ id: "trading-orders-table-operationing" })}</a>
                              :
                              <a className="back-btn maingreen" style={{ fontWeight: 500 }} onClick={this.handleCancelClick.bind(this, item.id, item.market)}>{intl.formatMessage({ id: "trading-orders-table-operation" })}</a>
                          }
                        </td>
                      </tr> 
                    )
                  })
                }
              </tbody>
            </table>
            {
              orderList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page1} total={allPages1} onChange={this.changePage1} />
            }

          </TabPane>
          <TabPane className="tabpane" tab={intl.formatMessage({ id: "trading-trades-title" })} key="2">
            <table className="table font12">
              <thead>
                <tr className="black38 font12">
                  <th>{intl.formatMessage({ id: "trading-orders-table-th1" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th2" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th3" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th4" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th5" })}</th>
                  <th style={{display: window.innerWidth<=1040 ? 'none':'table-cell'}}>{intl.formatMessage({ id: "trading-orders-table-th6" })}</th>
                  <th>{intl.formatMessage({ id: "trading-orders-table-th7" })}</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(tradeList)&&tradeList.map((item) => {
                    return (
                      <tr key={item.tid}>
                        <td>{item.date.substr(-8)}</td>
                        <td>{item.name}</td>
                        <td>{item.type !== "sell" ? intl.formatMessage({ id: "trading-deal-bid-title" }) : intl.formatMessage({ id: "trading-deal-ask-title" })}</td>
                        <td>{item.price}</td>
                        {
                          item.volume === 0 ? <td className={`${item.type !== 'sell' ? "maingreen" : "mainred"}`}>
                            {item.volume}
                          </td> : <td className={`${item.type !== 'sell' ? "maingreen" : "mainred"}`}>
                              {/* {item.type === 'bid' ? "+" : "-"} */}
                              {item.volume}
                            </td>
                        }
                        <td style={{display: window.innerWidth<=1040 ? 'none':'table-cell'}}>{item.price}</td>
                        <td>{intl.formatMessage({ id: "history-done" })}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              tradeList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page2} total={allPages2} onChange={this.changePage2} />
            }

          </TabPane>
          <TabPane className="tabpane" tab={intl.formatMessage({ id: "history-deposit" })} key="3">
            <table className="table font12">
              <thead>
                <tr className="black38 font12">
                  <th>{intl.formatMessage({ id: "trading-orders-table-th1" })}</th>
                  <th>{intl.formatMessage({ id: "trading-market-table-th1" })}</th>
                  {/* <th>{intl.formatMessage({ id: "history-table-th-type" })}</th> */}
                  <th>{intl.formatMessage({ id: "history-table-th3" })}</th>
                  <th>{intl.formatMessage({ id: "history-table-th6" })}</th>
                  {/* <th>{intl.formatMessage({ id: "history-table-th7" })}</th> */}
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(depositList)&&depositList.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.createdAt}</td>
                        <td>{item.fundExtra.toUpperCase()}</td>
                        {/* <td>{}</td> */}
                        <td>{item.amount * 1}</td>
                        <td>{intl.formatMessage({ id: "history-" + item.aasmState + "" })}</td>
                        {/* <td className="maingreen">{item.aasmState === "wait" ? intl.formatMessage({ id: "history-cancel" }) : ""}</td> */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              depositList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page3} total={allPages3} onChange={this.changePage3} />
            }

          </TabPane>
          <TabPane className="tabpane" tab={intl.formatMessage({ id: "history-withdrawal" })} key="4">
            <table className="table font12">
              <thead>
                <tr className="black38 font12">
                  <th>{intl.formatMessage({ id: "trading-orders-table-th1" })}</th>
                  <th>{intl.formatMessage({ id: "trading-market-table-th1" })}</th>
                  {/* <th>{intl.formatMessage({ id: "history-table-th-type" })}</th> */}
                  <th>{intl.formatMessage({ id: "history-table-th3" })}</th>
                  <th>{intl.formatMessage({ id: "history-table-th6" })}</th>
                  <th>{intl.formatMessage({ id: "history-table-th7" })}</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(withdrawalList)&&withdrawalList.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.createdAt}</td>
                        <td>{item.fundExtra.toUpperCase()}</td>
                        {/* <td>{}</td> */}
                        <td>{item.sum}</td>
                        <td>{intl.formatMessage({ id: "history-" + item.aasmState + "" })}</td>
                        <td className="maingreen" onClick={this.changeCancel.bind(this, item.fundUid, item.fundExtra)}>{item.aasmState === "wait" ? intl.formatMessage({ id: "history-cancel" }) : ""}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              withdrawalList.length < 1 ? <div className="nullfile">
                <img src={require('../../../assets/image/Trading Market.jpg')} alt="" />
                <span className="black38">{intl.formatMessage({ id: "history-no-record" })}</span>
              </div> : <Pagination className="page" defaultCurrent={page4} total={allPages4} onChange={this.changePage4} />
            }

          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default injectIntl(History);