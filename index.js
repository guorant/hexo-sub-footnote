var renderFootnotes = require('./src/footnotes');
    util = require('hexo-util');

var hexo = hexo || {};
var config = hexo.config || {};
var footnoteConfig = config.sub_footnote || {};

// Register footnotes filter
hexo.extend.filter.register('before_post_render', function(data) {
  data.content = renderFootnotes(data.content, footnoteConfig);
  return data;
});