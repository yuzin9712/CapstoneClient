// "/order/mypage"에서 확인하는 구매확인페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Container, Typography, Box, Divider, ButtonBase, Avatar, Paper, Stepper, Step, StepLabel,
} from '@material-ui/core'
import { yujinserver } from '../../restfulapi';
import OrderList from './OrderList';

const useStyles = makeStyles((theme) => ({

}));

const OrderMypage = ({}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [ orders, setOrders ] = useState([])

    useEffect(() => {
        if(loading){
            fetch(yujinserver+"/order",{
                credentials: "include",
            })
            .then((res) => res.json(),
            (err) => {console.log(err)})
            .then((data) => {
                setOrders(data)
                setLoading(false)
            })
        }
    } , [loading])

    const statusLookup = [
        "주문접수", "입금확인", "배송준비중", "발송", "배송완료"
    ]

    if(loading || (orders.length === 0)) return(<div>기달요</div>)
    else{
        // status: 1= 주문접수, 2= 입금확인, 3= 배송준비중, 4= 발송, 5= 배송완료
        console.log(orders)
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
                                            <Box>
                                                <Stepper activeStep={option.status-1}>
                                                    {statusLookup.map((label, index) => {
                                                        const completed = (index < option.status)
                                                        return <Step>
                                                            <StepLabel completed={completed}>{label}</StepLabel>
                                                        </Step>
                                                    })}
                                                </Stepper>
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Grid>
                            {/* <OrderList orders={order.orderDetails.map((option) => {
                                const detail = {
                                    img: option.product.img,
                                    pname: option.product.pname,
                                    price: option.price,
                                    quantity: option.cnt,
                                    color: option.color,
                                    size: option.size,
                                }
                                console.log(detail)
                                return detail
                            })} /> */}
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
