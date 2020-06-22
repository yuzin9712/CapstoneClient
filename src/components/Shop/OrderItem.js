// 장바구니,상품구매에서 보는 상품목록표
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    ButtonBase,
    Box,
    Typography,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yujinserver } from '../../restfulapi';
import NameAvatarButton from '../common/NameAvatarButton';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root:{
      flexGrow: 1,
      '& > *': {
        padding: theme.spacing(1),
      },
    },
    thumbnail: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    price: {
      color: theme.palette.primary.main
    },
    formControl: {
      width: '100%',
    },
    table: {

    },
    hide: {
      display: 'none',
    },
    contentPanel: {
      
    },
    select: {
      minWidth: 120,
    },
}));

const OrderList = ({order, carriers, reload}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [zipCode, setZipCode] = useState("")
  const { register, handleSubmit, errors } = useForm();

  const statusLookup = [
    "주문접수", "입금확인", "배송준비", "발송완료", "배송완료"
  ]


  const updateInvoice = (data) => {
    if(zipCode !== "" && data.invoice !== ""){
      fetch(yujinserver+"/shop/delivery/"+order.id,{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          invoice: data.invoice,
          zipCode: zipCode,
        }),
        credentials: 'include',
      })
      .then(
        (res) => res.text(),
        (error) => console.error(error)
      )
      .then((text) => {
        if(text === 'Success') {
          enqueueSnackbar("배송 정보를 등록했습니다.",{"variant": "success"});
          reload()
        }
        else{
          enqueueSnackbar("배송 정보 등록에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
      })
    }
  }
  const handleZipcodeChange = (event) => {
    setZipCode(event.target.value)
  }
  const carrierName = (order.zipCode !== null?
    (carriers.carrierList.find((carrier) => carrier.id === order.zipCode)).name
    : ""
  )
  const invoiceForm = (carrierName !== ""?
  <Box display="flex" flexDirection="row" alignItems="center" >
    <Box p={1} component={Typography} gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Box>
    <Button variant="outlined" component={Link} to={"https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice} target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice);}} >
      배송현황
    </Button>
    {/* <Button component={Link} >배송조회</Button> */}
    </Box>
  : <form onSubmit={handleSubmit(updateInvoice)}>
      <FormControl className={classes.select}>
        <InputLabel>배송사</InputLabel>
        <Select 
        value={zipCode}
        onChange={handleZipcodeChange}
        displayEmpty
        required
        >
          {carriers.menu}
        </Select>
      </FormControl>
      <TextField 
      inputRef={register({required: true})}
      required
      name={"invoice"}
      label="운송장번호"
      InputLabelProps={{
      shrink: true,
      }}/>
      <Button variant="outlined" type="submit">송장번호 입력</Button>
      {/* <Button variant="outlined">배송 완료처리</Button> */}
    </form>
  )

  return (
    <Box py={1} px={10}>
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
            <Typography>구매자: </Typography>
            <NameAvatarButton name={order.order.user.name} userId={order.order.user.id} />
            <Typography>{order.order.user.name}</Typography>
          </Box>
          {invoiceForm}
        </Box>
        {/* <Stepper activeStep={order.status-1}>
          {statusLookup.map((label, index) => {
              const completed = (index < order.status)
              return(
              <Step>
                  <StepLabel completed={completed}>{label}</StepLabel>
              </Step>
              ) 
          })}
        </Stepper> */}
      </Box>
    </Box>
  )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps)(OrderList)