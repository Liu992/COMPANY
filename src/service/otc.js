import util from '../utils/util';

/********setcny*********/
// 获取认证类型
export const getPayType = () => {
    return util.fetch({
        url: "/api/c2c/pay/type",
        method: 'get'
    })
}
// 验证cny
export const payMode = (data) => {
    return util.fetch({
        url: "/api/c2c/create/update/paymode",
        method: "post",
        data:data
    })
}

// 判断是否通过 cny验证
export const verifycny = () => {
    return util.fetch({
        url: "/api/c2c/my/auth/status",
        method: "get"
    })
}

// 发布广告
export const publish = (path, data) => {
    return util.fetch({
        url: "/api/c2c/"+path+"/coin",
        method: "post",
        data
    })
}

export const getCurrency = () => {
    return util.fetch({
        url: "/api/c2c/bit/currencys",
        method: "get"
    })
}

export const getMyOrders = (data) => {
    return util.fetch({
        url: "/api/c2c/orders/my/orders",
        method: "post",
        data
    })
}
// 撤销订单
export const actionAD = (data) => {
    return util.fetch({
        url: "/api/c2c/orders/cancel/order",
        method: "post",
        data
    })
}

// 获取c2c订单
export const getDealList = (deal,currency,limit,page) => {
    return util.fetch({
        url: "/api/c2c/orders/"+deal+"/"+currency+"/"+limit+"/"+page+"",
        method: "get"
    })
}
//吃掉单
export const tradeAd = (type, data) => {
    return util.fetch({
        url: "/api/c2c/orders/transaction/"+type+"",
        method: "post",
        data
    })
}
// 获取我的所有订单
export const getMyAllOrder = (data) => {
    return util.fetch({
        url: "api/c2c/orders/my/trades",
        method: "post",
        data
    })
}

// 获取订单信息get
export const getTradeMessage = (id) => {
    return util.fetch({
        url: "/api/c2c/orders/my/trade/"+id+"",
        method: "get"
    })
}

// 去付款
export const goPay = (data) => {
    return util.fetch({
        url: "/api/c2c/orders/transaction/hadpay",
        method: "post",
        data
    })
}

// 取消订单
export const cancelOrder = (data) => {
    return util.fetch({
        url: "/api/c2c/orders/cancel/trade",
        method: "post",
        data
    })
}

// 同意付款 
export const setAgree = (data) => {
    return util.fetch({
        url: "/api/c2c/orders/transaction/true",
        method: "post",
        data
    })
}