import React, { Component } from 'react';
import './App.scss';
import { newRouterMap } from './routerMap';
import RouteInfo from './component/RouteInfo';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import sign from './store/action/signAction';
import * as service from './service/loginService';
import { connect } from 'react-redux';

@connect(null, null, null, { pure: false })
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false
    }
  }
  componentWillMount() {
    service.tokenSignin().then((data) => {
      let result = {};
      if (data.member) {
        this.setState({
          isLogin: true
        }, () => {
          result = {
            isLogin: true,
            member: data.member
          }
        })
      } else {
        this.setState({
          isLogin: false
        }, () => {
          result = {
            isLogin: false,
            member: {
              email: null,
              sms: null,
              google: null,
              verify: false,
            }
          }
        })

      }
      this.props.dispatch(sign(result));
    });
  }
  render() {
    return (
      <div className="wrapper">
        <Router>
          <Switch>
            <RouteInfo routes={newRouterMap} intl={this.props.intl} isLogin={this.state.isLogin} />
          </Switch>
        </Router >
      </div>
    );
  }
}

export default injectIntl(App);