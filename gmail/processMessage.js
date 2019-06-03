const convertPayload = require('./convertPayload')

/**
 * Gets the subject and from headers from a message resource, decodes the body from base64, and converts it to markdown.
 * @param {message} message The message to process
 */
function processMessage(message) {
  const subject = message.data.payload.headers.find(
    header => header.name === 'Subject'
  ).value

  const from = message.data.payload.headers.find(
    header => header.name === 'From'
  ).value

  const isReply = !!message.data.payload.headers.find(
    header => (header.name === 'In-Reply-To') || (header.name === 'References')
  )

  const payload = convertPayload(message.data.payload)

  return {
    subject,
    from,
    payload: removeQuotes(payload),
    isReply
  }
}

// This should probably be made more specific
const quoteStart = /On .*, \w+.* wrote:/

const quotedLine = /\n\s*.*/

const messageEndBoilerplate = /\s*\\?--\s+You received this message because you are subscribed(.\n?)+ ?((groups.google.com\/d\/optout\)?\.)|(\+unsubscribe@googlegroups.com\)?\.))(.|\n)*$/

/**
 * Emails that are a reply include the whole previous email or chain of emails
 * in quote blocks at the bottom. This function is intended to remove those.
 * NOTE: until recently, this was pretty buggy, and I might not have caught all of them yet. Keep an eye out.
 * @param {string} text
 */
function removeQuotes(text) {
  text = removeEnd(text)

  const finalQuotedSection = new RegExp(`${quoteStart.source}(${quotedLine.source})*$`)
  return text.replace(finalQuotedSection, '')
}

/**
 * Remove the "You received this message because you are subscribed to groupname" etc.
 * from the end of mailing list messages.
 * @param {string} text
 */
function removeEnd(text) {
  return text.replace(messageEndBoilerplate, '')
}

module.exports = processMessage
