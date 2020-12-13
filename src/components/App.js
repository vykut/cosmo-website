import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route, Element, Redirect, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createMuiTheme, responsiveFontSizes, makeStyles } from '@material-ui/core/styles';
import '../css/styles.css';
import Header from './HeaderComponents/Header';
import Home from './HomeComponents/Home';
import LoginLogic from './LoginComponents/LoginLogic'
import { useState } from 'react';
import ProductsPage from './HomeComponents/ProductsPage';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import StoreIcon from '@material-ui/icons/Store';
import ProductPage from './ProductComponents/ProductPage';
import AccountOverview from './AccountComponents/AccountOverview';
import routes from '../utils/routes'
import { capitalize } from '../utils/utils';
import { Store } from '@material-ui/icons';

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
  infoTextColor: {
    // color: '#894475',
    color: '#23adae',
  },
}))

function App() {

  const classes = useStyles()

  function CosmoBreadcrumbs() {

    return <Route >
      {({ location }) => {
        const pathnames = location.pathname.split('/').filter(x => x);
        return (
          <Breadcrumbs aria-label="Breadcrumb" className={classes.breadcrumbs}>
            <Link component={RouterLink} to='/acasa'>
              <StoreIcon />
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              if (value === 'p') {
                return null
              }

              return last || value === 'categorii' ? (
                <Typography className={classes.infoTextColor} key={to}>
                  {capitalize(value)}
                </Typography>
              ) : (
                  <Link component={RouterLink} to={to} key={to} underline='always'>
                    <Typography className={classes.infoTextColor} key={to}>
                      {capitalize(value)}
                    </Typography>
                  </Link>
                );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  }
  return (
    <ThemeProvider theme={cosmoTheme}>
      <AuthProvider>
        <Header />
        <Switch>
          {/* {routes.map(({ path, Component }, key) => (
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
          ))} */}
          <Route path='/acasa' >
            <CosmoBreadcrumbs />
            <Home />
          </Route>
          <Route exact path='/contul-meu'>
            <AccountOverview />
          </Route>
          <Route exact path='/categorii/:category/:subcategory1?/:subcategory2?/p/:product'>
            <CosmoBreadcrumbs />
            <ProductPage />
          </Route>
          <Route exact path='/categorii/:category/:subcategory1?/:subcategory2?'>
            <CosmoBreadcrumbs />
            <ProductsPage />
          </Route>
          <Redirect to='/acasa' />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
