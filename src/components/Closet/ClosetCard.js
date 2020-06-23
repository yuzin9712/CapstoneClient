import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx'
import { 
  Box,
  Grid,
  Card, 
  CardHeader, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  CardActions,
  Collapse,
  Chip,
  Button, Typography, Avatar, IconButton, ThemeProvider ,
  Popover, Fade, withWidth,
} from '@material-ui/core';
import {
  Delete,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Create,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons'
import { yujinserver } from '../../restfulapi';
import { useSnackbar } from 'notistack';
import ConfirmPopover from '../common/ConfirmPopover';

const useStyles = makeStyles((theme) => ({
    card: {
        // backgroundColor: theme.palette.
    },
    cardMedia: {
        paddingTop: '100%',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    product: {
      display: "flex",
    },
    productMedia: {
        paddingTop: "100%",
    },
}));

const ClosetCard = ({closet, reload, width}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null)
  const [cardSize, setCardSize] = useState(1)

  useEffect(() => {
    setCardSize(cardSizeLookup[width])
  }, [width])
  const cardSizeLookup = {
    xs: 1/2,
    sm: 1/3,
    md: 1/3,
    lg: 1/3,
    xl: 1/3,
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleRemove = () => {
    fetch(yujinserver+"/closet/"+closet.id,{
      method: 'DELETE',
      credentials: 'include',
    })
    .then(
      (res) => res.text(),
      (error) => console.error(error)
    )
    .then((data) => {
      if(data === 'success'){
        enqueueSnackbar("저장한 작업을 삭제했습니다.",{"variant": "success"});
        reload()
      }
    })
    setPopoverTarget(null)
  }

  return (
    <Box component={Card} width={cardSize} elevation={0} p={1} className={classes.card} >
      <CardActionArea>
        <CardMedia
          className={classes.cardMedia}
          image={closet.img}
        />
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton aria-label="delete" onClick={(event) => setPopoverTarget(event.target)}>
            <Delete />
          </IconButton>
          <ConfirmPopover text="정말 삭제하시겠습니까?" target={popoverTarget} action={() => handleRemove()} cancel={() => setPopoverTarget(null)} />
          <Button
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded? "":"사용한 아이템"}<ExpandMoreIcon />
          </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {closet.products.map((product) => {
            return(
              <Box component={Card} width={1} elevation={0} className={classes.product}>
                <Link component={CardActionArea} to={"/productDetail/"+product.id} style={{width: "25%"}}>
                  <CardMedia
                    className={classes.productMedia}
                    image={product.img}
                  />
                </Link>
                <CardContent style={{flexGrow:1}}>
                  <Typography gutterBottom>{product.pname}</Typography>
                  <Typography gutterBottom variant="body2">{product.price}원</Typography>
                </CardContent>
              </Box>
            )
          })}
        </CardContent>
      </Collapse>
    </Box>
  );
}

ClosetCard.propTypes = {
    product: PropTypes.object,
}
  
export default withWidth()(ClosetCard)