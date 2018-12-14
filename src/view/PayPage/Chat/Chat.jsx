import React, { Component } from 'react';
import './Chat.scss';
import { Icon } from 'antd';
import { connect } from 'react-redux';

let mapStateToProps = (state) => {
  return {
    memberId: state.signAction.member.id
  }
}
@connect(mapStateToProps)
class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      txt: "",
      historyList: [],
      receiveId: ""
    }
  }
  componentDidMount() {
    let { orderId, memberId } = this.props;
    window.ws.emit("first", {
      memberId,
      orderId
    })
    window.ws.on("history", (data) => {
      this.setState({
        historyList: data.data,
        receiveId: data.receiveId
      }, () => {
        this.refs.content.scrollTop = this.refs.content.scrollHeight
      })
    })
    window.ws.on("message", (data) => {
      this.updataList(data)
    })
  }

  changeTxt(e) {
    this.setState({
      txt: e.target.value
    })
  }
  onKeyup(e) {
    let ctrl = e.ctrlKey;
    let shift = e.shiftKey;
    let alt = e.altKey;
    if (e.keyCode === 13 && !ctrl && !shift && !alt) {
      e.preventDefault();
      this.sendMessage()
    }
  }
  sendMessage (){
    let { txt, receiveId } = this.state;
      let hour = new Date().getHours() * 1 < 10 ? "0" + new Date().getHours() : new Date().getHours()
      let minute = new Date().getMinutes() * 1 < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()
      let second = new Date().getSeconds() * 1 < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()
      window.ws.send({
        sendId: this.props.memberId,
        receiveId: receiveId,
        text: txt,
        time: hour + ":" + minute + ":" + second
      })
      this.updataList({
        sendId: this.props.memberId,
        receiveId: receiveId,
        text: txt.trim(),
        time: hour + ":" + minute + ":" + second
      })
      this.setState({ txt: "" })
  }
  updataList = (data) => {
    let arr = this.state.historyList;
    arr.push(data)
    this.setState({
      historyList: arr
    }, () => {
      this.refs.content.scrollTop = this.refs.content.scrollHeight
    })

  }
  render() {
    let { txt, historyList } = this.state;
    let { memberId, nickName } = this.props;
    return (
      <div className="chat">
        <div className="chat_header">
          <dl>
            <dt><Icon type="user" /></dt>
            <dd>
              <span>{nickName}</span>
            </dd>
          </dl>
        </div>
        <div className="chat_content" ref="content">
          <ul className="chat_list">
            {
              historyList && historyList.map((item, index) => {
                return (
                  <li className={item.sendId === memberId ? "my" : "his"} key={index}>
                    <dl>
                      <dt><Icon type="user" /></dt>
                      <dd>
                        <p>{item.text}</p>
                        <span>{item.time}</span>
                      </dd>
                    </dl>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="chat_input">
          <textarea name="" id="txt" value={txt} onKeyUp={this.onKeyup.bind(this)} onChange={this.changeTxt.bind(this)}></textarea>
          <button onClick={this.sendMessage.bind(this)}>发送</button>
        </div>
      </div>
    )
  }
}

export default Chat;