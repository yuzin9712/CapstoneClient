import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, 
  Typography, 
  Grid, 
  ButtonBase, 
  Divider,
  Paper,
} from '@material-ui/core'
import ProductList from './Product/ProductList';
import {sangminserver, yujinserver} from '../restfulapi';
import ProductRecentPage from './Product/ProductRecentPage';
import DesignCard from './Design/DesignCard';
import DesignSimpleCard from './Design/DesignSimpleCard';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RawNameAvatar from './common/RawNameAvatar';
import SketchGuide from './Sketch/SketchGuide';
import { Palette } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  mainSlide: {
    height: theme.spacing(30),
  }
}));

const MainPage = ({push,}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  const [bestDesign, setBestDesign] = useState([])
  const [shopRanking, setShopRanking] = useState([])

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/design/best", {credentials: 'include',})
      .then(
        response => response.json(),
        error => console.error(error)
      )
      .then(designs => {
        setBestDesign([...designs].slice(0,3).map((design) => {
          return <DesignSimpleCard key={"design-"+design.id} design={design} />
        }))
      })
      fetch(yujinserver+"/product/rank", {credentials: 'include',})
      .then(
        response => response.json(),
        error => console.error(error)
      )
      .then(json => {
        setShopRanking(json.shoprank.slice(0,4).map((shop, index) => {
          return(
            <Box key={"shop-"+index} width={1/4} p={1}>
              <Box p={1} py={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" component={Paper} variant="outlined">
                <RawNameAvatar name={shop.shopname} size={10} />
                <Typography variant="h6">{shop.shopname}</Typography>
              </Box>
            </Box>
          )
        }))
      })
      setLoading(false)
    }
  }, [loading])

  return(
    <Box display="flex" flexDirection="column" >
      <SketchGuide>
        <Box className={classes.mainSlide} display="flex" flexDirection="row">
          <Box width={1/3} pb={5} display="flex" flexDirection="column" justifyContent="flex-end">
            <Typography variant="h5">당신의 코디를</Typography>
            <Typography variant="h5" gutterBottom >만들어보세요.</Typography>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box flexGrow={1}>
              //대충 이미지 들어가는 자리//
            </Box>
            <Typography align="right" variant="body1">어디서나 <Palette /> 아이콘을 눌러 코디를 시작하세요.</Typography>
          </Box>
        </Box>
        <Box className={classes.mainSlide} display="flex" flexDirection="row">
          <Box width={1/3} pb={5} display="flex" flexDirection="column" justifyContent="flex-end">
            <Typography variant="h5">다른 사용자들의</Typography>
            <Typography variant="h5" gutterBottom >코디를 확인하세요.</Typography>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box flexGrow={1}>
              //대충 이미지 들어가는 자리//
            </Box>
              <Typography align="right" variant="body1">가장 많은 좋아요를 받은 코디를 확인하세요.</Typography>
              <Typography align="right" variant="body1">마음에 드는 사람을 팔로우하세요.</Typography>
          </Box>
        </Box>
        <Box className={classes.mainSlide} display="flex" flexDirection="row">
          <Box width={1/3} pb={5} display="flex" flexDirection="column" justifyContent="flex-end">
            <Typography variant="h5">코디를 게시글, </Typography>
            <Typography variant="h5">댓글에 첨부해</Typography>
            <Typography variant="h5" gutterBottom >소통하세요.</Typography>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box flexGrow={1}>
              //대충 이미지 들어가는 자리//
            </Box>
              <Typography align="right" variant="body1">패션에 대한 고민을 해결하세요.</Typography>
              <Typography align="right" variant="body1">어렵게 글로 설명하지 말고 코디로 설명하세요.</Typography>
          </Box>
        </Box>
      </SketchGuide>
      <Box display="flex" flexDirection="column">
        <Box flexGrow={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6">BEST DESIGNS</Typography>
          <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Link color="inherit" to='/design/best'>더보기</Link>
          </Box>
        </Box>
        <Divider />
        <Grid container>
          {bestDesign}
        </Grid>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box flexGrow={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6">BEST SHOPPINGMALLS</Typography>
        </Box>
        <Divider />
        <Grid container>
          {shopRanking}
        </Grid>
      </Box>
    </Box>
  )
}
const mapStateToProps = state => ({
  sessionId: state.auth.currentId,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
