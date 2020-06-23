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
import TryButton from '../common/TryButton';


const useStyles = makeStyles((theme) => ({
  card: {
      padding: theme.spacing(1),
  },
  chips: {
    margin: "1px",
  },
  headerAction: {
    
  },
  popover: {
    pointerEvents: 'none',
  },
  cardMedia: {
    width: '100%',
    height: '100%',
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
}));


const DesignCard = ({authStore, width, design, dispatchPush, reload}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [hashtags, setHashtags] = useState(design.hashtags.map((tag) => tag.title))
  const [edit, setEdit] = useState(false)
  const [editTags, setEditTags] = useState([])
  const [popoverTarget, setPopoverTarget] = useState(null)
  // const [ userPopoverAnchor, setUserPopoverAnchor ] = useState(null)

  const cardSizeLookup = {
    xs: 1,
    sm: 1/2,
    md: 1/3,
    lg: 1/3,
    xl: 1/3,
  }
  useEffect(() => {
    setEditTags(hashtags)
  }, [edit])
  
  const hashtagEditForm = (
    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
      <TagInput tags={editTags} setTags={(tags) => setEditTags(tags)} />
      <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <Tooltip title="수정 취소">
          <IconButton onClick={() => setEdit(false)}>
            <Clear />
          </IconButton>
        </Tooltip>
        <Tooltip title="적용">
          <IconButton onClick={() => submitHashtagEdit()} >
            <Done />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
  const hashtagView = (
    <Box display="flex" flexGrow={1} alignItems="center">
      <Box flexGrow={1} alignItems="center">
        {hashtags.map((tag) => {
          return <Chip
          key={design.id+"-tag-"+tag}
          className={classes.chips}
          avatar={<Avatar>#</Avatar>}
          label={tag}
          clickable
          onClick={() => dispatchPush("/design/hashtag/"+tag)}
          />
        })}
      </Box>
    </Box>
  )

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const submitHashtagEdit = () => {
    if(editTags !== hashtags){
      if(authStore.currentId !== design.user.id){
        enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
        reload()
      }
      else{
        fetch(yujinserver+"/design/"+design.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
              content: editTags,
          }),
          credentials: 'include',
        })
        .then(response => response.text(),
            error => console.error(error))
        .then(text => {
            if(text === 'success'){
              enqueueSnackbar("태그를 수정했습니다.",{"variant": "success"});
              setHashtags(editTags)
            }
            else enqueueSnackbar("수정에 실패했습니다. 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        })
      }
    }
    setEdit(false)
  }
  const deleteDesign = () => {
    setEdit(false)
    if(authStore.currentId !== design.userId && authStore.session !== 'admin'){
      enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
      reload()
    }
    else{
      fetch(yujinserver+"/design/"+design.id, {
        method: 'DELETE',
        credentials: 'include',
      })
      .then(response => response.text(),
          error => console.error(error))
      .then(text => {
          if(text === 'success'){
            enqueueSnackbar("공유한 코디를 삭제했습니다.",{"variant": "success"});
            reload()
          }
          else enqueueSnackbar("삭제에 실패했습니다. 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
      })
    }
  }
  // const owner = design.user !== null?design.user:{id: design.userId, name: "탈퇴된 유저"}

  return (
    <Box width={cardSizeLookup[width]} p={1}>
      <Box p={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
        <Box p={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" >
          <Box display="flex" flexDirection="row" alignItems="center">
            <NameAvatarButton name={design.user.name} userId={design.userId} />
            <Typography component={Box}>{design.user.name}</Typography>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
            <DesignLikeButton target={design.id} count={design.likecount} />
          </Box>
        </Box>
        <Avatar
        src={design.img} 
        variant="rounded"
        className={classes.cardMedia} />
        <Box p={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" >
          <Box display="flex" flexDirection="row" alignItems="center">
            {edit? hashtagEditForm : hashtagView}
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
            {!edit?(
              <>
                {authStore.currentId === design.userId?(
                  <Tooltip title="수정">
                    <IconButton onClick={() => setEdit(true)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                ):null}
                {(authStore.currentId === design.userId) || (authStore.session === 'admin')?(
                  <>
                    <Tooltip title="삭제">
                      <IconButton onClick={(event) => setPopoverTarget(event.target)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <ConfirmPopover text="정말 삭제하시겠습니까?" target={popoverTarget} action={() => deleteDesign()} cancel={() => setPopoverTarget(null)} />
                  </>
                ):null}
              </>
            ):null}
            <Tooltip title="사용된 상품">
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Grid container direction="column">
            {design.closet !== null?design.closet.products.map((product, index) => {
              return(
                <Box key={design.id+"-product-"+index} p={1} display="flex" flexDirection="row" alignItems="center">
                  <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" >
                    <Button component={Link} to={"/productDetail/"+product.id} style={{width: "25%"}}>
                      <Avatar
                      src={product.img}
                      variant="rounded"
                      />
                    </Button>
                    <Box flexGrow={1} display="flex" flexDirection="column">
                      <Typography>{product.pname}</Typography>
                      <Typography variant="body2">{product.price}원</Typography>
                    </Box>
                  </Box>
                  <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" >
                    <TryButton pid={product.id} previews={product.imgByColors} />
                  </Box>
                </Box>
              )
            }) : null}
          </Grid>
        </Collapse>
      </Box>
    </Box>
  );
}

DesignCard.propTypes = {
    design: PropTypes.object,
}
  
const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(DesignCard))
