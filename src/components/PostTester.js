// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PostTester() {
  const classes = useStyles();

  const fetchPost = () => {
    // postData('http://172.16.101.113:3000/t/', "imgurl=ㅇㅅㅇ")
    // .then(data => console.log(data)) // JSON-string from `response.json()` call
    // .catch(error => console.error(error));

    // function postData(url = '', data = {}) {
    // // Default options are marked with *
    //   return fetch(url, {
    //       method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //       mode: 'cors', // no-cors, cors, *same-origin
    //       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //       credentials: 'same-origin', // include, *same-origin, omit
    //       headers: {
    //           'Content-Type': 'application/x-www-form-urlencoded',
    //           // 'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       redirect: 'follow', // manual, *follow, error
    //       referrer: 'no-referrer', // no-referrer, *client
    //       body: data, // body data type must match "Content-Type" header
    //   })
    //   .then(response => response.json()); // parses JSON response into native JavaScript objects 
    // }
    fetch('http://172.16.101.113:3000/t/',{
      method: "POST",
      body: "imgurl=1234",
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Post Tester!
        </Typography>
        <form 
          className={classes.form} 
          noValidate
          action="http://172.16.101.113:3000/t/"
          method="POST"
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="imgurl"
            autoComplete="email"
            autoFocus
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            POST!
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
        <Button onClick={fetchPost} fullWidth variant="container" color="primary">fetchPost()</Button>
      </Box>
    </Container>
  );
}