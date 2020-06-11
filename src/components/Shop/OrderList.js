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
import OrderItem from './OrderItem';

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

const OrderList = ({orders, carriers, reload}) => {
  const classes = useStyles();
  const [orderItemComponents, setOrderItemComponents] = useState([])

  useEffect(() => {
    if(orders !== undefined && carriers !== undefined){
      const optionMenu = carriers.map((carrier) => {
        return(
          <MenuItem value={carrier.id}>
            {carrier.name}
          </MenuItem>
        )
      })
      const carrierList = {
        carrierList: carriers, menu: optionMenu
      }
      setOrderItemComponents(orders.map((order) => {
        return(
          <OrderItem order={order} carriers={carrierList} reload={reload} />
        )
      }))
    }
  }, [orders, carriers])

  return (
    orderItemComponents
  )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps)(OrderList)