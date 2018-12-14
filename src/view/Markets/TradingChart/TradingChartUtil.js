import $ from 'jquery';

const datafeedConfig = (params) => {
  const { resolution, Datafeeds, serverUrl, pushInterval, lang, market } = params;
  let style = {
    up: "#00FF71",
    down: "#FF5733",
    bg: "#fff", // 背景色
    grid: "#fff",
    cross: "#9194A3",
    border: "#fff",
    text: "rgba(0,0,0,.7)",
    areatop: "rgba(122, 152, 247, .1)",
    areadown: "rgba(122, 152, 247, .02)"
  };
  return {
    debug: false,
    timezone: "Asia/Shanghai",
    supports_search: true,
    supports_group_request: false,
    supports_marks: true,
    exchanges: [
      { value: "", name: "All Exchanges", desc: "" },
      { value: "XETRA", name: "XETRA", desc: "XETRA" },
      { value: "NSE", name: "NSE", desc: "NSE" }
    ],
    symbolsTypes: [
      { name: "All types", value: "" },
      { name: "Stock", value: "stock" },
      { name: "Index", value: "index" }
    ],
    supportedResolutions: ["1", "15", "30", "60", "D", "2D", "3D", "W", "3W", "M", '6M'],
    symbol: 'AAPL', // 标志
    // BEWARE: no trailing slash is expected in feed URL
    datafeed: new Datafeeds.UDFCompatibleDatafeed(serverUrl, pushInterval, null, market),// 数据处理
    interval: resolution, // 时间间隔
    container_id: 'tv_chart_container', // id容器
    library_path: '/charting_library/',
    custom_css_url: 'night.css',
    enabled_features: ['dont_show_boolean_study_arguments', 'side_toolbar_in_fullscreen_mode', "hide_last_na_study_output",], // 启用特性
    charts_storage_api_version: '1.1',// 图表存储api版本
    client_id: 'tradingview.com',// 客户id
    user_id: 'public_user_id',// 用户id
    fullscreen: false,// 撑满屏幕
    autosize: true,// 自动大小
    toolbar_bg: '#fff', // 按钮区域背景色
    loading_screen: { backgroundColor: "#fff" }, // loading背景
    locale: lang,
    drawings_access: {
      type: 'black',
      tools: [{
        name: 'Regression Trend',
      }],
    },
    disabled_features: [
      // "left_toolbar",
      // "header_widget",
      'header_symbol_search',
      'use_localstorage_for_settings',
      'symbol_search_hot_key',
      'header_chart_type',
      'header_compare',
      'header_undo_redo',
      'header_screenshot',
      'header_saveload',
      // "header_indicators",
      'volume_force_overlay',
      'timeframes_toolbar',
      'context_menus',
      // 'property_pages', // 禁用 高开低收旁边的设置选项
      'adaptive_logo',
      'volume_fosrce_overlay',
      'control_bar',  //底部的导航按钮 
      // 'header_settings', //设置
      'header_resolutions',  //时间下拉框
    ],
    overrides: {
      'volumePaneSize': "medium",
      'supports_marks': false,
      'paneProperties.topMargin': '22',
      'supports_timescale_marks': true,
      "scalesProperties.lineColor": style.text,
      "scalesProperties.textColor": style.text,
      "paneProperties.background": style.bg,
      "paneProperties.vertGridProperties.color": style.grid,
      "paneProperties.horzGridProperties.color": style.grid,
      "paneProperties.crossHairProperties.color": style.cross,
      "paneProperties.legendProperties.showLegend": false, //控制MA展开
      "paneProperties.legendProperties.showStudyArguments": true,
      "paneProperties.legendProperties.showStudyTitles": true,
      "paneProperties.legendProperties.showStudyValues": true,
      "paneProperties.legendProperties.showSeriesTitle": true,
      "paneProperties.legendProperties.showSeriesOHLC": true,
      "mainSeriesProperties.candleStyle.upColor": style.up,
      "mainSeriesProperties.candleStyle.downColor": style.down,
      "mainSeriesProperties.candleStyle.drawWick": true,
      "mainSeriesProperties.candleStyle.drawBorder": true,
      "mainSeriesProperties.candleStyle.borderColor": style.border,
      "mainSeriesProperties.candleStyle.borderUpColor": style.up,
      "mainSeriesProperties.candleStyle.borderDownColor": style.down,
      "mainSeriesProperties.candleStyle.wickUpColor": style.up,
      "mainSeriesProperties.candleStyle.wickDownColor": style.down,
      "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.hollowCandleStyle.upColor": style.up,
      "mainSeriesProperties.hollowCandleStyle.downColor": style.down,
      "mainSeriesProperties.hollowCandleStyle.drawWick": true,
      "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
      "mainSeriesProperties.hollowCandleStyle.borderColor": style.border,
      "mainSeriesProperties.hollowCandleStyle.borderUpColor": style.up,
      "mainSeriesProperties.hollowCandleStyle.borderDownColor": style.down,
      "mainSeriesProperties.hollowCandleStyle.wickColor": style.line,
      "mainSeriesProperties.haStyle.upColor": style.up,
      "mainSeriesProperties.haStyle.downColor": style.down,
      "mainSeriesProperties.haStyle.drawWick": true,
      "mainSeriesProperties.haStyle.drawBorder": true,
      "mainSeriesProperties.haStyle.borderColor": style.border,
      "mainSeriesProperties.haStyle.borderUpColor": style.up,
      "mainSeriesProperties.haStyle.borderDownColor": style.down,
      "mainSeriesProperties.haStyle.wickColor": style.border,
      "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.barStyle.upColor": style.up,
      "mainSeriesProperties.barStyle.downColor": style.down,
      "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
      "mainSeriesProperties.barStyle.dontDrawOpen": false,
      "mainSeriesProperties.lineStyle.color": style.border,
      "mainSeriesProperties.lineStyle.linewidth": 1,
      "mainSeriesProperties.lineStyle.priceSource": "close",
      "mainSeriesProperties.areaStyle.color1": style.areatop,
      "mainSeriesProperties.areaStyle.color2": style.areadown,
      "mainSeriesProperties.areaStyle.linecolor": style.border,
      "mainSeriesProperties.areaStyle.linewidth": 1,
      "mainSeriesProperties.areaStyle.priceSource": "close",
      linetoolflatbottom: {
        linecolor: 'rgba( 73, 133, 231, 1)',
        linewidth: 2.0,
        // linestyle: LINESTYLE_SOLID,
        fillBackground: true,
        // backgroundColor: 'rgba( 21, 56, 153, 0.5)',
        backgroundColor: 'rgba(0,0,0,1)',
        transparency: 50,
        extendLeft: false,
        extendRight: false,
        // leftEnd: LINEEND_NORMAL,
        // rightEnd: LINEEND_NORMAL,
        font: 'Verdana',
        textcolor: 'rgba( 73, 133, 231, 1)',
        fontsize: 12,
        bold: false,
        italic: false,
        showPrices: false,
        showPriceRange: false,
        showDateTimeRange: false,
        showBarsRange: false
      }

    },
    studies_overrides: {
      //  "volume.volume.color.0": "#fff",
      //   "volume.volume.color.1": "#fff",
      //   "volume.volume.transparency": 70,
      //   "volume.volume ma.color": "#fff", 
      //  "volume.volume ma.transparency": 30,
      //  "volume.volume ma.linewidth": 5,
      //   "volume.show ma": false,
      //   "volume.options.showStudyArguments": true,
      //   "bollinger bands.median.color": "red",
      //   "bollinger bands.upper.linewidth": 7
    },
    time_frames: [
      { text: "50y", resolution: "6M", description: "50 Years" },
      { text: "3y", resolution: "W", description: "3 Years", title: "3yr" },
      { text: "8m", resolution: "D", description: "8 Month" },
      { text: "3d", resolution: "5", description: "3 Days" },
      { text: "1000y", resolution: "W", description: "All", title: "All" },
    ]
  }
};

