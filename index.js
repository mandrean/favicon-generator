(function () {
  'use strict';

  // favicon-generator
  // https://github.com/mandrean/favicon-generator

  // Copyright (c) 2015 Sebastian Mandrean
  // Licensed under the MIT license.

  /*jslint node:true*/

  var fs = require('fs'),
      async = require('async'),
      im = require('imagemagick');

  var faviconSettings = {
    android: {
      name: 'favicon',
      sizes: [
        { width: 36, height: 36 },
        { width: 48, height: 48 },
        { width: 72, height: 72 },
        { width: 96, height: 96 },
        { width: 144, height: 144 },
        { width: 192, height: 192 }
      ]
    },
    appleStartup: {
      name: 'apple-touch-startup-image',
      sizes: [
        { width: 1536, height: 2008, media: { deviceWidth: 768, deviceHeight: 1024, orientation: 'portrait', pixelratio: 2 }},
        { width: 2048, height: 1496, media: { deviceWidth: 768, deviceHeight: 1024, orientation: 'landscape', pixelratio: 2 }},
        { width: 768, height: 1004, media: { deviceWidth: 768, deviceHeight: 1024, orientation: 'portrait', pixelratio: 1 }},
        { width: 1024, height: 748, media: { deviceWidth: 768, deviceHeight: 1024, orientation: 'landscape', pixelratio: 1 }},
        { width: 640, height: 1096, media: { deviceWidth: 320, deviceHeight: 568, pixelratio: 2 }},
        { width: 640, height: 920, media: { deviceWidth: 320, deviceHeight: 480, pixelratio: 2 }},
        { width: 320, height: 460, media: { deviceWidth: 320, deviceHeight: 480, pixelratio: 1 }}
      ]
    },
    appleTouch: {
      name: 'apple-touch-icon',
      sizes: [
        { width: 57, height: 57 }, // Non-Retina iPhone, ≤ iOS 6
        { width: 60, height: 60 }, // Non-Retina iPhone, ≥ iOS 7
        { width: 72, height: 72 }, // Non-Retina iPad, ≤ iOS 6
        { width: 76, height: 76 }, // Non-Retina iPad, ≥ iOS 7
        { width: 114, height: 114 }, // Retina iPhone, ≤ iOS 6
        { width: 120, height: 120 }, // Retina iPhone, ≥ iOS 7
        { width: 144, height: 144 }, // Retina iPad, ≤ iOS 6
        { width: 152, height: 152 }, // Retina iPad, ≥ iOS 7
        { width: 180, height: 180 }  // iPhone 6 Plus, ≥ iOS 8
      ]
    },
    coast: {
      name: 'coast',
      sizes: [
        { width: 228, height: 228 }
      ]
    },
    favico: {
      name: 'favicon',
      sizes: [
        { width: 48, height: 48 },
        { width: 32, height: 32 },
        { width: 16, height: 16 }
      ]
    },
    favicon: {
      name: 'favicon',
      sizes: [
        { width: 160, height: 160 },
        { width: 96, height: 96 },
        { width: 16, height: 16 },
        { width: 32, height: 32 }
      ]
    },
    firefox: {
      name: 'firefox_app',
      sizes: [
        { width: 60, height: 60 },
        { width: 128, height: 128 },
        { width: 512, height: 512 }
      ]
    },
    opengraph: {
      name: 'open-graph',
      sizes: [
        { width: 1500, height: 1500 }
      ]
    },
    windows: {
      name: 'mstile',
      sizes: [
        { width: 70, height: 70 },
        { width: 144, height: 144 },
        { width: 150, height: 150 },
        { width: 310, height: 150 },
        { width: 310, height: 310 }
      ]
    },
    yandex: {
      name: 'yandex',
      sizes: [
        { width: 50, height: 50 }
      ]
    }
  };

  module.exports = function (params) {

    function generateIcon(favicon) {
      im.convert([
        favicon.src,
        '-filter', 'Lanczos',
        '-resize', (favicon.dimensionsWithoutMargin ? favicon.dimensionsWithoutMargin : favicon.dimensions),
        '-background', (favicon.background ? favicon.background : 'transparent'),
        '-alpha', (favicon.background ? 'remove' : 'set'),
        '-gravity', 'center',
        '-extent', favicon.dimensions,
        favicon.dest], function(err) {
          if (err) throw err;
        }
      );
    }

    function calculateDimensions(favicon, margin) {
      var margin = margin || '0',
          x = favicon.width,
          y = favicon.height,
          dimensions = x+'x'+y,
          dimensionsWithoutMargin;
      if (params.design.ios.margin.indexOf('%') > -1) {
        margin = parseFloat(params.design.ios.margin)/100.0;
        dimensionsWithoutMargin = Math.round(x*(1-margin))+'x'+Math.round(y*(1-margin));
      }
      else
        dimensionsWithoutMargin = (x-(margin*2))+'x'+(y-(margin*2));
      return [dimensions,dimensionsWithoutMargin]
    }

    function main() {
      async.each(Object.keys(faviconSettings), function(favicons, callback) {
        async.each(faviconSettings[favicons].sizes, function(favicon, callback) {
          var dimensions = calculateDimensions(favicon, params.design.ios.margin),
              filename = faviconSettings[favicons].name+'-'+dimensions[0]+'.png',
              faviconParams = {
                src: params.src,
                dest: params.dest + filename,
                dimensions: dimensions[0],
                dimensionsWithoutMargin: dimensions[1],
                background: params.design.ios.background_color
              };
          generateIcon(faviconParams);
        }, function (err) {
          callback(err)
        });
      }, function (err) {
        callback(err);
      });
    }

    main();

  };

}());
