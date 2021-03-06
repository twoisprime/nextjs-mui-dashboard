import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import theme from '@src/theme';
import createEmotionCache from '@src/createEmotionCache';
import { SWRConfig } from 'swr';
import fetchJson from '@lib/fetchJson';

import '@src/global.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* Localization required for MUI date pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SWRConfig
            value={{
              fetcher: fetchJson,
              onError: (err) => {
                console.error(err)
              },
            }}
          >
            {getLayout(<Component {...pageProps} />)}
          </SWRConfig>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

// TODO fix error when using PropTypes
// MyApp.propTypes = {
//   Component: PropTypes.elementType.isRequired,
//   emotionCache: PropTypes.object,
//   pageProps: PropTypes.object.isRequired,
// };
