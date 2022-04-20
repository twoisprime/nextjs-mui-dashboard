import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber, deepOrange, teal, indigo, lime } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme(
  {
    palette: {
      primary: {
        main: deepPurple[500],
      },
      secondary: {
        main: lime[500],
      },
    },
  }
);

theme = responsiveFontSizes(theme);

export default theme;
