// "/admin/manageShop"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Container, Typography, useTheme, Divider, Paper,
} from '@material-ui/core'
import Trade from '../Trade'
import { yujinserver } from '../../restfulapi';
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList, LineChart, Line } from 'recharts';
import NameAvatarButton from '../common/NameAvatarButton';
import RawNameAvatar from '../common/RawNameAvatar';
import clsx from 'clsx';
import AdminSubheader from './ShopSubheader';
import { useSnackbar } from 'notistack';
import { push } from 'connected-react-router';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none'
  },
  summaryItem: {
    width: '15em'
  },
}));

const AdminChartPage = ({ authStore, push }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  
  const [shopSales, setShopSales] = useState([])
  const [monthlySales, setMonthlySales] = useState([])
  const [monthlyUserGrowth, setMonthlyUserGrowth] = useState([])
  const [shopSalesChart, setShopSalesChart] = useState(null)
  const [monthlySalesChart, setMonthlySalesChart] = useState(null)
  const [monthlyUserGrowthChart, setMonthlyUserGrowthChart] = useState(null)
  const formatNumberToKRW = (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

  useEffect(() => {
    if(authStore.session !== 'admin'){
      enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
      push("/")
    }
    else{
      fetch(yujinserver+"/shop", {credentials: 'include',})
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        setShopSales(json.sort((a,b) => b.sales - a.sales)
          .slice(0,5)
          .map((shop) => ({
            shopname: shop.shopname,
            sales: parseInt(shop.sales)
          }))
        )
      })
      fetch(yujinserver+"/growth/sales", {credentials: 'include',})
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        setMonthlySales(
          json.map((shop) => ({
            ym: shop.ym,
            sales: parseInt(shop.sales)
          }))
        )
      })
      fetch(yujinserver+"/growth/users", {credentials: 'include',})
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        setMonthlyUserGrowth(
          json.map((shop) => ({
            ym: shop.ym,
            users: parseInt(shop.users)
          }))
        )
      })
    }
  }, [authStore])

  useEffect(() => {
    setShopSalesChart(
      <ResponsiveContainer width="100%" height={theme.spacing(40)}>
        <BarChart data={shopSales} layout="vertical" margin={{left: theme.spacing(5), right: theme.spacing(5)}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatNumberToKRW} />
          <YAxis type="category" dataKey="shopname" />
          <Tooltip formatter={formatNumberToKRW} />
          <Bar dataKey="sales" name="판매실적" fill={theme.palette.primary.main} minPointSize={5} />
        </BarChart>
      </ResponsiveContainer>
    )
  }, [shopSales])
  useEffect(() => {
    setMonthlySalesChart(
      <ResponsiveContainer width="100%" height={theme.spacing(40)}>
        <LineChart data={monthlySales} margin={{left: theme.spacing(5), right: theme.spacing(5)}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ym" padding={{left: theme.spacing(3), right: theme.spacing(3)}} />
          <YAxis tickFormatter={formatNumberToKRW} />
          <Tooltip formatter={formatNumberToKRW} />
          <Line type="monotone" dataKey="sales" name="판매실적" stroke={theme.palette.primary.main} />
        </LineChart>
      </ResponsiveContainer>
    )
  }, [monthlySales])
  useEffect(() => {
    setMonthlyUserGrowthChart(
      <ResponsiveContainer width="100%" height={theme.spacing(40)}>
        <LineChart data={monthlyUserGrowth} margin={{left: theme.spacing(5), right: theme.spacing(5)}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ym" padding={{left: theme.spacing(3), right: theme.spacing(3)}} />
          <YAxis tickFormatter={(value) => value+"명"} />
          <Tooltip formatter={(value) => value+"명"} />
          <Line type="monotone" dataKey="users" name="가입자 수" stroke={theme.palette.primary.main} />
        </LineChart>
      </ResponsiveContainer>
    )
  }, [monthlyUserGrowth])

  const salesThisMonth = () => {
    if(monthlySales.length !== 0){
      const reverse = [...monthlySales].reverse()
      const thisMonth = reverse[0].sales
      if(reverse.length>1){
        const diff = thisMonth - reverse[1].sales
        if(diff > 0){
          return formatNumberToKRW(thisMonth)+" (+"+formatNumberToKRW(diff)+")"
        }
        else if(diff < 0){
          return formatNumberToKRW(thisMonth)+" ("+formatNumberToKRW(diff)+")"
        }
      }
      // last month is missing or diff is 0
      return formatNumberToKRW(thisMonth)+" (ー)"
    }
    else return ""
  }
  const subscriberThisMonth = () => {
    if(monthlyUserGrowth.length !== 0){
      const reverse = [...monthlyUserGrowth].reverse()
      const thisMonth = reverse[0].users
      if(reverse.length>1){
        const diff = thisMonth - reverse[1].users
        if(diff > 0){
          return thisMonth+"명 (+"+diff+"명)"
        }
        else if(diff < 0){
          return thisMonth+"명 ("+diff+"명)"
        }
      }
      // last month is missing or diff is 0
      return thisMonth+"명 (ー)"
    }
    else return ""
  }

  return(
    <Box display="flex" flexDirection="column" className={clsx({
      [classes.hide]: authStore.session !== 'admin'
    })}>
      <AdminSubheader />
      <Box>
        <Typography gutterBottom variant="h5">플랫폼 통계</Typography>
        <Divider />
      </Box>
      <Box p={1}>
        <Box p={2} component={Paper}>
          <Typography gutterBottom variant="h6">📈요약</Typography>
          <Divider />
          <Box p={1} display="flex" flexDirection="row" justifyContent="space-around">
            <Box display="flex" flexDirection="column" className={classes.summaryItem}>
              <Typography variant="body2">최고실적 쇼핑몰</Typography>
              <Typography>
                {shopSales.length !== 0?shopSales[0].shopname:""}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box display="flex" flexDirection="column" className={classes.summaryItem}>
              <Typography variant="body2">금월 판매실적 (전월대비)</Typography>
              <Typography>
                {salesThisMonth()}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box display="flex" flexDirection="column" className={classes.summaryItem}>
              <Typography variant="body2">금월 가입자수 (전월대비)</Typography>
              <Typography>
                {subscriberThisMonth()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography gutterBottom variant="h6">쇼핑몰 판매실적</Typography>
        <Divider />
        {shopSalesChart}
      </Box>
      <Box>
        <Typography gutterBottom variant="h6">월별 판매실적</Typography>
        <Divider />
        {monthlySalesChart}
      </Box>
      <Box>
        <Typography gutterBottom variant="h6">월별 가입자 수</Typography>
        <Divider />
        {monthlyUserGrowthChart}
      </Box>
    </Box>
  )
}

AdminChartPage.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminChartPage)
