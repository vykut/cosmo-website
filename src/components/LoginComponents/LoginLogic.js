import React from 'react';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import websiteAddress from '../../utils/constants';
import logo from '../../assets/logo-cosmo-market.svg';
import { useState } from 'react';
import { useStyles } from '../../utils/styles';
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
  const [loginComponent, setLoginComponent] = useState('sign-in')

  return (

    <div className={classes.paper} >
      <Container maxWidth="xs">
        <img src={logo} alt='logo' className={classes.loginLogo} />
        {
          alert.message && <Alert variant="filled" severity={alert.severity} className={classes.alert}>
            {alert.message}
          </Alert>
        }
      </Container>
      {loginComponent === 'sign-in' && <SignIn setAlert={setAlert} setLoginComponent={setLoginComponent} />}
      {loginComponent === 'sign-up' && <SignUp setAlert={setAlert} setLoginComponent={setLoginComponent} />}
      {loginComponent === 'reset-password' && <ResetPassword setAlert={setAlert} setLoginComponent={setLoginComponent} />}

      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}