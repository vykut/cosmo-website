import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import websiteAddress from '../utils/constants';
import logo from '../assets/logo-cosmo-market.svg';
import {useState} from 'react';
import {useStyles} from '../utils/styles';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={websiteAddress}>
        {websiteAddress}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



export default function LoginLogic() {
  const classes = useStyles();


  return (
    
      <div className={classes.paper}>
        <Container  maxWidth="xs">
          <img src={logo} alt='logo' className={classes.logo} />
        </Container>
        {/* <form className={classes.form} noValidate> */}
        <ResetPassword></ResetPassword>
          <SignIn></SignIn>
          <SignUp></SignUp>
        {/* </form> */}
      
      <Box mt={8}>
        <Copyright />
      </Box>
      </div>
  );
}