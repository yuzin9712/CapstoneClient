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
      
    }
}));

const OrderList = ({order, carriers, reload}) => {
  const classes = useStyles();
  const [zipCode, setZipCode] = useState("")
  const { register, handleSubmit, errors } = useForm();

  const statusLookup = [
    "주문접수", "입금확인", "배송준비중", "발송", "배송완료"
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
          console.log("성공이요")
          reload()
        }
        else console.log("실패요")
      })
    }
  }
  const handleZipcodeChange = (event) => {
    setZipCode(event.target.value)
  }
  console.log(carriers.carrierList)
  const carrierName = (order.zipCode !== null?
    (carriers.carrierList.find((carrier) => carrier.id === order.zipCode)).name
    : ""
  )
  const invoiceForm = (carrierName !== ""?
    <Box display="flex" flexDirection="row" alignItems="center">
      <Typography gutterBottom variant="body2">{carrierName} / 운송장번호: {order.t_invoice}</Typography>
      <Button variant="outlined" component={Link} to={"https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice} target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://tracker.delivery/#/"+order.zipCode+"/"+order.t_invoice);}} >보기</Button>
    {/* <Button component={Link} >배송조회</Button> */}
    </Box>
  : <form onSubmit={handleSubmit(updateInvoice)}>
      <FormControl>
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
    <Box p={1} flexGrow={1} display="flex" flexDirection="row" alignItems="center">
      <ButtonBase component={Link} to={"/productDetail/"+order.product.id}>
        <Avatar src={order.product.img} variant="rounded" />
      </ButtonBase>
      <Box flexGrow={1}>
        <Typography gutterBottom>{order.product.pname}</Typography>
        <Typography gutterBottom variant="body2">{order.color}, {order.size} ／ {order.product.price}원 ✕ {order.cnt} ＝ {order.price}원</Typography>
      </Box>
      <Box>
        {invoiceForm}
        <Stepper activeStep={order.status-1}>
          {statusLookup.map((label, index) => {
              const completed = (index < order.status)
              return(
              <Step>
                  <StepLabel completed={completed}>{label}</StepLabel>
              </Step>
              ) 
          })}
        </Stepper>
      </Box>
    </Box>
  )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps)(OrderList)