/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins');
const nextTranslate = require('next-translate')
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/list",
]);


// optional next.js configuration
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    localeDetection: true,
  },
};

module.exports = withPlugins([

  // add a plugin with specific configuration
  [nextTranslate, {
    webpack: (config, { isServer, webpack }) => {
      return config;
    }
  }],

  // add a plugin without a configuration
  withTM

  // another plugin with a configuration
  // [typescript, {
  //   typescriptLoaderOptions: {
  //     transpileOnly: false,
  //   },
  // }],

], nextConfig);