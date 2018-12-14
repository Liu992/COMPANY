import util from '../utils/util';

/********assets*********/

export const myassets = () => {
    return util.fetch({
        url: "/api/asset",
        method: 'get'
    })
};

export const orderHistory = (page) => {
    return util.fetch({
        url: "/api/asset/orderHistory",
        method: "post",
        data: {
            page
        }
    })
}

export const tradeHistory = (page) => {
    return util.fetch({
        url: "/api/asset/tradeHistory",
        method: "post",
        data: {
            page
        }
    })
}

export const getAddress = (type) => {
    return util.fetch({
        url: "/api/deposit/" + type + "/gen_address",
        method: "get",
        // data: {}
    })
}

export const withdraw = (data) => {
    return util.fetch({
        url: "/api/withdraw",
        method: "post",
        data: data
    })
}

export const getdeposit = (page) => {
    return util.fetch({
        url: "/api/deposit/record",
        method: "post",
        data: {
            curPage: page
        }
    })
}

export const getwithdrawal = (page) => {
    return util.fetch({
        url: "/api/withdraw/record",
        method: "post",
        data: {
            curPage: page
        }
    })
}

export const cancelWithdrawal = (data) => {
    return util.fetch({
        url: "/api/withdraw/cancel",
        method: "post",
        data: data
    })
}

export const withdrawSendSMS = () => {
    return util.fetch({
        url: "/api/withdraw/sendSMS",
        method: 'get'
    })
}

export const withdrawSendEmail = () => {
    return util.fetch({
        url: "/api/withdraw/sendEmail",
        method: 'get'
    })
}

export const withdrawVerify = (data) => {
    return util.fetch({
        url: "/api/withdraw/verify",
        method: 'post',
        data: data
    })
}

// 提币限额
export const searchNation = (type) => {
    return util.fetch({
        url: "/api/withdraw/fee",
        method: 'post',
        data: {
            currency: type
        }
    })
}


// 判断是否实名认证
export const ifVerify = () => {
    return util.fetch({
        url: "/api/withdraw/verified",
        method: 'get'
    })
}
/*提币地址管理*/
// 获取币种
export const getCoin = () => {
    return util.fetch({
        url: "/api/withdraw/currencys",
        method: 'get'
    })
}
// 添加地址
export const addAddress = (data) => {
    return util.fetch({
        url: "/api/withdraw/address",
        method: 'post',
        data:data
    })
}
// 获取地址
export const getAllAddress = () => {
    return util.fetch({
        url: "/api/withdraw/address",
        method: 'get'
    })
}
// 删除地址
export const deleteAddress = (id) => {
    return util.fetch({
        url: "/api/withdraw/address",
        method: 'delete',
        data: id 
    })
}