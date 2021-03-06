'use strict';

var md = require('markdown-it')({
    // allow HTML tags
    html: true
});

var indexLabelList = [
    '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳',
    '❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴',
    '㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉',
    '㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩',
    '⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇',
    '⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛',
    'ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ',
    'ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ',
    'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
    'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
    '⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵',
];

/**
 * Render markdown footnotes
 * @param {String} text
 * @returns {String} text
 */
function renderFootnotes(text, config) {
    var footnotes = [];
    var indexMap = {};
    var indexLabel = ('⓪' + indexLabelList.join('')).split('').join("|");
    var indexLabelMap = {'⓪': 0};
    indexLabelList.forEach(function(item, index) {
        item.split('').forEach(function (it, id) {
            indexLabelMap[it] = id + 1;
        });
    });
    var reFootnoteContent = new RegExp('('+ indexLabel 
        + '|\\[\\d+\\])([\\S \\t]+?)(?::|：) ?([\\S\\s]+?)(?=[\\S\\s]+?(?:' 
        + indexLabel + '|\\[\\d+\\])(?:[\\S \\t]+?)(?::|：)|\n\n|$)', 'g');

    // threat all footnote contents
    var directory = config.target_directory;
    text = text.replace(reFootnoteContent, function (match, index, original, content) {
        var reIndex = original + '~' + index + '~';
        var indexId = (undefined !== indexLabelMap[index]) ? indexLabelMap[index] : parseInt(index.substring(1));
        if (-1 != text.indexOf(reIndex) && (trim(content) || directory)) {
            content = trim(content) || (directory + encodeURI(original) + indexId);
            footnotes.push(indexMap[reIndex] = {
                index: index,
                indexId: indexId,
                original: original,
                content: content,
                reIndex: reIndex
            });
            // remove footnote content
            return '';
        }
        return match;
    });

    // render footnotes (HTML)
    if (footnotes.length) {
        var replaceStr = footnotes.map(function (item) 
            { return item.reIndex.replace(/[-[\]{}()*+!<=:?.\\^$|#\s,]/g, '\\$&'); }).join("|");
        text = text.replace(new RegExp(replaceStr, 'gm'), function (match) {
            var item = indexMap[match];
            if (item) {
                return '<a href="' + item.content + 
                '" target="_blank">' + item.original + '<sub>' + item.index + '</sub></a>';
            } else {
                return match;
            }
        });
    }

    return text;
}
module.exports = renderFootnotes;