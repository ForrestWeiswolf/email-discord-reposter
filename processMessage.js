const convertPayload = require('./convertPayload')

/**
 * Gets the subject and from headers from a message resource, decodes the body from base64, and converts it to markdown.
 * @param {message} message The message to process
 */
function processMessage(message) {
  return {
    subject: message.data.payload.headers.find(
      header => header.name === 'Subject'
    ).value,
    from: message.data.payload.headers.find(header => header.name === 'From')
      .value,
    payload: convertPayload(message.data.payload),
  }
}

module.exports = processMessage