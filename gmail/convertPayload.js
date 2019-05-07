// Turndown is used to convert HTML to markdown.
const Turndown = require('turndown')
const turndownService = new Turndown()
  .addRule('link', {
    // Discord only supports a limited subset of markdown, which doesn't include inline links.
    // So when there's an <a></a> tag we'll put the href URL in parentheses after the content.
    filter: 'a',
    replacement: function(content, node) {
      return `${content} (${node.getAttribute('href')})`
    },
  })
  .addRule('linebreak', {
    // Turndown ought to convert <br /> to a newline by default, in my opinion
    // but it doesn't, so we have this rule to handle that.
    filter: 'br',
    replacement: function(content, node) {
      return '\n'
    },
  })

  /**
 * Converts the payload of a message resource
 * (https://developers.google.com/gmail/api/v1/reference/users/messages#resource)
 * returned from the GMail API from an object containing base64 encoded HTML to
 * a utf-8 encoded, markdown-formatted string.
 * @param {object} payload
 */
function convertPayload(payload) {
  if (!payload) {
    return console.log('No payload!')
  } else if (payload.parts) {
    // If it's in multipart format, the last part contains the HTML version
    return convertPayload(payload.parts[payload.parts.length - 1])
  } else if (payload.body && payload.body.data) {
    // Decode from base64:
    const utf8String = Buffer.from(payload.body.data, 'base64')
      .toString('utf-8')
      // Yes, we're converting newlines to <br> and then will have Turndown convert them back
      // There was an issue with it stripping out all newlines in some messages,
      // and this is a workaround.
      .replace(/[\n\r]/g, '<br>')

    // convert HTML to markdown:
    return turndownService.turndown(utf8String)
  } else {
    /* As far as I can tell, this only happens when a part is an attachment
    I suspect that dealing with attachments is not feasible in the amount
    of time I'm willing to spend on this. */
    return console.log('Payload has neither parts nor body.data!')
  }
}

module.exports = convertPayload
