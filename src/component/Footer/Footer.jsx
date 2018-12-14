import React, { Component } from 'react';
import './Footer.scss';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="f-l">
          <span>@ 2018-2020 Dongfang City Ltd. All rights reserved.</span>
          <span><i>API Access</i><em>|</em><i>Terms of service</i></span>
        </div>
        <div className="f-r">
          <ul>
            <li><i className="iconfont icon-au-xinxi"></i><em>|</em></li>
            <li><i className="iconfont icon-au-qq"></i><em>|</em></li>
            <li><i className="iconfont icon-au-weixin"></i><em>|</em></li>
            <li><i className="iconfont icon-au-fasong"></i></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Footer