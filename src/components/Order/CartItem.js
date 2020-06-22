import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Box, ButtonBase, Select, MenuItem, Avatar, Typography, TextField, Tooltip, makeStyles, IconButton, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Delete, Undo, Edit, Clear, Done } from '@material-ui/icons'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import ConfirmPopover from '../common/ConfirmPopover'
import { sangminserver } from '../../restfulapi'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  avatarImage: {
    width: '3em',
    height: '3em',
  },
  textFieldQuantity: {
    width: '3em',
  },
  typoTotal: {
    width: '6em',
  },
}));

const CartItem = ({order, product, options, reload}) => {
  const initialOption = (options.find((option) => (option.color === order.color) && (option.size === order.size))).optionId
  
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [edit, setEdit] = useState(false)
  const [deletePopover, setDeletePopover] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [optionId, setOptionId] = useState(initialOption)
  const [quantity, setQuantity] = useState(order.cnt)

  useEffect(() => {
    if(!edit){
      setOptionId(initialOption)
      setQuantity(order.cnt)
    }
  }, [edit])

  const handleOptionChange = (event) => {
    setOptionId(event.target.value)
  }

  const handleQuantityChange = (event) => {
    const value = event.target.value<1? 1 : event.target.value>100? 100: event.target.value
    setQuantity(value)
  }

  const submitEdit = () => {
    if(!fetching){
      if(optionId !== initialOption || quantity !== order.cnt){
        const option = options.find(option => option.optionId === optionId)
        fetch(sangminserver+'/cart/'+order.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
            color: option.color,
            cnt: quantity,
            size: option.size,
          }),
          credentials: 'include',
        })
        .then(
          (res) => res.text(),
          (error) => console.error(error)
        )
        .then((text) => {
          if(text === "success"){
            enqueueSnackbar("옵션을 변경했습니다.",{"variant": "success"});
            reload()
          }
          else{
            enqueueSnackbar("옵션 수정에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
          }
        })
      }
      setEdit(false)
    }
  }
  const handleDelete = () => {
    if(!fetching){
      setFetching(true)
      fetch(sangminserver+'/cart/'+order.id, {
        method: 'DELETE',
        credentials: 'include',
      })
      .then(
        (res) => res.text(),
        (error) => console.error(error)
      )
      .then((text) => {
        if(text === "delete cart success!"){
          enqueueSnackbar(order.pname+": 장바구니에서 제외했습니다.",{"variant": "success"});
          reload()
        }
        else{
          enqueueSnackbar("장바구니 삭제에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
      })
      setFetching(false)
    }
  }
        

  return(
    <Box p={1} display="flex" flexDirection="row" alignItems="center" >
      <ButtonBase component={Link} to={"/productDetail/"+product.id}>
        <Avatar
          variant="rounded"
          src={order.img}
          className={classes.avatarImage}
        />
      </ButtonBase>
      <Box flexGrow={1} component={Typography} variant="body1">{order.pname}</Box>
      <Box display="flex" flexDirection="row" alignItems="center" className={clsx({[classes.hide]: edit})}>
        <Typography variant="body2">{order.color+" / "+order.size}</Typography>
        <Typography variant="body2" align="right" className={classes.textFieldQuantity}>✕{order.cnt}</Typography>
        <Typography variant="body2" align="right" className={classes.typoTotal}><strong>{product.price * order.cnt}</strong>원</Typography>
        <Tooltip title="수정">
          <IconButton onClick={() => setEdit(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="삭제">
          <IconButton disable={fetching} onClick={(event) => setDeletePopover(event.target)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" className={clsx({[classes.hide]: !edit})}>
        <Select
        value={optionId}
        onChange={(event) => handleOptionChange(event)}
        // displayEmpty
        >
          {options.map((option) => (
            <MenuItem value={option.optionId}>{option.color} / {option.size}</MenuItem>
          ))}
        </Select>
        <TextField 
        size="small" 
                size="small" 
        size="small" 
        className={classes.textFieldQuantity}
        type="number"
        value={quantity}
        onChange={(event) => handleQuantityChange(event)}
        inputProps={{
          style: { textAlign: "right" },
          min: "1", max: "100", step: "1",
        }}/>
        <Typography variant="body2" gutterBottom align="right" className={classes.typoTotal}>{product.price * quantity}원</Typography>
        <Tooltip title="수정 취소">
          <IconButton onClick={() => setEdit(false)}>
            <Clear />
          </IconButton>
        </Tooltip>
        <Tooltip title="적용">
          <IconButton onClick={() => submitEdit()}>
            <Done />
          </IconButton>
        </Tooltip>
      </Box>
      <ConfirmPopover text="장바구니에서 제외합니다." target={deletePopover} action={() => {if(!fetching) handleDelete()}} cancel={() => setDeletePopover(null)} />
    </Box>
  )
}

const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    pushToOrderList : (order) => dispatch(pushToOrderList(order)),
    cleanOrderList : () => dispatch(cleanOrderList()),
    push : (url) => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CartItem)