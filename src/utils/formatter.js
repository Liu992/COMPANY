import BigNumber from 'bignumber.js';

let Formatter = {};

Formatter.round = function(str, fixed) {
  return BigNumber(str).toFixed(fixed);
};

Formatter.fix = function(type, str) {
  if (BigNumber(str).isNaN()) {
    str = '0';
  }
  if (type === 'ask') {
    return Formatter.round(str, gon.market&&gon.market.ask.fixed);
  } else if (type === 'bid') {
    return Formatter.round(str, gon.market&&gon.market.bid.fixed);
  }
};

Formatter.fixAsk = function(str) {
  return Formatter.fix('ask', str);
};

Formatter.fixBid = function(str) {
  return Formatter.fix('bid', str);
};

// Formatter.fixPriceGroup = function(str) {
//   if (gon.market.priceGroupFixed) {
//     if (BigNumber(str).isNaN()) {
//       str = '0';
//     }
//     return Formatter.round(str, gon.market.price_group_fixed);
//   } else {
//     return Formatter.fixBid(str);
//   }
// };

Formatter.checkTrend = function(type) {
  if (type === 'up' || type === 'buy' || type === 'bid' || type === true) {
    return true;
  } else if (type === 'down' || type === "sell" || (type = 'ask' || type === false)) {
    return false;
  } else {
    throw "unknown trend smybol " + type;
  }
};

// Formatter.market = function(base, quote) {
//   return "" + (base.toUpperCase()) + "/" + (quote.toUpperCase());
// };

// Formatter.market_url = function(market, order_id) {
//   if (order_id != null) {
//     return "/markets/" + market + "/orders/" + order_id;
//   } else {
//     return "/markets/" + market;
//   }
// };

// Formatter.trade = function(ask_or_bid) {
//   return gon.i18n[ask_or_bid];
// };

// Formatter.short_trade = function(type) {
//   if (type === 'buy' || type === 'bid') {
//     return gon.i18n['bid'];
//   } else if (type === "sell" || (type = 'ask')) {
//     return gon.i18n['ask'];
//   } else {
//     return 'n/a';
//   }
// };

// Formatter.trade_time = function(timestamp) {
//   let m;
//   m = moment.unix(timestamp);
//   return "" + (m.format("HH:mm")) + (m.format(":ss"));
// };

// Formatter.fulltime = function(timestamp) {
//   let m;
//   m = moment.unix(timestamp);
//   return "" + (m.format("MM/DD HH:mm"));
// };

// Formatter.mask_price = function(price) {
//   return price.replace(/\..*/, "<g>$&</g>");
// };

// Formatter.mask_fixed_price = function(price) {
//   return Formatter.mask_price(Formatter.fixPriceGroup(price));
// };

// Formatter.tickerFill = ['', '0', '00', '000', '0000', '00000', '000000', '0000000', '00000000'];

// Formatter.ticker_price = function(price, fillTo) {
//   let fill, left, right, _ref;
//   if (fillTo == null) {
//     fillTo = 6;
//   }
//   _ref = price.split('.'), left = _ref[0], right = _ref[1];
//   if (fill = Formatter.tickerFill[fillTo - right.length]) {
//     return "" + left + ".<g>" + right + "</g><span class='fill'>" + fill + "</span>";
//   } else {
//     return "" + left + ".<g>" + (right.slice(0, fillTo)) + "</g>";
//   }
// };

Formatter.priceChange = function(p1, p2) {
  let percent = p1 ? Formatter.round(100 * (p2 - p1) / p1, 2) : '0.00';
  if (percent == 'NaN') {
    percent = "0.00"
  }
  return "" + (p1 > p2 ? '' : '+') + percent;
};

// Formatter.longTime = function(timestamp) {
//   let m;
//   m = moment.unix(timestamp);
//   return "" + (m.format("YYYY/MM/DD HH:mm"));
// };

// Formatter.maskFixedVolume = function(volume) {
//   return Formatter.fixAsk(volume).replace(/\..*/, "<g>$&</g>");
// };

Formatter.amount = function(amount, price) {
  let val = new BigNumber(amount).times(price);
  return Formatter.fix('ask', val);
  // return Formatter.fixAsk(val).replace(/\..*/, "<g>$&</g>");
};

Formatter.trend = function(type) {
  if (Formatter.checkTrend(type)) {
    return "main-green"; //up
  } else {
    return "mainred";   //down
  }
};

// Formatter.trend_icon = function(type) {
//   if (Formatter.checkTrend(type)) {
//     return "<i class='fa fa-caret-up text-up'></i>";
//   } else {
//     return "<i class='fa fa-caret-down text-down'></i>";
//   }
// };

export default Formatter;