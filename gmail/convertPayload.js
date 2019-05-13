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
      // There was an issue with it stripping out all newlines in some messages, and this is a workaround.
      .replace(/[\n\r]/g, '<br>')

    return utf8String
  } else {
    /* As far as I can tell, this only happens when a part is an attachment.
    I suspect that dealing with attachments is not feasible in the amount
    of time I'm willing to spend on this. */
    return console.log('Payload has neither parts nor body.data!')
  }
}

module.exports = convertPayload
