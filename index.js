(function () {
  'use strict';

  // favicon-generator
  // https://github.com/mandrean/favicon-generator

  // Copyright (c) 2015 Sebastian Mandrean
  // Licensed under the MIT license.

  /*jslint node:true*/

  var fs = require('fs'),
      async = require('async'),
      im = require('imagemagick'),
      metaparser = require('metaparser'),
      jf = require('jsonfile'),

      config = jf.readFileSync('./config.json');


  module.exports = function (params) {

    function setDimensions(favicon) {
      var margin = params.design.global.margin || '0',
          x = favicon.width,
          y = favicon.height;
      favicon.dimensions = x+'x'+y;
      if (margin.indexOf('%') > -1) {
        margin = parseFloat(margin)/100.0;
        favicon.dimensionsWithoutMargin = Math.round(x*(1-margin))+'x'+Math.round(y*(1-margin));
      }
      else {
        favicon.dimensionsWithoutMargin = (x-(margin*2))+'x'+(y-(margin*2));
      }
      return favicon
    }

    function generateIcon(favicon) {
      // background
      favicon.dest = params.dest + favicon.href;
      im.convert([
        params.src,
        '-filter', 'Lanczos',
        '-resize', (favicon.dimensionsWithoutMargin ? favicon.dimensionsWithoutMargin : favicon.dimensions),
        '-background', (favicon.background ? favicon.background : 'transparent'),
        '-alpha', (favicon.background ? 'remove' : 'set'),
        '-gravity', 'center',
        '-extent', favicon.dimensions,
        favicon.dest], function(err) {
        }
      );
    }

    function createMarkup(file, add) {
      var remove = [
        'link[rel="shortcut icon"]',
        'link[rel="icon"]',
        'link[rel^="apple-touch-icon"]',
        'link[rel="manifest"]',
        'link[rel="yandex-tableau-widget"]',
        'link[rel="apple-touch-startup-image"]',
        'meta[name^="msapplication"]',
        'meta[name="mobile-web-app-capable"]',
        'meta[name="theme-color"]',
        'meta[name="apple-mobile-web-app-capable"]',
        'meta[property="og:image"]'
      ];

      metaparser({
        source: file,
        add: add,
        remove: remove,
        out: file,
        callback: function (error, html) {
          if (error) throw error;
          console.log(error, html);
        }
      });
    }

    function generateMarkup(element) {
      if (element.element) {
        return '<'
          +element.element
          +(element.name ? ' name="'+element.name+'"' : '')
          +(element.property ? ' property="'+element.property+'"' : '')
          +(element.content ? ' content="'+element.content+'"' : '')
          +(element.rel ? ' rel="'+element.rel+'"' : '')
          +(element.type ? ' type="'+element.type+'"' : '')
          +(element.width && element.height ? ' sizes="'+element.width+'x'+element.height+'"' : '')
          +(element.href ? ' href="'+element.href+'"' : '')
          +(element.media ? ' media="'
            +(element.media.deviceWidth ? '(device-width: '+element.media.deviceWidth+')' : '')
            +(element.media.deviceWidth && element.media.deviceHeight ? ' and ' : '')
            +(element.media.deviceHeight ? '(device-height: '+element.media.deviceHeight+')' : '')
            +(element.media.orientation ? ' and (orientation: '+element.media.orientation+')' : '')
            +(element.media.pixelratio ? ' and (-webkit-device-pixel-ratio: '+element.media.pixelratio+')' : '')
          +'"' : '')+'>';
      }
    }

    function main() {

      var markup = [];

      async.each(config.markup.elements, function(element, callback) {
        if (element.element) {
          if (element.sizes && (element.icon !== 'ico')) { // Icons+markup with multiple sizes, ignore .ico

            for (var i=0, len=element.sizes.length; i<len; i++) {
              if (element.sizes[i].width && element.sizes[i].height) {
                element.width = element.sizes[i].width;
                element.height = element.sizes[i].height;
                if (element.hrefTemplate) {
                  element.href = element.hrefTemplate.replace(/\{\{size\}\}/, element.sizes[i].width+'x'+element.sizes[i].height);
                }
                markup.push(generateMarkup(element) + '\n');
                element = setDimensions(element);
                generateIcon(element)
              } else {
                console.log('Error parsing sizes');
                break;
              }
            }

          } else if (element.icon === 'ico') { // Special case for favicon.ico
              // generateIcon(faviconParams);
            markup.push(generateMarkup(element) + '\n');

          } else { // Single-size case
            if (element.icon) { 
              // generateIcon(faviconParams);
            }
            markup.push(generateMarkup(element) + '\n');
          }

        } else if (element.icon) { // Icon-only case
          // generateIcon(faviconParams);
        }
        
        callback();
      },
      function(err){
        if(err) {
          console.log('Error');
        } else {
          console.log('Done');
          createMarkup(params.html, markup);
        }
      });
    }

    main();

  };

}());
