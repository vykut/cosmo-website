import { Box, Container, Link, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import ResetPassword from './ResetPassword';
import SignIn from './SignIn';
import SignUp from './SignUp';
import logo from '../../assets/logo-cosmo-market.svg'
import websiteAddress from '../../utils/constants'
import { ComponentTypes } from '../../utils/utils'


export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  loginLogo: {
    margin: theme.spacing(3, 0),
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  alert: {
    margin: theme.spacing(0, 1, 2),
  },
}));


export default function LoginLogic() {
  const classes = useStyles();

  const [loginComponent, setLoginComponent] = useState(ComponentTypes.sign_in)
  const [alert, setAlert] = useState({
    message: '',
    severity: 'error'
  })

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

  return (
    <div className={classes.paper} >
      <Container maxWidth="sm">
        <img src={logo} alt='logo' className={classes.loginLogo} />
        {
          alert.message && <Alert variant="filled" severity={alert.severity} className={classes.alert}>
            {alert.message}
          </Alert>
        }
      </Container>
      {loginComponent === ComponentTypes.sign_in && <SignIn setAlert={setAlert} setLoginComponent={setLoginComponent} />}
      {loginComponent === ComponentTypes.sign_up && <SignUp setAlert={setAlert} setLoginComponent={setLoginComponent} />}
      {loginComponent === ComponentTypes.reset_password && <ResetPassword setAlert={setAlert} setLoginComponent={setLoginComponent} />}
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}