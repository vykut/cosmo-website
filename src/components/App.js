import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import '../css/styles.css';
import LoginLogic from './LoginComponents/LoginLogic';
import { cosmoTheme } from '../utils/styles';
import Header from './HeaderComponents/Header';
import { Box, Container } from '@material-ui/core';
import Home from './HomeComponents/Home';




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
