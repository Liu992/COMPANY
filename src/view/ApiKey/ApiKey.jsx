import React, { Component } from 'react';
import './ApiKey.scss';
import Header from '../../component/Header';
import { Link } from 'react-router-dom';
import Footer from '@/component/Footer';
import utils from '@/utils/util.js';

class ApiKey extends Component {
  constructor(props) {
    super(props)
    this.state = {
      on: false,
      defaultTime: 60,
      timer: null
    }
  }
  componentWillMount () {
    utils.pageScale(1)
  }
  onSend = () => {
    this.setState({
      on: true,
      defaultTime: 60
    }, () => {
      this.stateTime()
    })
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
  componentWillUnmount () {
    clearInterval(this.state.timer)
  }
  render() {
    let {intl} = this.props;
    let { on, defaultTime } = this.state;
    return (
      <div className="apikey">
        <Header />
        <div className="apikey-center">
          <div className="apikey-router">
            <span className="maingreen"><Link className="maingreen" to="/personal">{intl.formatMessage({id: "apikey-torouter-left"})}</Link></span>
            <span className="black60"> > {intl.formatMessage({id: "apikey-torouter-right"})}</span>
          </div>
          <h1 className="apikey-header font24 headcolor"><span>{intl.formatMessage({id: "apikey-title"})}</span></h1>
          <hr />

          <div className="apikey-form">
            <span className="font12 black60">{intl.formatMessage({id: "apikey-input1-name"})}</span>
            <input type="text" className="borderblack12 black87" />
            <span className="font12 black60">{intl.formatMessage({id: "apikey-input2-name"})}</span>
            <input type="text" className="borderblack12 black87" />
            <span className="font12 black60">{intl.formatMessage({id: "apikey-input3-name"})}</span>
            <p>
              <input type="text" className="borderblack12" />
              {/* <button className="maingreen">{intl.formatMessage({id: "apikey-send"})}</button> */}
              <button className={`maingreen send ${on ? 'already-send' : 'not-send'}`} onClick={this.onSend} disabled={on}>{!on ? intl.formatMessage({id: "apikey-send"}) : defaultTime + 's'}</button>
            </p>
            <button className="greenbackground borderblack12 btngreenhover">{intl.formatMessage({id: "apikey-confirm"})}</button>
          </div>
          <div className="apikey-table">
            <h1 className="font16 headcolor">{intl.formatMessage({id: "apikey-table-title"})}</h1>
            <hr/>
            <table>
              <thead>
                <tr className="black38">
                  <th>{intl.formatMessage({id: "apikey-table-th1"})}</th>
                  <th>{intl.formatMessage({id: "apikey-table-th1"})}</th>
                  <th>{intl.formatMessage({id: "apikey-table-th1"})}</th>
                  <th>{intl.formatMessage({id: "apikey-table-th1"})}</th>
                  <th>{intl.formatMessage({id: "apikey-table-th1"})}</th>
                </tr>
              </thead>
              <tbody className="black60">
                <tr>
                  <td><span>2018-08-22 16:22:20</span></td>
                  <td><span>TEST_01</span></td>
                  <td><span>123133-231414jds-123131</span></td>
                  <td className="run"><span><i></i>{intl.formatMessage({id: "apikey-table-state-running"})}</span></td>
                  <td><span className="maingreen">{intl.formatMessage({id: "apikey-table-action"})}</span></td>
                </tr>
                <tr>
                  <td><span>2018-08-22 16:22:20</span></td>
                  <td><span>TEST_01</span></td>
                  <td><span>123133-231414jds-123131</span></td>
                  <td className="run"><span><i></i>{intl.formatMessage({id: "apikey-table-state-running"})}</span></td>
                  <td><span className="maingreen">{intl.formatMessage({id: "apikey-table-action"})}</span></td>
                </tr>
                <tr>
                  <td><span>2018-08-22 16:22:20</span></td>
                  <td><span>TEST_01</span></td>
                  <td><span>123133-231414jds-123131</span></td>
                  <td className="run"><span><i></i>{intl.formatMessage({id: "apikey-table-state-disabled"})}</span></td>
                  <td><span className="maingreen">{intl.formatMessage({id: "apikey-table-action"})}</span></td>
                </tr>
                <tr>
                  <td><span>2018-08-22 16:22:20</span></td>
                  <td><span>TEST_01</span></td>
                  <td><span>123133-231414jds-123131</span></td>
                  <td className="run"><span><i></i>{intl.formatMessage({id: "apikey-table-state-disabled"})}</span></td>
                  <td><span className="maingreen">{intl.formatMessage({id: "apikey-table-action"})}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}

export default ApiKey