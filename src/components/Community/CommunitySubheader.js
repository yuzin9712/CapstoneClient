import React from 'react'
import Subheader from '../Header/Subheader'

const menus = [
    {component: "⚡최신순", path: "/community/recent"},
    // {component: "👑인기 게시글", path: "/community/best"},
    {component: "💭내 게시글", path: "/community/mypage"},
    {component: "💗좋아요 누른 게시글", path: "/community/like"},
    {component: "📣팔로우 유저 게시글", path: "/community/follow"},
    {component: "커뮤니티 글쓰기", path: "/community/write"},
];

const CommunitySubheader = () => (
    <Subheader menus={menus}/>
)

export default CommunitySubheader