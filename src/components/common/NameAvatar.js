
// 이름에 따라 Avatar 색깔넣고 1글자이니셜하는거
import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar, Box,
} from '@material-ui/core'

const NameAvatar = ({name}) => {
  // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  const color = (name) => {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
  return(
    <Box p={1} component={Avatar} style={{backgroundColor: color(name)}}>
      {name.slice(0,1)}
    </Box>
  )
}

NameAvatar.propTypes = {
    pathname: PropTypes.string.isRequired,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}

export default NameAvatar