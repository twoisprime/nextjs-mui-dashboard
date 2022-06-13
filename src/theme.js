import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber, deepOrange, teal, indigo, lime, blue, red } from '@mui/material/colors';

// Create a theme instance.
let theme = createTheme(
  {
    palette: {
      primary: {
        main: deepPurple[500],
      },
      secondary: {
        main: blue[600],
      },
      terciary: {
        main: deepOrange[600],
      },
    },
  }
);

theme = responsiveFontSizes(theme);

export default theme;
