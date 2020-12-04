import * as firebase from 'firebase'
import SignIn from './LoginLogic';
import SignUp from './SignUp';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import '../css/styles.css';
import LoginLogic from './LoginLogic';

const cosmoTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#23adae',
      contrastText: 'white'
    },
    secondary: {
      main: '#f4c132'
    },
    error: {
      main: '#de512b',
      contrastText: 'white'
    },
    info: {
      main: '#894475',
      contrastText: 'white'
    },
    succes: {
      main: '#55df99'
    }
  }
})

function App() {
  return (
    <Router>
      <ThemeProvider theme={cosmoTheme}>
        <LoginLogic></LoginLogic>
      </ThemeProvider>
    </Router>
  )
}

export default App;
