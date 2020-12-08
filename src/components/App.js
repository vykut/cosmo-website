import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import '../css/styles.css';
// import { cosmoTheme } from '../utils/styles';
import Header from './HeaderComponents/Header';
import Home from './HomeComponents/Home';
import LoginLogic from './LoginComponents/LoginLogic'

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
  }
})

cosmoTheme = responsiveFontSizes(cosmoTheme)

function App() {
  return (
    <Router>
      <ThemeProvider theme={cosmoTheme}>
        <AuthProvider>
          {/* <LoginLogic></LoginLogic> */}
          <Header />
          <Switch>
            <Route path='/' exact>
              <Home />
              {/* home */}
            </Route>
          </Switch>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App;
