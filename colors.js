#!/usr/bin/env node

var fs = require('fs');
var data = fs.readFileSync(0, 'utf-8');

var hex_re = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
function rgba(hex) {
  hex = hex.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/, '#$1$1$2$2$3$3');
  var m = hex.match(hex_re);
  if (m) {
    return `rgba(${m.slice(1).map(num => parseInt(num, 16).toString()).concat(['0.997'])})`;
  }
}

data = data.toString().replace(/(^|\s)(background-color|color|background)\s*:\s*(#[^;]+)/g, function(_, pre, prop, hex) {
  return `${pre}--${prop}: ${rgba(hex)}`;
});

process.stdout.write(data);
