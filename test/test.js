var faviconsGenerator = require('../index.js');

faviconsGenerator({
  src: './test/flame.png',
  dest: './test/',
  icons_path: '',
  html: '',
  design: {
    ios: {
      picture_aspect: 'background_and_margin',
      margin: '33%',
      background_color: '#333'
    },
    windows: {
      picture_aspect: 'no_change',
      background_color: '#333'
    },
    firefox_app: {
      picture_aspect: 'circle',
      keep_picture_in_circle: 'true',
      circle_inner_margin: '5',
      background_color: '#333',
      app_name: 'favicon-generator',
      app_description: 'Favicons generator for Node.js using ImageMagick',
      developer_name: 'Sebastian Mandrean',
      developer_url: 'https://github.com/mandrean/favicon-generator'
    },
    android_chrome: {
      picture_aspect: 'shadow',
      theme_color: '#333'
    },
    coast: {
      picture_aspect: 'background_and_margin',
      background_color: '#333',
      margin: '12%'
    },
    desktop_browser: {},
    open_graph: {
      picture_aspect: 'background_and_margin',
      background_color: '#333',
      margin: '12%',
      ratio: '1.91:1'
    },
    yandex_browser: {
      background_color: '#333'
    }
  },
  tags: {
    add: [],
    remove: ['link[rel="favicons"]']
  },
  settings: {
    compression: '5'
  }
});
