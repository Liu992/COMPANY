import 'babel-polyfill';
import reactDOMPolyfill from 'react-dom-polyfill';
import 'intl';
import React from 'react';
import 'react-dom';
import './index.scss';
import './assets/css/common.scss';
import './assets/fonts/demo.css';
import './assets/fonts/iconfont.css';
import "./assets/css/newantd.css";
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';
import { zh_CN, en_US } from './i8n'
// 国际化
import { addLocaleData, IntlProvider } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';

addLocaleData([...zh, ...en]);
const ReactDOM = reactDOMPolyfill(React);

export class AppBox extends React.Component {
  render() {
    let lang = '';
    if (window.localStorage.getItem('lang')) {
      lang = window.localStorage.getItem('lang');
    } else {
      lang = "zh";
    }
    var message = "";
    switch (lang) {
      case "zh":
        message = zh_CN
        break;
      case "en":
        message = en_US
        break;
      default:
        message = zh_CN
        break;
    }
    return (
      <IntlProvider
        locale={lang}
        messages={message}
      >
        <App />
      </IntlProvider>
    )
  }
}
ReactDOM.render(
  <Provider store={store}>
    <AppBox />
  </Provider>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}

// registerServiceWorker();