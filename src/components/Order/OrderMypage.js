// "/order/mypage"에서 확인하는 구매확인페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Container, Typography, Box, Divider, ButtonBase, Avatar, Paper, Stepper, Step, StepLabel, Button,
} from '@material-ui/core'
import { yujinserver } from '../../restfulapi';
import OrderList from './OrderList';
import moment from 'moment';
import { Link } from 'react-router-dom';
import NameAvatarButton from '../common/NameAvatarButton';

const useStyles = makeStyles((theme) => ({

}));

const OrderMypage = ({}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [ orders, setOrders ] = useState([])
    const [carriers, setCarriers] = useState([])

    useEffect(() => {
    }, [])

    useEffect(() => {
      if(loading){

        fetch('https://apis.tracker.delivery/carriers')
        .then(
          (res) => res.json(),
          (error) => console.error(error)
        )
        .then((carriers) => {
          setCarriers(carriers)
          fetch(yujinserver+"/order",{
              credentials: "include",
          })
          .then((res) => res.json(),
          (error) => {console.error(error)})
          .then((data) => {
              setOrders(data)
              setLoading(false)
          })
        })

      }
    } , [loading])

    const statusLookup = [
        "주문접수", "입금확인", "배송준비중", "발송", "배송완료"
    ]

    if(loading || (orders.length === 0) || (carriers.length === 0)) return(<div>기달요</div>)
    else{
        // status: 1= 주문접수, 2= 입금확인, 3= 배송준비중, 4= 발송, 5= 배송완료
        return(
            <Container maxWidth="md">
                <Typography variant="h6">내 주문내역</Typography>
                <Divider />
                {orders.map((order) => {
                    return (
                        <Box m={2} p={1} component={Paper}>
                            <Typography>주문일: {moment(order.createdAt).toDate().toLocaleString()}</Typography>
                            <Typography>총 결제액: {order.total}원</Typography>
                            <Grid container direction="column">
                                {order.orderDetails.map((order) => {
                                  const carrierName = (order.zipCode !== null?
                                    (carriers.find((carrier) => carrier.id === order.zipCode)).name
                                    : ""
                                  )
                                  if(order.product !== null){
                                    return(
                                      <Box py={1}>
                                        <Box p={1} flexGrow={1} display="flex" flexDirection="column"
                                        component={Paper}>
                                          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                              <ButtonBase component={Link} to={"/productDetail/"+order.product.id}>
                                                <Avatar src={order.product.img} variant="rounded" />
                                              </ButtonBase>
                                              <Box display="flex" flexDirection="column">
                                                <Typography gutterBottom>{order.product.pname}</Typography>
                                                <Typography gutterBottom variant="body2">{order.color}, {order.size} ／ {order.product.price}원 ✕ {order.cnt} ＝ {order.price}원</Typography>
                                              </Box>
                                            </Box>
                                            <Typography>상태: {statusLookup[order.status-1]}</Typography>
                                          </Box>
                                          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                                              <Typography>쇼핑몰: </Typography>
                                              <NameAvatarButton name={order.product.shopAdmin.shopname} userId={order.product.shopAdmin.userId} />
                                              <Typography>{order.product.shopAdmin.shopname}</Typography>
                                            </Box>
                                            {carrierName !== ""?(
                                              <Box display="flex" flexDirection="row" alignItems="center" >
                                                <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Box>
                                                <Button variant="outlined" component={Link} to={"https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice} target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice);}} >
                                                  배송조회
                                                </Button>
                                              </Box>
                                            ):(
                                              <Box display="flex" flexDirection="row" alignItems="center" >
                                                {/* <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Box> */}
                                                <Button disabled variant="outlined" >
                                                  배송 준비중
                                                </Button>
                                              </Box>
                                            )}
                                          </Box>
                                        </Box>
                                      </Box>
                                    )
                                  }
                                  else{
                                    return(
                                      <Box py={1}>
                                        <Box p={1} flexGrow={1} display="flex" flexDirection="column"
                                        component={Paper}>
                                          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                              <Typography variant="body2">판매중지된 상품에 대한 구매입니다.</Typography>
                                            </Box>
                                            <Typography>상태: {statusLookup[order.status-1]}</Typography>
                                          </Box>
                                          <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                                            {carrierName !== ""?(
                                              <Box display="flex" flexDirection="row" alignItems="center" >
                                                <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Box>
                                                <Button variant="outlined" component={Link} to={"https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice} target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice);}} >
                                                  배송조회
                                                </Button>
                                              </Box>
                                            ):(
                                              <Box display="flex" flexDirection="row" alignItems="center" >
                                                {/* <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Box> */}
                                                <Button disabled variant="outlined" >
                                                  배송 준비중
                                                </Button>
                                              </Box>
                                            )}
                                          </Box>
                                        </Box>
                                      </Box>
                                    )
                                  }
                                })}
                            </Grid>
                        </Box>
                    )
                })}
            </Container>
        )
    }
}

OrderMypage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderMypage)
