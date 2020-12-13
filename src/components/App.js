import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route, Element, Redirect } from 'react-router-dom';
import { ThemeProvider, createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import '../css/styles.css';
import Header from './HeaderComponents/Header';
import Home from './HomeComponents/Home';
import LoginLogic from './LoginComponents/LoginLogic'
import { useState } from 'react';
import ProductsPage from './HomeComponents/ProductsPage';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import StoreIcon from '@material-ui/icons/Store';
import ProductPage from './ProductComponents/ProductPage';
import AccountOverview from './AccountComponents/AccountOverview';
import routes from '../utils/routes'

export var cosmoTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#23adae',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f4c132'
    },
    error: {
      main: '#de512b',
      contrastText: '#fff'
    },
    info: {
      main: '#894475',
      contrastText: '#fff'
    },
    succes: {
      main: '#55df99'
    }
  },
})

cosmoTheme = responsiveFontSizes(cosmoTheme)

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    margin: theme.spacing(3)
  },
}))



function App() {

  const classes = useStyles()

  // to add routing
  function CosmoBreadcrumbs() {
    return (
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <Link color="inherit" href="#" >
          <StoreIcon />
        </Link>
        <Typography color="textPrimary">Acasă</Typography>
      </Breadcrumbs>
    );
  }

  return (
    <ThemeProvider theme={cosmoTheme}>
      <AuthProvider>
        <Header />
        <Switch>
          {routes.map(({ path, Component }, key) => (
            <Route exact path={path} key={key} render={(props) => {
              const crumbs = routes
                .filter(({ path }) => props.match.path.includes(path))
                .map(({ path, ...rest }) => ({
                  path: Object.keys(props.match.params).length ? Object.keys(props.match.params).reduce(
                    (path, param) => path.replace(`:${param}`, props.match.params[param]), path) : path, ...rest
                }));
              console.log(`Generated crumbs for ${props.match.path}`)
              crumbs.map(({ name, path }) => console.log({ name, path }))
              return <Component {...props} />
            }} />

          ))}
          <Redirect to='/acasa' />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
