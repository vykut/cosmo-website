import { Switch, Route, Redirect, Link as RouterLink, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import '../css/styles.css';
import Header from './HeaderComponents/Header';
import Home from './HomeComponents/Home';
import ProductsPage from './HomeComponents/ProductsPage';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import StoreIcon from '@material-ui/icons/Store';
import ProductPage from './ProductComponents/ProductPage';
import AccountOverview from './AccountComponents/AccountOverview';
import { capitalize } from '../utils/utils';
import { DialogProvider } from '../contexts/DialogContext';
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty, useFirestoreConnect } from 'react-redux-firebase'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated or if auth is not
// yet loaded
function PrivateRoute({ children, ...rest }) {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}


const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    margin: theme.spacing(3)
  },
  infoTextColor: {
    color: '#23adae',
  },
  closeButton: {
    color: theme.palette.error.main
  }
}))

function App() {


  function CosmoBreadcrumbs() {
    const classes = useStyles()
    const { category, subcategory1, subcategory2, productID } = useParams()

    useFirestoreConnect([{
      collectionGroup: 'categories'
    }, {
      collectionGroup: 'products'
    }])

    const categories = useSelector((state) => state.firestore.data.categories)
    const products = useSelector((state) => state.firestore.data.products)

    const homeCrumb = !category && <Typography className={classes.infoTextColor}>
      Acasă
        </Typography>
    const categoryTitleCrumb = category && <Typography className={classes.infoTextColor}>
      Categorii
        </Typography>
    const categoryCrumb = category && categories && categories[category] && <Link component={RouterLink} to={`/categorii/${category}`} underline='always'>
      <Typography className={classes.infoTextColor}>
        {categories[category].name}
      </Typography>
    </Link>
    const subcategory1Crumb = subcategory1 && categories && categories[subcategory1] && <Link component={RouterLink} to={`/categorii/${category}/${subcategory1}`} underline='always'>
      <Typography className={classes.infoTextColor}>
        {categories[subcategory1].name}
      </Typography>
    </Link>
    const subcategory2Crumb = subcategory2 && categories && categories[subcategory2] && <Link component={RouterLink} to={`/categorii/${category}/${subcategory1}/${subcategory2}`} underline='always'>
      <Typography className={classes.infoTextColor}>
        {categories[subcategory2].name}
      </Typography>
    </Link>
    const productCrumb = productID && products && products[productID] && <Typography className={classes.infoTextColor}>
      {products[productID].name}
    </Typography>

    return (
      <Route>
        <Breadcrumbs aria-label="Breadcrumb" className={classes.breadcrumbs}>
          <Link component={RouterLink} to='/acasa'>
            <StoreIcon />
          </Link>
          {homeCrumb}
          {categoryTitleCrumb}
          {categoryCrumb}
          {subcategory1Crumb}
          {subcategory2Crumb}
          {productCrumb}
        </Breadcrumbs>
      </Route>
    )

    // return <Route>
    //   {({ location }) => {
    //     const pathnames = location.pathname.split('/').filter(x => x);
    //     return (
    //       <Breadcrumbs aria-label="Breadcrumb" className={classes.breadcrumbs}>
    //         <Link component={RouterLink} to='/acasa'>
    //           <StoreIcon />
    //         </Link>
    //         {pathnames.map((value, index) => {
    //           const last = index === pathnames.length - 1;
    //           const to = `/${pathnames.slice(0, index + 1).join('/')}`;

    //           if (value === 'p') {
    //             return null
    //           }

    //           if (value === 'categorii' || value === 'acasa') {
    //             return <Typography className={classes.infoTextColor} key={to}>
    //               {capitalize(value)}
    //             </Typography>
    //           }

    //           // if(pathnames.length === )

    //           return last ? (
    //             <Typography className={classes.infoTextColor} key={to}>
    //               {capitalize(value)}
    //             </Typography>
    //           ) : (
    //               <Link component={RouterLink} to={to} key={to} underline='always'>
    //                 <Typography className={classes.infoTextColor} key={to}>
    //                   {capitalize(value)}
    //                 </Typography>
    //               </Link>
    //             );
    //         })}
    //       </Breadcrumbs>
    //     );
    //   }}
    // </Route>
  }

  return (
    <DialogProvider>
      <Header />
      <Switch>
        <Route path='/acasa' >
          <CosmoBreadcrumbs />
          <Home />
        </Route>
        <PrivateRoute exact path='/contul-meu'>
          <AccountOverview />
        </PrivateRoute>
        <Route exact path='/categorii/:category/:subcategory1?/:subcategory2?/p/:productID'>
          <CosmoBreadcrumbs />
          <ProductPage />
        </Route>
        <Route exact path='/categorii/:category/:subcategory1?/:subcategory2?'>
          <CosmoBreadcrumbs />
          <ProductsPage />
        </Route>
        <Redirect to='/acasa' />
      </Switch>
    </DialogProvider>
  )
}

export default App;
