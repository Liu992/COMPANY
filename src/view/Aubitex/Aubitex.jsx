import React, { Component } from 'react';
import './Aubitex.scss';
import Header from '../../component/Header';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import * as service from '../../service/marketService';
import * as server from '../../service/loginService';
import { NavLink } from 'react-router-dom';
import Footer from '../../component/Footer';
import { connect } from 'react-redux';
import sign from '../../store/action/signAction';
import Coin from './Coin';

const mapStateToProps = (state) => {
  return {
    isLogin: state.signAction.isLogin,
    tradeData: state.marketAction
  }
}
@connect(mapStateToProps)
class Aubitex extends Component {
  initBanner = () => {
    let { swiperContainer } = this.refs;
    new Swiper(swiperContainer, {
      // effect: 'fade',
      loop: true,
      noSwipingClass: 'stop-swiping',
      // 如果需要分页器
      pagination: '.swiper-pagination',
      paginationClickable: true,
      autoplayDisableOnInteraction: false,
      observer: true,
      observeParents: true,
      autoplay: 4000,
    })
  }
  componentWillMount() {
    server.tokenSignin().then((data) => {
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
  componentDidMount() {
    this.onReconnect()
    this.initBanner();
    this.initNotice()
  }
  initNotice = () => {
    let { noticeContainer } = this.refs;
    new Swiper(noticeContainer, {
      direction: 'vertical',
      autoplay: 4000,
    })
  }
  onReconnect = () => {
    //error 10 stop
    window.ws.on('reconnect_attempt', (attemptNumber) => {
      if (attemptNumber > 10) {
        window.ws.close();
      }
    });
  }

  render() {
    let { marketPrices, markets, tickers } = this.props.tradeData
    let { intl, isLogin } = this.props;
    return (
      <div className="aubitex-home">
        <Header />
        <div className="home-content" style={{ padding: 0 }}>
          {/* banner */}
          <div className="banner">
            <div className="swiper-container" ref="swiperContainer">
              <div className="swiper-wrapper">
                <div className="swiper-slide stop-swiping">
                  <div className="slide-top">
                    <span className="slide-tip">COMPANY</span>
                    <h1>
                      <span className="maingreen">1234567890</span>
                      qwertyuiop
                    </h1>
                  </div>

                  <p>asdfghjkl</p>
                </div>
                <div className="swiper-slide stop-swiping">
                  <div className="slide-top">
                    <span className="slide-tip">COMPANY</span>
                    <h1>
                      <span className="maingreen">1234567890</span>qwertyuiop
                    </h1>
                  </div>
                  <p>asdfghjkl</p>
                </div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
          <div className="centerbox" style={{ width: "100%" }}>
            {/* 公告 */}
            <div className="home-notice">
              <div className="swiper-container" ref="noticeContainer">
                <div className="swiper-wrapper">
                  <div className="swiper-slide"><img src={require('../../assets/image/notice.png')} alt="" /> Slide 1</div>
                  <div className="swiper-slide"><img src={require('../../assets/image/notice.png')} alt="" /> Slide 2</div>
                  <div className="swiper-slide"><img src={require('../../assets/image/notice.png')} alt="" /> Slide 3</div>
                </div>
              </div>
            </div>
            {
              // 单个币价图
              <div className="home-coinlist">
                <Coin intl={intl} markets={markets} tickers={tickers} marketPrices={marketPrices} />
              </div>
            }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Aubitex