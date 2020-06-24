import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, 
  Typography, 
  Grid, 
  ButtonBase, 
  Divider,
  Paper,
  withWidth,
  Avatar,
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
import { Palette, AccountBoxOutlined } from '@material-ui/icons';
import main1 from '../../public/main1.png'
import main2 from '../../public/main2.png'
import main3 from '../../public/main3.png'
import main4 from '../../public/main4.png'

const useStyles = makeStyles((theme) => ({
  sliderBox: {
    paddingTop: '0',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
}));

const MainPage = ({width}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  const [bestDesign, setBestDesign] = useState([])
  const [shopRanking, setShopRanking] = useState([])
  const [bestItem, setBestItem] = useState([])

  const cardSizeLookup = {
    xs: 1/2,
    sm: 1/3,
    md: 1/4,
    lg: 1/4,
    xl: 1/4,
  }
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
            <Box key={"shop-"+index} width={cardSizeLookup[width]} p={1}>
              <Box p={1} py={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" component={Paper} variant="outlined">
                <RawNameAvatar name={shop.shopname} size={10} />
                <Typography variant="h6">{shop.shopname}</Typography>
              </Box>
            </Box>
          )
        }))
      })
      fetch(yujinserver+"/product/main", {credentials: 'include',})
      .then(
        response => response.json(),
        error => console.error(error)
      )
      .then(json => {
        setBestItem(
          <ProductList products={json.products.slice(0,15)} previews={json.imgs} />
        )
      })
      setLoading(false)
    }
  }, [loading])

  return(
    <Box display="flex" flexDirection="column" >
      <SketchGuide>
        <Box height={1} width={1} display="flex" justifyContent="center" alignItems="center">
          <Box>
            <Avatar src={main1} className={classes.sliderImage} variant="square" />
          </Box>
        </Box>
        <Box height={1} width={1} display="flex" justifyContent="center" alignItems="center">
          <Box>
            <Avatar src={main2} className={classes.sliderImage} variant="square" />
          </Box>
        </Box>
        <Box height={1} width={1} display="flex" justifyContent="center" alignItems="center">
          <Box>
            <Avatar src={main3} className={classes.sliderImage} variant="square" />
          </Box>
        </Box>
        <Box height={1} width={1} display="flex" justifyContent="center" alignItems="center">
          <Box>
            <Avatar src={main4} className={classes.sliderImage} variant="square" />
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
          <Typography gutterBottom variant="h6">TRENDING ITEMS</Typography>
        </Box>
        <Divider />
        <Box pt={1} />
        <Grid container>
          {bestItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(MainPage))
