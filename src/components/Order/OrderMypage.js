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
                <Typography>내 주문내역</Typography>
                <Divider />
                {orders.map((order) => {
                    return (
                        <Box m={2} p={1} component={Paper}>
                            <Typography>주문일 {order.createdAt}</Typography>
                            <Typography>총 결제액: {order.total}원</Typography>
                            <Grid container direction="column">
                                {order.orderDetails.map((option) => {
                                  const carrierName = (option.zipCode !== null?
                                    (carriers.find((carrier) => carrier.id === option.zipCode)).name
                                    : ""
                                  )
                                    return(
                                        <Box p={1} flexGrow={1} display="flex" flexDirection="row" alignItems="center">
                                            <ButtonBase>
                                                <Avatar src={option.product.img} variant="rounded" />
                                            </ButtonBase>
                                            <Box flexGrow={1}>
                                                <Typography gutterBottom variant="body2">{option.product.seller}</Typography>
                                                <Typography gutterBottom>{option.product.pname}</Typography>
                                                <Typography gutterBottom variant="body2">{option.color}, {option.size} ／ {option.product.price}원 ✕ {option.cnt} ＝ {option.price}원</Typography>
                                            </Box>
                                            {option.t_invoice !== null?(
                                                <Box display="flex" flexDirection="row" alignItems="center" >
                                                  <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {option.t_invoice}</Box>
                                                  <Button variant="outlined" onClick={(event) => {event.preventDefault(); window.open("https://tracker.delivery/#/"+option.zipCode+"/"+option.t_invoice);}} >
                                                    배송조회
                                                  </Button>
                                                {/* <Button component={Link} >배송조회</Button> */}
                                                </Box>
                                              ):(
                                                <Box>
                                                  <Typography>배송 준비중입니다.</Typography>
                                                </Box>
                                              )}
                                              {/* <Stepper activeStep={option.status-1}>
                                                    {statusLookup.map((label, index) => {
                                                        const completed = (index < option.status)
                                                        return <Step>
                                                            <StepLabel completed={completed}>{label}</StepLabel>
                                                        </Step>
                                                    })}
                                                </Stepper>
                                            </Box>
                                                </Stepper> */}
                                        </Box>
                                    )
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
