import React, { Component } from 'react';
import './AssetsHistory.scss';
import { Link } from 'react-router-dom';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import History from './History';

class AssetsHistory extends Component {
  render() {
    let { intl } = this.props;
    return (
      <div className="assets-history">
        <Header />
        <div className="history-box">
          <div className="hisory-path">
            <Link to="/myassets"><span className="maingreen">{intl.formatMessage({id: "history-toassets-left"})}</span></Link>
            <Link to="/myassets"><span className="black60"> > {intl.formatMessage({id: "history-toassets-right"})}</span></Link>
          </div>
          <History/>
        </div>
        <Footer/>
      </div>
    )
  }
}


export default AssetsHistory