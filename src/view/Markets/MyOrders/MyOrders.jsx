import React, { PureComponent } from 'react';
import './MyOrders.scss';
import { Tabs, message } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as service from '@/service/marketService';

const mapStateToProps = (state) => {
  return {
    sign: state.signAction
  }
}
@withRouter
@connect(mapStateToProps)
class MyOrders extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      actionId: []
    }
  }
  handleCancelClick(orderId, e) {
    e.preventDefault();
    let { id } = this.props.match.params;
    let { intl } = this.props;
    let { actionId } = this.state;
    service.cancel(id, { orderId: orderId }).then((data) => {
      if (data.isSuccess) {
        let mess = intl.formatMessage({ id: "trading-deal-cancel-success" });
        actionId.push(orderId)
        this.setState({
          actionId: actionId
        })
        // message.success(mess);
      } else {
        let mess = intl.formatMessage({ id: "trading-deal-cancel-fail" });
        message.error(mess);
      }
    });
  }

  render() {
    let { intl, myOrders, myTrades, sign, market } = this.props;
    let { actionId } = this.state;
    let orderLoad = true;
    let tradeLoad = true;
    if (!myOrders || myOrders.length === 0 || sign.isLogin === false) {
      orderLoad = false;
    }
    if (!myTrades || myTrades.length === 0 || sign.isLogin === false) {
      tradeLoad = false;
    }
    return (
      <div className="order">
        <div className="order-table">
          {/* 球 */}
          <button className="order-title">当前委托</button>
          {
            // 判断有无数据
            !orderLoad ?
              <h1 className="nothave font20">{intl.formatMessage({ id: "trading-not-data" })}</h1> :
              <div className="tablebox">
                <table className="font12">
                  <thead>
                    <tr>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th1" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th2" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th3" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th4" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th5" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th6" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th7" })}</th>
                      <th>{intl.formatMessage({ id: "trading-orders-table-th8" })}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      Array.isArray(myOrders) && myOrders.map((order, i) => {
                        return (
                          <tr key={i}>
                            <td>{order.createdAt.substring(5)}</td>
                            <td>{order.name}</td>
                            <td>{intl.formatMessage({ id: `trading-orders-table-direction-${order.type}` })}</td>
                            <td>{order.price}</td>
                            <td>{order.usedVolume} / {order.originVolume}</td>
                            <td>{order.price}</td>
                            <td>{intl.formatMessage({ id: `trading-orders-table-state-${order.state}` })}</td>
                            <td>
                              {
                                actionId.indexOf(order.id) > -1 ? <a className="back-btn mainred">{intl.formatMessage({ id: "trading-orders-table-operationing" })}</a>
                                  :
                                  <a className="back-btn maingreen" onClick={this.handleCancelClick.bind(this, order.id)}>{intl.formatMessage({ id: "trading-orders-table-operation" })}</a>
                              }
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
          }
        </div>
        <div className="order-table">
          <button className="order-title">委托历史</button>
          {
            // 判断有无数据
            tradeLoad ?
              <h1 className="nothave font20">{intl.formatMessage({ id: "trading-not-data" })}</h1> :
              <div className="tablebox">
                <table className="font12">
                  <thead>
                    <tr>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th1" })}</th>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th2" })}</th>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th3" })}</th>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th4" })}</th>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th5" })}</th>
                      <th>{intl.formatMessage({ id: "trading-trades-table-th6" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Array.isArray(myTrades) && myTrades.map((trade, i) => {
                        return (
                          <tr key={i}>
                            <td>{trade.date.substring(5)}</td>
                            <td>{market.name}</td>
                            <td>{intl.formatMessage({ id: `trading-orders-table-direction-${trade.kind}` })}</td>
                            <td>{trade.price}</td>
                            <td>{trade.volume}</td>
                            <td>{trade.price}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default injectIntl(MyOrders);