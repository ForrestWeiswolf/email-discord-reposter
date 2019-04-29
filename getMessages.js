const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')
const convertPayload = require('./convertPayload')

/**
 * Returns a promise that resolves to an array of the IDs of all messages in the authorized mailbox that match the passed query.
 * @param {object} auth An OAuth2 client. Can be created by authorizeGoogleAPI
 * @param {string} query Only messages matching the specified query will be returned. Supports the same query format as the Gmail search box.
 */

function listMessageIds(auth, query) {
  const gmail = google.gmail({ version: 'v1', auth })

  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: 'me',
        q: query,
      },
      (err, res) => {
        if (err) reject(err)
        resolve(res.data.messages.map(message => message.id))
      }
    )
  })
}

/**
 * Returns a promise that resolves to the message with the passed ID.
 * @param {object} auth An OAuth2 client. Can be created by authorizeGoogleAPI
 * @param {string} id The ID of a message
 */
function getMessage(auth, id) {
  const gmail = google.gmail({ version: 'v1', auth })

  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        userId: 'me',
        id,
      },
      (err, res) => {
        if (err) reject(err)
        resolve(res)
      }
    )
  })
}

/**
 * Returns a promise that resolves to an array of all messages in the authorized mailbox that match the passed query.
 * @param {object} auth An OAuth2 client. Can be created by authorizeGoogleAPI
 * @param {string} query Only messages matching the specified query will be returned. Supports the same query format as the Gmail search box.
 */
async function listMessages(auth, query) {
  const ids = await listMessageIds(auth, query)
  const messagePromises = ids.map(id => getMessage(auth, id))
  // const messagePromises = [ids[0]].map(id => getMessage(auth, id))

  return Promise.all(messagePromises)
}

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

authorize()
  .then(auth => listMessages(auth, 'newer_than:36h'))
  .then(messages =>
    messages.map(processMessage)
  )
  .then(messages => {
    fs.writeFile('messages.json', JSON.stringify(messages), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(err => console.error(err))
