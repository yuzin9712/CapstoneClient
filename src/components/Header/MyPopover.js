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
  Popover, Fade,
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

const useStyles = makeStyles((theme) => ({
}));

const ConfirmPopover = ({text, target, action, cancel}) => {
  const classes = useStyles();
  // const [open, setOpen] = useState(false)
  const open = Boolean(target);
  const id = open ? 'simple-popover' : undefined;
  // useEffect(() => {
  //   setOpen(Boolean(target))
  // }, [target])

  return (
    <Popover
    id={id}
    open={open}
    anchorEl={target}
    onClose={() => cancel()}
    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
    transformOrigin={{vertical: 'top', horizontal: 'left'}}>
      <Typography gutterBottom>{text}</Typography>
      <Button onClick={() => action()}>네</Button>
      <Button onClick={() => cancel()}>아니오</Button>
    </Popover>
  );
}

ConfirmPopover.propTypes = {
}

export default ConfirmPopover 