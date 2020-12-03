import * as firebase from 'firebase'
import SignIn from './SignIn';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import '../css/styles.css';

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
      main: '#de512b'
    },
    info: {
      main: '#894475'
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
        <SignIn></SignIn>
      </ThemeProvider>
    </Router>
  )
}

export default App;
