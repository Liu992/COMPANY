import React, { Component } from 'react';
import './Signin.scss';
import LoginHeader from '../../component/LoginHeader';
import RouteInfo from '../../component/RouteInfo';
import Footer from '../../component/Footer';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return {
    isLogin: state.signAction.isLogin
  }
}
@connect(mapStateToProps, null, null, {pure: false})
class Signin extends Component {
  componentDidUpdate () {
    if (this.props.isLogin) {
      this.props.history.replace('/')
    }
  }
  render() {
    return (
      <div className="signin">
        <LoginHeader />
        <div className="signin-content">
          <RouteInfo routes={this.props.route} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default Signin