// 디자인 만들기 컴포넌트
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  GridList,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  GridListTile,
  ButtonBase,
  Typography,
  DialogActions,
  TextField,
  Box,
  CardMedia,
  Card,
  CardContent,
  CardActionArea,
} from '@material-ui/core'
import { Check } from '@material-ui/icons';


import {yujinserver} from '../../restfulapi'
import clsx from 'clsx';
import ChipInput from 'material-ui-chip-input'
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import TryButton from '../common/TryButton.js';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: '100%'
  },
  product: {
    display: "flex",
  },
  productMedia: {
      paddingTop: "100%",
  },
}));

const ClosetDetail = ({ closet, imagestyle }) => {
  const classes = useStyles();
  const [ open, setOpen ] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return(
    <React.Fragment>
      <ButtonBase onClick={handleClickOpen}>
        <Avatar variant="rounded" src={closet.img} className={imagestyle} />
      </ButtonBase>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="closet-detail-dialog"
      >
        {/* <DialogTitle></DialogTitle> */}
        <DialogContent>
          <ButtonBase>
            <Avatar variant="rounded" src={closet.img} className={classes.image} />
          </ButtonBase>
          {closet.closet.products.map((product) => {
            const previews = product.imgByColors
            return(
              <Box component={Card} width={1} elevation={0} className={classes.product}>
                <Link component={CardActionArea} to={"/productDetail/"+product.id} style={{width: "25%"}}>
                  <CardMedia
                    className={classes.productMedia}
                    image={product.img}
                  />
                </Link>
                <Box flexGrow={1}>
                  <Typography gutterBottom>{product.pname}</Typography>
                  <Typography gutterBottom variant="body2">{product.price}원</Typography>
                </Box>
                <Box justifyContent="center">
                  <TryButton pid={product.id} previews={previews} />
                </Box>
              </Box>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

ClosetDetail.propTypes = {
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
  dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosetDetail)
