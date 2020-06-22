import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx'
import { useSnackbar } from 'notistack';
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
  Button, Typography, Avatar, IconButton, ThemeProvider, Tooltip ,
  withWidth,
  Popover,
  ButtonBase,
  Paper,
} from '@material-ui/core';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  PersonAdd as FollowIcon,
  PersonAddDisabled as UnfollowIcon,
  Clear,
  Done,
  Favorite,
} from '@material-ui/icons'

import {yujinserver} from '../../restfulapi'
import { connect } from 'react-redux';
import { requestDesignLikes, requestDesignLikesCancel } from '../../actions/design'
import { requestUnfollow, requestFollow } from '../../actions/follow';
import { push } from 'connected-react-router';
import ChipInput from 'material-ui-chip-input';
import FollowButton from '../common/FollowButton';
import RawNameAvatar from '../common/RawNameAvatar';
import ConfirmPopover from '../common/ConfirmPopover';
import NameAvatarButton from '../common/NameAvatarButton';
import moment from 'moment';
import DesignLikeButton from './DesignLikeButton';
import TagInput from '../common/TagInput';


const useStyles = makeStyles((theme) => ({
  cardMedia: {
    width: '100%',
    height: '100%',
  },
  likes: {
    color: 'red',
  },
}));


const DesignSimpleCard = ({width = 1/3, design, push}) => {
  const classes = useStyles();

  return (
      <Box width={width} p={1} component={ButtonBase} onClick={() => push('/design/best')}>
        <Box p={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Box p={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" >
            <Box display="flex" flexDirection="row" alignItems="center">
              <RawNameAvatar name={design.user.name} size={4} />
              <Typography component={Box} pl={1}>{design.user.name}</Typography>
            </Box>
            <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
              <Favorite className={classes.likes}/>
              <Typography component={Box} pl={1}>{design.likecount}</Typography>
            </Box>
          </Box>
          <Avatar
          src={design.img} 
          variant="rounded"
          className={classes.cardMedia} />
        </Box>
      </Box>

    // <Box container={Card} width={width} className={classes.card} variant="outlined">
    //   <Grid container direction="row">
    //     <Grid item container xs={12} md={8} component={Box} alignItems="center">
    //       <Grid item>
    //         <RawNameAvatar name={design.user.name} userId={design.userId} />
    //       </Grid>
    //       <Box>
    //         <Typography>{design.user.name}</Typography>
    //       </Box>
    //     </Grid>
    //     <Grid item container xs={12} md={4} direction="row" justify="flex-end" alignItems="center">
    //       <DesignLikeButton disabled target={design.id} count={design.likecount} />
    //     </Grid>
    //   </Grid>
    //   <CardActionArea disabled>
    //     <Avatar
    //       src={design.img} 
    //       variant="rounded"
    //       className={classes.cardMedia} />
    //   </CardActionArea>
    // </Box>
  );
}

DesignSimpleCard.propTypes = {
  width: PropTypes.number,
  design: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
  // sessionId: state.auth.currentId,
})
const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignSimpleCard)
