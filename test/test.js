var faviconsGenerator = require('../index.js');

faviconsGenerator({
  src: './test/flame.png',
  dest: './test/',
  icons_path: '',
  html: './test/favicons.html',
  design: {
    global: {
      picture_aspect: 'background_and_margin',
      margin: '33%',
      background_color: '#333'
    },
    ios: {},
    windows: {},
    firefox_app: {
      picture_aspect: 'circle',
      keep_picture_in_circle: 'true',
      circle_inner_margin: '5',
      app_name: 'favicon-generator',
      app_description: 'Favicons generator for Node.js using ImageMagick',
      developer_name: 'Sebastian Mandrean',
      developer_url: 'https://github.com/mandrean/favicon-generator'
    },
    android_chrome: {},
    coast: {},
    desktop_browser: {},
    open_graph: {},
    yandex_browser: {}
  },
  tags: {
    add: [],
    remove: []
  },
  settings: {
    filter: 'Lanczos',
    optimize: 'true'
  }
});
