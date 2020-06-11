import React from 'react'
import Subheader from '../Header/Subheader'

const menus = [
    {component: "공유한 디자인", path: "/mypage/design"},
    {component: "내 커뮤니티 글", path: "/mypage/community"},
];

const MypageSubheader = () => (
    <Subheader menus={menus} additionalButton={null}/>
)

export default MypageSubheader