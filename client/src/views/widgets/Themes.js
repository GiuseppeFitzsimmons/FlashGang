
import lightGreen from '@material-ui/core/colors/lightGreen';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { createMuiTheme } from '@material-ui/core/styles';

const greenTheme = createMuiTheme({
    palette: {
      primary: { main: lightGreen[500], color: 'white' },
      default: { main: lightGreen[500] }
    },
    overrides: {
      MuiButton: {
        root: {
          marginTop: "10px",
          color: 'white'
        }
      },
      MuiBox: {
        root: {
          backgroundColor: lightGreen[100],
          padding: "10px",
          height:'100%',
          borderColor: lightGreen[500],
          borderWidth: '5px'
        }
      }
    },
    systemButton: {
      backgroundColor: lightGreen[500],
      color: 'white'
    },
    actionButton: {
      backgroundColor: lightGreen[400],
      color: 'white'
    },
    errorButton: {
      backgroundColor: deepOrange[300],
      color: 'white'
  
    },
    listItem: {
      backgroundColor: lightGreen[200],
      borderRadius: 0,
      borderColor: lightGreen[500],
      borderWidth: 1
    }
  });

  export {
      greenTheme
  }