
// 이름에 따라 Avatar 색깔넣고 1글자이니셜하는거
import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar, Box, makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  avatar: {
    // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
    backgroundColor: props => {
      var hash = 0;
      for (var i = 0; i < props.name.length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    },
    width: props => theme.spacing(props.size),
    height: props => theme.spacing(props.size),
    fontSize: props => theme.spacing(props.size * 0.55),
  }
}));

const RawNameAvatar = ({name, size = 5}) => {
  const classes = useStyles({name, size});
  return(
    <Avatar className={classes.avatar}>
      {name.slice(0,1)}
    </Avatar>
  )
}

RawNameAvatar.propTypes = {
    // pathname: PropTypes.string.isRequired,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}

export default RawNameAvatar