
import lightGreen from '@material-ui/core/colors/lightGreen';
import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

const greenTheme = createMuiTheme({
    palette: {
      primary: { main: lightGreen[500], color: 'white' },
      default: { main: lightGreen[500] },
      secondary: { main: lightGreen[500] }
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
      },
      MuiListItemAvatar: {
        root: {
          color: lightGreen[500]
        }
      },
      MuiDialogTitle: {
        root: {
          backgroundColor: lightGreen[300],
          color: 'white'
        }
      },
      MuiDialogContent: {
        root: {
          backgroundColor: lightGreen[100],
          color: lightGreen[500]
        }
      },
      MuiDialogActions: {
        root: {
          backgroundColor: lightGreen[300],
          color: lightGreen[500]
        }
      },
      PrivateRadioButtonIcon: {
        root: {
          color: lightGreen[500]
        }
      },
      PrivateSwitchBase: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiCheckbox: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiIconButton: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiPaper: {
        root: {
          backgroundColor: lightGreen[100]
        },
        secondary: {
          color: lightGreen[500]
        }
      }
    },
    systemButton: {
      backgroundColor: lightGreen[500],
      color: 'white'
    },
    actionButton: {
      backgroundColor: lightGreen[300],
      color: 'white'
    },
    errorButton: {
      backgroundColor: red[400],
      color: 'white'
  
    },
    listItem: {
      backgroundColor: lightGreen[200],
      borderRadius: 0,
      borderColor: lightGreen[500],
      borderWidth: 1
    },
    actionListItem: {
      backgroundColor: lightGreen[200]
    },
    correct: {
      color: lightGreen[400]
    },
    incorrect: {
      color: red[400]
    }
  });

  export {
      greenTheme
  }