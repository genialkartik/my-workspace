import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Dashboard from './components/index';

const Theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    // for themeing
    <MuiThemeProvider theme={Theme}>
      <div className="App" >
        <Dashboard />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
