import React, { Component } from 'react';
import './LoginHeader.scss';
import {Link} from 'react-router-dom';

class LoginHeader extends Component {
  componentWillMount () {
    
  }
  render() {
    return (
      // logo
      <div className="login-header">
        <div className="logo">
          {/* <Link to="/"><img src={require('../../assets/image/1.jpg')} alt="" /></Link> */}
          <Link to="/" style={{fontSize: "20px", fontWeight:500,letterSpacing:"2px"}}>COMPANY</Link>
        </div>
      </div>
    )
  }
}

export default LoginHeader