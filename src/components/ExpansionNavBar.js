// 확장형 navbar
// 어차피 메뉴가 몇개없어서 이거말고 그냥 NavBar를 사용할것임.
import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Link, Typography,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
} from '@material-ui/core'
import { Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: '100%',
    justifyContent: 'flex-end',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  menuButton: {
    margin: theme.spacing(1),
  },
}));

const ExpansionNavBar = ({menus}) => {
  const classes = useStyles();
/*<AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon /><Typography>전체메뉴</Typography>
        </IconButton>
        
      </Toolbar>
    </AppBar>*/
  return(
    <ExpansionPanel>
      <ExpansionPanelSummary
        aria-label="Expand"
        aria-controls="additional-actions1-content"
        id="additional-actions1-header"
      >
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon /><Typography>전체메뉴</Typography>
        </IconButton>
        <Toolbar 
          component="nav" 
          variant="dense"
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          className={classes.toolbar}>
          <Link component={RouterLink} to="/"
            color="inherit"
            noWrap
            variant="body2"
            className={classes.toolbarLink}>Home</Link>
          {menus.map(({component, path}) => (
            <Link component={RouterLink} to={path}
            color="inherit"
            noWrap
            variant="body2"
            className={classes.toolbarLink}>{component}</Link>
          ))}
        </Toolbar>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography color="textSecondary">
          The click event of the nested action will propagate up and expand the panel unless you
          explicitly stop it.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

ExpansionNavBar.propTypes = {
  menus: PropTypes.object,
}

export default ExpansionNavBar