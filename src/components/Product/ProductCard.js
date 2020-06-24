import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { 
  Box,
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  CardActions,
  CardHeader,
  Button, 
  Typography, 
  Tooltip,
  IconButton,
  withWidth,
  Avatar
} from '@material-ui/core';
import { AddShoppingCart, Palette } from '@material-ui/icons';
import TryButton from '../common/TryButton.js';

const useStyles = makeStyles((theme) => ({
    // card: {
    //     // display: 'flex',
    //     // flexDirection: 'column',
    //     padding: theme.spacing(1),
    // },
    cardMedia: {
      width: '100%',
      height: '100%',
    },
    cardContent: {
        flexGrow: 1,
    },
}));

const ProductCard = ({width, product, preview}) => {
  const classes = useStyles();
  const [cardSize, setCardSize] = useState(1/2)
  const cardSizeLookup = {
    xs: 1/2,
    sm: 1/3,
    md: 1/4,
    lg: 1/4,
    xl: 1/4,
  }

  useEffect(() => {
    setCardSize(cardSizeLookup[width])
  }, [width])

  return (
    <Box component={Card} width={cardSize} p={1} elevation={0}>
      <Link to={`/productDetail/${product.id}`}>
        <CardActionArea>
          <Avatar
            src={product.img} 
            variant="rounded"
            className={classes.cardMedia} />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom color="textPrimary">{product.pname}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography gutterBottom>{product.price}원</Typography>
          <Typography gutterBottom variant="body2">{product.shopname}</Typography>
        </Box>
        <TryButton pid={product.id} previews={preview} />
      </Box>
    </Box>
  );
}

ProductCard.propTypes = {
    product: PropTypes.object,
}
  
export default withWidth()(ProductCard)