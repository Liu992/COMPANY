import Loadable from 'react-loadable';
import React from 'react';
  let obj = {
    width: "100%",
    position: 'fixed',
    top: '150px',
    left: '0',
    textAlign: "center",
    fontSize: "46px",
    color: "#8c9295"
  }
function MyLoadingComponent(props) {
  if (props.error) {
    return <div style={{ textAlign: 'center', fontSize: '30', paddingTop: '60', color: '#3dadd9' }}>加载出错啦，请刷新页面</div>;
  } else if (props.pastDelay) {
    return <div style={obj}>COMPANY</div>;
  } else {
    return null;
  }
}
function MyLoadable (opts) {
  return Loadable(Object.assign({
    loading: MyLoadingComponent,
    delay: 200
  }, opts));
}

// 首页
let Aubitex = MyLoadable({
  loader: () => import('../view/Aubitex')
});

// 交易资产
let MyAssets = MyLoadable({
  loader: () => import('../view/MyAssets')
});
// 充币页
let Deposit = MyLoadable({
  loader: () => import('../view/MyAssets/Deposit')
});
// 提币页
let Withdraw = MyLoadable({
  loader: () => import('../view/MyAssets/Withdraw')
});
// 资产历史
let AssetsHistory = MyLoadable({
  loader: () => import('../view/AssetsHistory')
});
// 提币地址管理
let AssetAddress = MyLoadable({
  loader: () => import('../view/AssetAddress')
});

// 交易所
let TradingMarket = MyLoadable({
  loader: () => import('../view/Markets')
});
// 法币交易
let Fiatdeal = MyLoadable({
  loader: () => import('../view/Fiatdeal')
});
// cny设置
let SetCNY = MyLoadable({
  loader: () => import('../view/SetCNY')
});
// 发布广告
let CreateAd = MyLoadable({
  loader: () => import('../view/CreateAd')
});
// 我的订单
let MyOrder = MyLoadable({
  loader: () => import('../view/MyOrder')
});
// 支付页面
let PayPage = MyLoadable({
  loader: () => import('../view/PayPage')
});

// 设置页
let Signin = MyLoadable({
  loader: () => import('../view/Signin')
});
// 登录
let LoginPage = MyLoadable({
  loader: () => import('../view/LoginPage')
});
// email验证
let VerifyEmail = MyLoadable({
  loader: () => import('../view/VerifyEmail')
})
// 验证成功
let EmailSuc = MyLoadable({
  loader: () => import('../view/EmailSuc')
})
// 注册
let Signup = MyLoadable({
  loader: () => import('../view/Signup')
});
// 用户协议
let Agreement = MyLoadable({
  loader: () => import('../view/Signup/Agreement')
})


// news页
let News = MyLoadable({
  loader: () => import('../view/News')
})
// 分享
let Share = MyLoadable({
  loader: () => import('../view/Share')
})

// 个人中心
let Personal = MyLoadable({
  loader: () => import('../view/Personal')
})
// 修改密码
let ChangePass = MyLoadable({
  loader: () => import('../view/ChangePass')
})
// 设置手机号码
let SetPhone = MyLoadable({
  loader: () => import('../view/SetPhone')
})
// 修改手机号
let ChangePhone = MyLoadable({
  loader: () => import('../view/ChangePhone')
})
// 设置邮箱
let SetEmail = MyLoadable({
  loader: () => import('../view/SetEmail')
})
// 设置谷歌验证
let GoogleAuthenticator = MyLoadable({
  loader: () => import('../view/GoogleAuthenticator')
})
// 重置谷歌验证
let ResetGoogle = MyLoadable({
  loader: () => import('../view/ResetGoogle')
})
// apikey
let ApiKey = MyLoadable({
  loader: () => import('../view/ApiKey')
})
// 实名认证
let Certification = MyLoadable({
  loader: () => import('../view/Certification')
})

// 忘记密码
let RetrievePassword = MyLoadable({
  loader: () => import('../view/RetrievePassword')
})

let Authentication = MyLoadable({
  loader: () => import('../view/PasswordAuthentication')
})


let ForgotChangePass = MyLoadable({
  loader: () => import('../view/ForgotChangePass')
})

export let newRouterMap = [
  {
    path: '/',
    exact: true,
    component: Aubitex
  },
  {
    path: '/tradingmarket',
    exact: true,
    component: TradingMarket
  },
  {
    path: '/tradingmarket/:id',
    exact: false,
    component: TradingMarket
  },
  {
    path: '/fiatdeal',
    exact: false,
    component:Fiatdeal
  },
  {
    path: '/news',
    exact: false,
    component: News
  },
  {
    path: '/setcny',
    exact: false,
    component: SetCNY,
    authority: true
  },
  {
    path:"/myorder",
    exact: false,
    component: MyOrder
  },
  {
    path: "/paypage/:id",
    exact: false,
    component: PayPage
  },
  {
    path: '/share',
    exact: false,
    component: Share
  },
  {
    path: '/createad',
    exact: false,
    component: CreateAd,
    authority: true
  },
  {
    path: '/myassets',
    exact: false,
    component: MyAssets,
    authority: true
  },
  {
    path: '/deposit/:type',
    exact: false,
    component: Deposit,
    authority: true
  },
  {
    path: '/withdraw/:type',
    exact: false,
    component: Withdraw,
    authority: true
  },
  {
    path: '/assetshistory',
    exact: false,
    component: AssetsHistory,
    authority: true
  },
  {
    path: "/assetaddress",
    exact: false,
    component: AssetAddress,
    authority: true
  }
  ,
  {
    path: '/sign',
    exact: false,
    component: Signin,
    children: [
      {
        path: '/sign/in',
        exact: false,
        component: LoginPage,
      },
      {
        path: '/sign/up',
        exact: false,
        component: Signup
      },
      {
        path: '/sign/email',
        exact: false,
        component: VerifyEmail
      },
      {
        path: '/sign/emailsuc',
        exact: false,
        component: EmailSuc
      },
      {
        path: '/sign/retrievepassword',
        exact: false,
        component: RetrievePassword
      },
      {
        path: "/sign/authentication",
        exact: false,
        component: Authentication
      },
      {
        path: "/sign/forgotchangepass",
        exact: false,
        component: ForgotChangePass
      },
      {
        path: "/sign/agreement",
        exact: false,
        component: Agreement
      }
    ]
  },
  {
    path: '/personal',
    exact: false,
    component: Personal,
    authority: true
  },
  {
    path: '/changepass',
    exact: false,
    component:ChangePass,
    authority: true
  },
  {
    path: '/changephone',
    exact: false,
    component: ChangePhone,
    authority: true
  },
  {
    path: '/gaauth',
    exact: false,
    component: GoogleAuthenticator,
    authority: true
  },
  {
    path: '/resetgoogle',
    exact: false,
    component:ResetGoogle,
    authority: true
  },
  {
    path: '/apikey',
    exact: false,
    component: ApiKey,
    authority: true
  },
  {
    path: '/certification',
    exact: false,
    component: Certification,
    authority: true
  },
  {
    path: '/setphone',
    exact: false,
    component: SetPhone,
    authority: true
  },
  {
    path: '/setemail',
    exact: false,
    component: SetEmail,
    authority: true
  }
]

export default {
  newRouterMap
}