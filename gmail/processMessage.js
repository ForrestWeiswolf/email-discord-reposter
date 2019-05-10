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

  const isReply = subject.indexOf('Re:') === 0

  const payload = convertPayload(message.data.payload)

  return {
    subject,
    from,
    payload: isReply ? removeQuotes(payload) : removeEnd(payload),
  }
}

const quoteStart = /On \w{3,}, \w{3,} \d\d?,[^\n]+ [PA]M [^\n]+ wrote:/g

const messageEndBoilerplate = /\\?--\s+You received this message because you are subscribed(.\n?)+ ?((groups.google.com\/d\/optout\)?\.)|(\+unsubscribe@googlegroups.com\)?\.))$/

/**
 * Emails that are a reply include the whole previous email or chain of emails
 * in quote blocks at the bottom. This function is intended to remove those.
 *  *NOTE*: this has bugs and does not always work. I recommend filtering out replies for the time being. Will test teh regexes more thouroughly and fix it in a later version.
 * @param {string} text
 */
function removeQuotes(text) {
  text = text.replace(/\s+$/, '')

  while (messageEndBoilerplate.test(text) && quoteStart.test(text)) {
    let matches = text.match(quoteStart)
    let lastQuoteStart = text.lastIndexOf(matches[matches.length - 1])
    text = text.slice(0, lastQuoteStart)
  }
  text = text.replace(/On \w{3,}, \w{3,} \d\d?,[^\n]+ [PA]M [^\n]+ wrote:.+\\?--\s+You received this message because you are subscribed(.\n?)+ ?((groups.google.com\/d\/optout\)?\.)|(\+unsubscribe@googlegroups.com\)?\.))$/g, '')

  text = text.replace(/\s+$/, '')
  return text
}

/**
 * Remove the "You received this message because you are subscribed to groupname" etc.
 * from the end of mailing list messages.
 * @param {string} text
 */
function removeEnd(text) {
  text = text.replace(/\s+$/, '')

  text = text.replace(messageEndBoilerplate, '')

  text = text.replace(/\s+$/, '')

  return text
}

module.exports = processMessage
