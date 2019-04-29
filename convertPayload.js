const Turndown = require('turndown')
const turndownService = new Turndown()

function convertPayload(payload) {
  if (!payload) {
    return console.log('No payload!')
  } else if (payload.parts) {
    return convertPayload(payload.parts[payload.parts.length - 1]) // last part is the HTML version
  } else if (payload.body && payload.body.data) {
    return convertToMarkdown(payload.body.data)
  } else {
    return console.log('Payload has neither parts nor body.data')
  }
}

function convertToMarkdown(str) {
  // Decode from base64:
  const utf8String = Buffer.from(str, 'base64').toString('utf-8')

  // convert HTML to markdown:
  return turndownService.turndown(utf8String)
  // .replace(/<\/?i[^>]*>/g, '_')
  // .replace(/<\/?b( [^>]*)?>/g, '**')
  // .replace(/<\/?strong( [^>]+)?>/g, '**')
  // .replace(/<a ([^>]+)? href="([\w./]+)"\/?>/, '$i')
  // .replace(/<\/?[^>]*>/g, '')
}

module.exports = convertPayload
