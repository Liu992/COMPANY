import React, { Component } from 'react';
import './LoginHistory.scss';
import utils from '../../../utils/util'

class LoginHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      historyList: null
    }
  }
  componentWillMount() {
    this.getSignHistory() // 登录历史
  }
  getSignHistory = () => {
    utils.fetch({
      url: '/api/sign/history',
      method: 'get'
    })
      .then(res => {
        this.setState({
          historyList: res.history
        })
      })
      .catch(err => {
        throw err;
      })
  }
  render() {
    let { historyList } = this.state;
    let { intl } = this.props;
    console.log(historyList)
    return (
      <div className="login-history">
        <div className="history-table">
          <ul className="history-ul">
            {
              historyList&&historyList.map((item, ind) => {
                return <li key={ind}>
                  <span className="black60">{item.createdAt}</span>
                  <span style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }} className="black60">{item.ip}</span>
                  <span style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-celll' }} className="black60">{item.address}</span>
                  <span className="black60">{intl.formatMessage({ id: "center-history-state-suc" })}</span>
                </li>
              })
            }
          </ul>
          {/* <table>
            <thead>
              <tr>
                <th className="black38">{intl.formatMessage({ id: "center-history-table-th1" })}</th>
                <th style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }} className="black38">{intl.formatMessage({ id: "center-history-table-th2" })}</th>
                <th style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-celll' }} className="black38">{intl.formatMessage({ id: "center-history-table-th3" })}</th>
                <th className="black38">{intl.formatMessage({ id: "center-history-table-th4" })}</th>
              </tr>
            </thead>
            <tbody>
              {
                Array.isArray(historyList) && historyList.map((item, ind) => {
                  return (
                    <tr key={ind}>
                      <td className="black60">{item.createdAt}</td>
                      <td style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-cell' }} className="black60">{item.ip}</td>
                      <td style={{ display: window.innerWidth <= 1040 ? 'none' : 'table-celll' }} className="black60">{item.address}</td>
                      <td className="black60">{intl.formatMessage({ id: "center-history-state-suc" })}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table> */}
        </div>
      </div>
    )
  }
}
export default LoginHistory;