const chartReady = (widget) => {
  const buttonArr = [
    {
      value: '1',
      en: '1min',
      zh: '1分',
      ko: "1 점",
      zh_Hant: '1分',
      chartType: 3,
    },
    {
      value: '5',
      en: '5min',
      ko: "5 점",
      zh_Hant: '5分',
      zh: '5分',
    },
    {
      value: '15',
      en: '15min',
      ko: "15 점",
      zh_Hant: '15分',
      zh: '15分',
    },
    {
      value: '60',
      en: '1hour',
      ko: "1 시간",
      zh_Hant: '1小時',
      zh: '1小时',
    },
    {
      value: '240',
      en: '4hour',
      ko: "4 시간",
      zh_Hant: '4小時',
      zh: '4小时',
    },
    {
      value: '1D',
      en: '1D',
      ko: "1 일",
      zh_Hant: '日線',
      zh: '日线',
    },
    {
      value: '1W',
      en: '1W',
      ko: "1 주",
      zh_Hant: '週線',
      zh: '周线',
    },
    {
      value: '1M',
      en: '1M',
      ko: "1 달",
      zh_Hant: '月線',
      zh: '月线',
    },
  ];

  let btn = {};
  const handleClick = (e, value, i) => {
    window.localStorage.setItem('k_line', value)
    widget.chart().setResolution(value);
    $(e.target).addClass('select').closest('div.space-single').siblings('div.space-single').find('div.button').removeClass('select');
  };
  buttonArr.forEach((v, i) => {
    btn = widget.createButton().on('click', (e) => {
      window.hasWsMessage = false
      handleClick(e, v.value, i);
    });

    if (window.localStorage.getItem('lang')) {
      if (window.localStorage.getItem('lang') === "zh-Hant") {
        btn[0].innerHTML = v.zh_Hant;
        btn[0].title = v.zh_Hant;
      } else {
        btn[0].innerHTML = v[window.localStorage.getItem('lang')];
        btn[0].title = v[window.localStorage.getItem('lang')];
      }
    } else {
      btn[0].innerHTML = v.zh;
      btn[0].title = v.zh;
    }
    if (!window.localStorage.getItem('k_line')) {
      if (i === 1) {
        btn[0].className += ' select';
      }
    } else {
      if (window.localStorage.getItem('k_line') === v.value) {
        btn[0].className += ' select'
      }
    }
  });
};
// store.subscribe(() => {
//   let state = store.getState();   //这就是你获取到的数据state tree，由于使用了subscribe，当数据更改时会重新获取
//   datafeedConfig.locale = state.intlLang.lang
// });
export default {
  datafeedConfig,
  chartReady,
};
