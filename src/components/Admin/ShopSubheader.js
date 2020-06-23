import React from 'react'
import Subheader from '../Header/Subheader'

const menus = [
    {component: "요약/통계", path: "/admin/analyze"},
    {component: "쇼핑몰관리", path: "/admin/manageShop"},
    {component: "유저관리", path: "/admin/manageUser"},
];

const AdminSubheader = () => (
    <Subheader name="플랫폼관리페이지" menus={menus} additionalButton={null}/>
)

export default AdminSubheader