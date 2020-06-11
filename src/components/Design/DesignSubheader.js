import React from 'react'
import Subheader from '../Header/Subheader'
import DesignWrite from './DesignWrite'

const menus = [
    {component: "👑BEST 디자인", path: "/design/best"},
    {component: "⚡최신순", path: "/design/recent"},
    {component: "💭내 디자인", path: "/design/mydesign"},
    {component: "💗좋아요 누른 디자인", path: "/design/like"},
    {component: "📣팔로우한 디자인", path: "/design/follow"},
    // {component: "🔥인기 태그", path: "/design/hashtag"},
];

const DesignSubheader = () => (
    <Subheader menus={menus} additionalButton={<DesignWrite />}/>
)

export default DesignSubheader