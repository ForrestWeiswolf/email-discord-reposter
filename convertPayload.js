const Turndown = require('turndown')
const turndownService = new Turndown()

function convertToMarkdown(payload) {
  // Decode from base64:
  const utf8String = Buffer.from(payload, 'base64').toString('utf-8')

  // convert HTML to markdown:
  return turndownService.turndown(utf8String)
  // .replace(/<\/?i[^>]*>/g, '_')
  // .replace(/<\/?b( [^>]*)?>/g, '**')
  // .replace(/<\/?strong( [^>]+)?>/g, '**')
  // .replace(/<a ([^>]+)? href="([\w./]+)"\/?>/, '$i')
  // .replace(/<\/?[^>]*>/g, '')
}

module.exports = convertToMarkdown
