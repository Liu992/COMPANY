import React, { Component } from 'react';
import './CreateAd.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Form, Input, Button, Select, Icon, Pagination, message, InputNumber } from 'antd';
import * as service from '../../service/otc';
import { connect } from 'react-redux';

const Option = Select.Option;
const FormItem = Form.Item;
const mapStateToprops = (state) => {
  return {
    member: state.signAction.member
  }
}
@connect(mapStateToprops)
class CreateAd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencyList: [],
      createType: "",
      defaultDialog: false,
      allnum: 0,
      page: 1,
      adList: []
    }
  }
  componentDidMount() {
    this.verifycny()
    // 获取币种
    this.getCurrency();
    // 获取我的订单
    this.getMyOrders();
  }
  getMyOrders = () => {
    service.getMyOrders({
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
  createAD(type) {
    this.setState({
      createType: type,
      defaultDialog: true
    })
  }
  onClose = () => {
    this.setState({
      defaultDialog: false
    })
  }
  cancel(id) {
    let { intl } = this.props;
    service.actionAD({
      orderId: id
    })
      .then(res => {
        this.getMyOrders();
      })
      .catch(err => {
        if (err.code) {
          message.error(intl.formatMessage({ id: `createAd-order-${err.code}` }))
        } else {
          message.error(intl.formatMessage({ id: "createAd-handle-error" }))
        }
      })
  }
  // 新建买单/卖单
  handleSubmit = (e) => {
    let { intl, member } = this.props;
    let { createType } = this.state;
    e.preventDefault();
    if (!member.verify) {
      message.error(intl.formatMessage({ id: "fiatdeal-message-error" }));
      this.props.history.push('/certification')
      return false;
    }
    if (!member.ali && !member.bank && !member.wechat) {
      this.props.history.push('/setcny')
      return false;
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.amount || !values.minLimit || !values.price) {
          message.error(intl.formatMessage({id:"createAd-input-error"}))
          return false;
        }
        service.publish(createType, values)
          .then(res => {
            this.onClose()
            this.getMyOrders();
          })
          .catch(err => {
            if (err.code) {
              message.error(intl.formatMessage({ id: `createAd-${createType}-${err.code}` }))
            } else {
              message.error(intl.formatMessage({ id: "createAd-handle-error" }))
            }
          })
      }
    });
  }
  getCurrency = () => {
    service.getCurrency()
      .then(res => {
        this.setState({
          currencyList: res.currencys
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  verifycny = () => {
    service.verifycny()
      .then(res => {
        if (res.state === 'wait') {
          this.props.history.replace('/personal')
          return false
        }
        if (res.state === "no") {
          this.props.history.replace('/setcny')
          return false
        }
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    let { currencyList, defaultDialog, createType, allnum, adList } = this.state;
    return (
      <div className="createad">
        <Header />
        <div className="createad-box">
          <h1 className="createad-title">
            {intl.formatMessage({ id: "createAd-title" })}
            <span>
              <button onClick={this.createAD.bind(this, 'buy')}>{intl.formatMessage({ id: "createAd-newbtn1" })}</button>
              <button onClick={this.createAD.bind(this, 'sell')}>{intl.formatMessage({ id: "createAd-newbtn2" })}</button>
            </span>
          </h1>
          <div className="createad-list">
            <table className="createad-table">
              <thead>
                <tr>
                  <th>{intl.formatMessage({ id: "createAd-table-th1" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th2" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th3" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th4" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th5" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th6" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th7" })}</th>
                  <th>{intl.formatMessage({ id: "createAd-table-th8" })}</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(adList) && adList.map((item, ind) => {
                    return (
                      <tr key={ind}>
                        <td>{item.createdAt}</td>
                        <td>{item.currency}</td>
                        <td>{item.originVolume} {item.currency}</td>
                        <td>{item.minLimit} CNY</td>
                        <td>{item.price} CNY</td>
                        <td className={`${item.type === 'OrderAsk' ? "maingreen" : "mainred"}`}>{intl.formatMessage({ id: "createAd-" + item.type + "" })}</td>
                        <td>{intl.formatMessage({ id: "createAd-state-" + item.state + "" })}</td>
                        <td className="maingreen" onClick={this.cancel.bind(this, item.id)}>
                          <span>{item.state === 0 ? intl.formatMessage({ id: "createAd-cancel" }) : ""}</span>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <div className="createad-ul">
              <ul>
                {
                  Array.isArray(adList) && adList.map((item, ind) => {
                    return (
                      <li key={ind}>
                        <p className="time"><span>{intl.formatMessage({ id: "createAd-table-th1" })}</span>：{item.createdAt}</p>
                        <p className="coin"><span>{intl.formatMessage({ id: "createAd-table-th2" })}</span>：{item.currency}</p>
                        <p className="number"><span>{intl.formatMessage({ id: "createAd-table-th3" })}</span>：{item.originVolume} {item.currency}</p>
                        <p className="quota"><span>{intl.formatMessage({ id: "createAd-table-th4" })}</span>：{item.minLimit} CNY</p>
                        <p className="price"><span>{intl.formatMessage({ id: "createAd-table-th5" })}</span>：{item.price} CNY</p>
                        <p className={`type`}>
                          <span>{intl.formatMessage({ id: "createAd-table-th6" })}</span>：
                          <span className={`${item.type === 'OrderAsk' ? "maingreen" : "mainred"}`}>
                            {intl.formatMessage({ id: "createAd-" + item.type + "" })}
                          </span>
                        </p>
                        <p className="state"><span>{intl.formatMessage({ id: "createAd-table-th7" })}</span>：{intl.formatMessage({ id: "createAd-state-" + item.state + "" })}</p>
                        {
                          item.state === 0 ?
                            <p className="action">
                              <span>{intl.formatMessage({ id: "createAd-table-th8" })}</span>
                              <span onClick={this.cancel.bind(this, item.id)}>{item.state === 0 ? intl.formatMessage({ id: "createAd-cancel" }) : ""}</span>
                            </p>
                            : null
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            {
              allnum > 1 ? <Pagination onChange={this.changePage} total={allnum} /> : ""
            }

          </div>
          {
            defaultDialog ? <div className="createad-from">
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  label={intl.formatMessage({ id: "createAd-coin" })}
                >
                  {getFieldDecorator('currency', {
                    rules: [{ required: true, message: intl.formatMessage({ id: "createAd-inp1" }) }],
                  })(
                    <Select style={{ width: 171 }} onChange={this.handleChange}>
                      {
                        Array.isArray(currencyList) && currencyList.map((item, ind) => {
                          return <Option key={ind} value={item}>{item.toUpperCase()}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label={intl.formatMessage({ id: "createAd-amount" })}
                >
                  {getFieldDecorator('amount', {
                    rules: [{ required: true, message: intl.formatMessage({ id: "createAd-inp2" }) }],
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
                <FormItem
                  label={intl.formatMessage({ id: "createAd-limited" })}
                >
                  {getFieldDecorator('minLimit', {
                    rules: [{ required: true, message: intl.formatMessage({ id: "createAd-inp3" }) }],
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
                <FormItem
                  label={intl.formatMessage({ id: "createAd-price" })}
                >
                  {getFieldDecorator('price', {
                    rules: [{ required: true, message: intl.formatMessage({ id: "createAd-inp4" }) }],
                  })(
                    <InputNumber min={0} />
                  )}
                </FormItem>
                <Icon className="close" type="close" theme="outlined" onClick={this.onClose} />
                <FormItem>
                  <Button type="primary" htmlType="submit">{createType === 'buy' ? intl.formatMessage({ id: "createAd-newbtn1" }) : intl.formatMessage({ id: "createAd-newbtn1" })}</Button>
                </FormItem>
              </Form>
            </div> : null
          }

        </div>
        <Footer />
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(CreateAd);

export default WrappedRegistrationForm