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

  return {
    subject,
    from,
    payload: convertPayload(message.data.payload),
  }
}

module.exports = processMessage