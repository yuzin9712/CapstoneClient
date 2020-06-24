// "/product/:pid"에서 상품 상세정보 확인하는 페이지
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { goBack } from 'connected-react-router'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
  Divider,
  Button,
  Grid,
} from '@material-ui/core'

import ReviewCard from './ReviewCard';
import {sangminserver, yujinserver} from '../../restfulapi';
import ReviewWrite from './ReviewWrite'
import ProductDetail from './ProductDetail'
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  }, 
  deletedProduct: {
    backdropFilter: `grayscale(0.5) blur(8px)`,
    WebkitBackdropFilter: `grayscale(0.5) blur(8px)`,
  },
}));

const ProductDetailPage = ({pathname, goBack, match}) => {
  const classes = useStyles()
  const [pid, setPid] = useState(0);
  const [loading, setLoading] = useState(null)
  const [productDetailComponent, setProductDetailComponent] = useState(null)
  const [reviewWriteComponent, setReviewWriteComponent] = useState(null)
  const [reviewListComponent, setReviewListComponent] = useState(null)

  useEffect(() => {
    setPid(pathname.substring(pathname.lastIndexOf('/') + 1));
  }, [pathname]);

  useEffect(() => {
    setLoading(true)
  }, [pid])
  
  useEffect(() => {
    if(loading){
      const id = match.params.id;
      fetch(sangminserver+"/product/"+id, {
        credentials: 'include',
      })
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then(json => {
        const options = json.detail.filter((option) => option.cnt !== 0)
        const isDeleted = Boolean(json.selected_product[0].deletedAt)
        if(!isDeleted){
          setProductDetailComponent(
            <ProductDetail product={json.selected_product[0]} options={options} previews={json.colors} />
          )
          setReviewWriteComponent(
            <ReviewWrite pid={pid} reload={() => setLoading(true)} />
          )
          if(json.reviews.length){
            setReviewListComponent(json.reviews.map((review) => <ReviewCard key={"review"+review.id} review={review} reload={() => setLoading(true)} />))
          }
          else setReviewListComponent(
            <Box p={7} flexGrow={1} component={Typography} variant="body2" gutterBottom align="center">리뷰가 없어요!</Box>
          )
        }
        else{
          setProductDetailComponent(
            <Box>
              <Typography>판매 중지된 상품입니다.😥</Typography>
            </Box>
          )
        }
        setLoading(false)
      })
    }
  }, [loading])

  return(
    <Box p={1} display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Button onClick={() => goBack()}>돌아가기</Button>
      </Box>
      <Box display="flex" flexDirection="column">
        {productDetailComponent}
        <Box display="flex" p={3} flexDirection="column">
          <Box display="flex" flexDirection="row">
            <Box flexGrow={1} component={Typography} variant="h6" gutterBottom>리뷰</Box>
            {reviewWriteComponent}
          </Box>
          <Divider />
          <Grid container>
            {reviewListComponent}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

ProductDetailPage.propTypes = {
  pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  // pushToOrderList : (order) => dispatch(pushToOrderList(order)),
  // cleanOrderList : () => dispatch(cleanOrderList()),
  // push : (path, state) => dispatch(push(path, state)),
  goBack: () => dispatch(goBack())
})
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailPage)