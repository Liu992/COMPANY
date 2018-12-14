import util from '../utils/util';

/********main*********/
export const init = (code) => {
  return util.fetch({
    url: `/api/market/${code}`,
    method: "get",
  });
};

export const loadTrades = (code) => {
  return util.fetch({
    url: `/api/market/${code}/loadtrades`,
    method: "get",
  });
};

export const bid = (code, data) => {
  return util.fetch({
    url: `/api/market/${code}/order_bid`,
    data: data
  });
};

export const ask = (code, data) => {
  return util.fetch({
    url: `/api/market/${code}/order_ask`,
    data: data
  });
};

export const cancel = (code, data) => {
  return util.fetch({
    url: `/api/market/${code}/order_cancel`,
    data: data
  });
};

export const getValuation = () => {
  return util.fetch({
    url: `/api/market/valuation/bit`,
    method: 'get'
  })
}