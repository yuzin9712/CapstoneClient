import React from 'react'
import { Route, Switch } from 'react-router'

import MainPage from '../components/MainPage'
import ProductCategoryPage from '../components/Product/ProductCategoryPage'
import ProductDetailPage from '../components/Product/ProductDetailPage'
import ProductSearchPage from '../components/Product/ProductSearchPage'

import OrderPlacePage from '../components/Order/OrderPlacePage'
import OrderMypage from '../components/Order/OrderMypage'
import OrderCartPage from '../components/Order/OrderCartPage'


// designs
import DesignRecentPage from '../components/Design/DesignRecentPage'
import DesignBestPage from '../components/Design/DesignBestPage'
import DesignMypage from '../components/Design/DesignMypage'
import DesignLikepage from '../components/Design/DesignLikePage'
import DesignFollowPage from '../components/Design/DesignFollowPage'
import DesignHashtagSearchPage from '../components/Design/DesignHashtagSearchPage'

import PostWritePage from '../components/Community/PostWritePage'
import CommunityRecentPage from '../components/Community/CommunityRecentPage'
import PostDetailPage from '../components/Community/PostDetailPage'


import ShopAddProduct from '../components/Shop/ShopAddProduct'
import ShopOrders from '../components/Shop/ShopOrders'
import ShopMypage from '../components/Shop/ShopMypage'
import ShopAnalyze from '../components/Shop/ShopAnalyze'

import NoMatch from '../components/NoMatch'
import CommunityFollowPage from '../components/Community/CommunityFollowPage'
import CommunityMypage from '../components/Community/CommunityMypage'
import CommunityLikePage from '../components/Community/CommunityLikePage'
import AdminManageShopPage from '../components/Admin/AdminManageShopPage'
import Mypage from '../components/Mypage/Mypage'
import AdminChartPage from '../components/Admin/AdminChartPage'
import AdminManageUserPage from '../components/Admin/AdminManageUserPage'


// import LoginPage from '../components/Login/LoginPage'
// import AuthPage from '../components/Auth/AuthPage'

// import LoginTest from '../components/LoginTest'
// import PostTester from '../components/PostTester'

const routes = (
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/productList/category/:id" component={ProductCategoryPage} /> 
        <Route path="/productList/search" component={ProductSearchPage} /> 
        <Route path="/productDetail/:id" component={ProductDetailPage} /> 

        <Route path="/order/placeorder" component={OrderPlacePage} /> 
        <Route path="/order/myorder" component={OrderMypage} /> 
        <Route path="/order/cart" component={OrderCartPage} /> 


        <Route path="/design/recent" component={DesignRecentPage} /> 
        <Route path="/design/best" component={DesignBestPage} /> 
        <Route path="/design/mydesign" component={DesignMypage} /> 
        <Route path="/design/like" component={DesignLikepage} />
        <Route path="/design/follow" component={DesignFollowPage} /> 
        <Route path="/design/hashtag/:tag" component={DesignHashtagSearchPage} /> 
        <Route path="/design/" component={DesignBestPage} /> 

        <Route path="/community/write" component={PostWritePage}/> 
        <Route path="/community/post/:id" component={PostDetailPage}/> 
        <Route path="/community/recent" component={CommunityRecentPage}/>
        <Route path="/community/follow" component={CommunityFollowPage}/>
        <Route path="/community/mypage" component={CommunityMypage}/>
        <Route path="/community/like" component={CommunityLikePage}/>
        <Route path="/community/" component={CommunityRecentPage}/>

        
        <Route path="/mypage/:id" component={Mypage}/>

        <Route path="/shop/addproduct" component={ShopAddProduct} /> 
        <Route path="/shop/order" component={ShopOrders} /> 
        <Route path="/shop/mypage" component={ShopMypage} /> 
        <Route path="/shop/analyze" component={ShopAnalyze} /> 
        <Route path="/shop/" component={ShopAnalyze} /> 

        
        <Route path="/admin/manageUser" component={AdminManageUserPage} /> 
        <Route path="/admin/manageShop" component={AdminManageShopPage} /> 
        <Route path="/admin/analyze" component={AdminChartPage} /> 
        <Route path="/admin/" component={AdminChartPage} /> 

        <Route component={NoMatch} />
      </Switch>
)

export default routes
