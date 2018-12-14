import React, { Component } from 'react';
import './RouteInfo.scss';
import { Route, Redirect } from 'react-router-dom';
import {injectIntl} from 'react-intl';
import utils from '../../utils/util';

class RouteInfo extends Component {
  render() {
    let { routes, intl } = this.props;
    let isLogin = utils.getCookie('Authorization');
    return routes.map((item, index) => {
      return (
        <Route key={index} exact={item.exact} path={item.path} render={(props) => {
          return !this.props.isLogin&&item.authority&&!isLogin&&item.path!=='/'?<Redirect to="/sign/in"/>:<item.component {...props} route={item.children} intl={intl} />
        }} />
      )
    })
  }
}



export default injectIntl(RouteInfo)