import React, { Component } from 'react';
import './News.scss';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import { Tabs } from 'antd';
import Kline from "@/component/Kline";
import { connect } from "react-redux";
import Formatter from '@/utils/formatter';

const TabPane = Tabs.TabPane;

const mapStateToProps = (state) => {
  return {
    markets: state.marketAction.markets,
    tickers: state.marketAction.tickers,
    klinedata: state.klineAction.data
  }
}
@connect(mapStateToProps)
class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bannerList: [
        {
          url: "",
          title: "投资价值"
        },
        {
          url: "",
          title: "投资价值"
        },
        {
          url: "",
          title: "投资价值"
        }
      ],
      dailyList: [
        {
          title: "投资价值的再思考——外传",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus……",
          from: "金色财经",
          asset_num: "2345",
          comments_num: "09876",
          date: "2018.11.30"
        },
        {
          title: "投资价值的再思考——外传",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus……",
          from: "金色财经",
          asset_num: "2345",
          comments_num: "09876",
          date: "2018.11.30"
        },
        {
          title: "投资价值的再思考——外传",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus……",
          from: "金色财经",
          asset_num: "2345",
          comments_num: "09876",
          date: "2018.11.30"
        }
      ],
      realtimeList: [

      ]
    }
  }
  shouldComponentUpdate(newprops) {
    if (!newprops.klinedata) {
      return false
    } else {
      return true;
    }
  }
  render() {
    let { bannerList, dailyList, realtimeList } = this.state;
    let { markets, tickers,klinedata } = this.props;
    
    return (
      <div className="news">
        <Header />
        <div className="news-box">
          <div className="news_left">
            <div className="left_banner">
              {
                bannerList.map((item, index) => {
                  return (
                    <dl className="dls" key={index}>
                      <dt>
                        {/* <img src={require('../../assets/image/help3-2.jpg')} alt="" /> */}
                      </dt>
                      <dd>{item.title}</dd>
                    </dl>
                  )
                })
              }
            </div>
            <div className="left_list">
              <div className="card-container">
                <Tabs type="card">
                  <TabPane tab="每日币头条" key="1">
                    <ul className="list_ul">
                      {
                        dailyList.map((item, index) => {
                          return (
                            <li key={index}>
                              <h2>{item.title}</h2>
                              <p>{item.content}</p>
                              <div className="note">
                                <span>
                                  <i>{item.from}</i>
                                  <i>{item.asset_num}</i>
                                  <i>{item.comments_num}</i>
                                </span>
                                <span>
                                  {item.date}
                                </span>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </TabPane>
                  <TabPane tab="实时币讯" key="2">
                    <p>Content of Tab Pane 2</p>
                    <p>Content of Tab Pane 2</p>
                    <p>Content of Tab Pane 2</p>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          <div className="news_right">
            <div className="coin_list">
              <ul>
                {
                  Array.isArray(markets) && markets.map((item, index) => {
                    let ticker = tickers[item.code];
                    let data = klinedata&&klinedata[item.code]
                    return (
                      <li key={index}>
                        <div className="li-left">
                          <b>{item.name}</b>
                          <span><i>{Formatter.fixBid(ticker.last)}</i><i>{Formatter.priceChange(ticker.open, ticker.last) == '+NaN' ? '+0.00' : Formatter.priceChange(ticker.open, ticker.last)}%</i></span>
                        </div>
                        {/* <div className="li-right"> */}
                          <Kline name={"li_right" + index} widthSize={200} heightSize={100} show={false} data={data} />
                        {/* </div> */}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default News