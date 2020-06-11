import React from 'react'
import Subheader from '../Header/Subheader'

const menus = [
    {component: "요약/통계", path: "/shop/analyze"},
    {component: "상품목록", path: "/shop/mypage"},
    {component: "상품등록", path: "/shop/addproduct"},
    {component: "주문관리", path: "/shop/order"},
];

const ShopSubheader = () => (
    <Subheader menus={menus} additionalButton={null}/>
)

export default ShopSubheader