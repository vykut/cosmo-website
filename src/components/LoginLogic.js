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
import { useState, useEffect } from 'react';
import { useStyles } from '../utils/styles';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import { Alert } from '@material-ui/lab';

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

  const [alert, setAlert] = useState({
    message: '',
    severity: 'error'
  })
  const [loginLogic, setLoginLogic] = useState('sign-in')

  return (

    <div className={classes.paper}>
      <Container maxWidth="xs">
        <img src={logo} alt='logo' className={classes.logo} />
        {
          alert.message && <Alert variant="filled" severity={alert.severity} className={classes.alert}>
            {alert.message}
          </Alert>
        }
      </Container>
      {loginLogic === 'sign-in' && <SignIn setAlert={setAlert}  setLoginLogic={setLoginLogic} />}
      {loginLogic === 'sign-up' && <SignUp setAlert={setAlert}  setLoginLogic={setLoginLogic} />}
      {loginLogic === 'reset-password' && <ResetPassword setAlert={setAlert}  setLoginLogic={setLoginLogic} />}

      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}