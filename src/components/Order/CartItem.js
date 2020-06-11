import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Box, ButtonBase, Select, MenuItem, Avatar, Typography, TextField, Tooltip, makeStyles, IconButton, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Delete, Undo } from '@material-ui/icons'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
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

const CartItem = ({order, product, options, edit, updatePage}) => {
    const classes = useStyles();

    const initialOption = (options.find((option) => (option.color === order.color) && (option.size === order.size))).optionId
  const initialEditInfo = {
    cartId: order.id,
    quantity: order.cnt,
    optionId: initialOption,
    color: order.color,
    size: order.size,
    deleted: false,
  }
  const [editInfo, setEditInfo] = useState(initialEditInfo)
    // const [quantity, setQuantity] = useState(order.cnt)
    // const [optionValue, setOptionValue] = useState(initialOption)

    const optionMenu = options.map((option) => (
        <MenuItem value={option.optionId}>{option.color} / {option.size}</MenuItem>
    ))

    useEffect(() => {
      if(!edit){
        setEditInfo(initialEditInfo)
      }
    }, [edit])
    

    const optionSelector = () => {
        return(
            <Select
                value={editInfo.optionId}
                onChange={(event) => handleOptionChange(event)}
                displayEmpty
            >
                {optionMenu}
            </Select>
        )
    }

    const handleOptionChange = (event) => {
        // setOptionValue(event.target.value)
        setEditInfo({
            ...editInfo,
            optionId: event.target.value,
            color: (options.find((option) => (option.optionId === event.target.value))).color,
            size: (options.find((option) => (option.optionId === event.target.value))).size
        })
    }

    const handleQuantityChange = (event) => {
        const value = event.target.value<1? 1 : event.target.value>100? 100: event.target.value
        // setQuantity(value)
        setEditInfo({
            ...editInfo,
            quantity: value
        })
    }

    const handleDeleteChange = () => {
      setEditInfo({
        ...editInfo,
        deleted: !editInfo.deleted,
      })
    }

    useEffect(() => {
        const edited = (editInfo.optionId !== initialOption) || (editInfo.quantity !== order.cnt)
        updatePage({
            edited: edited,
            ...editInfo
        })
    }, [editInfo])

        

    return(
      <React.Fragment>
        {editInfo.deleted?
        <Box p={1} display="flex" flexDirection="row" alignItems="center" bgcolor={red[200]}>
            <Box flexGrow={1} component={Typography} align="center" variant="body2" gutterBottom>{order.pname}: {order.color} / {order.size}를 삭제할거에요.</Box>
            <Tooltip title="되돌리기">
              <IconButton onClick={handleDeleteChange}>
                <Undo />
              </IconButton>
            </Tooltip>
        </Box>
        : <Box p={1} display="flex" flexDirection="row" alignItems="center">
            <ButtonBase component={Link} to={"/productDetail/"+product.id}>
                <Avatar
                    variant="rounded"
                    src={order.img}
                    className={classes.avatarImage}
                />
            </ButtonBase>
            <Box flexGrow={1} component={Typography} variant="body1" gutterBottom>{order.pname}</Box>
            {edit?optionSelector(order.color, order.size)
            : <Typography variant="body2" gutterBottom>{order.color+" / "+order.size}</Typography>}
            {edit?<TextField 
                size="small" 
                className={classes.textFieldQuantity}
                type="number"
                value={editInfo.quantity}
                onChange={(event) => handleQuantityChange(event)}
                inputProps={{
                    style: { textAlign: "right" },
                    min: "1", max: "100", step: "1",
                }}
            /> : <Typography variant="body2" align="right" gutterBottom className={classes.textFieldQuantity}>{order.cnt}</Typography>}
            <Typography variant="body2" gutterBottom align="right" className={classes.typoTotal}>{product.price * editInfo.quantity}원</Typography>
            {edit? <Tooltip title="삭제">
                <IconButton onClick={handleDeleteChange} color="secondary">
                <Delete />
                </IconButton>
            </Tooltip>
            :null}
        </Box>}
      </React.Fragment>
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