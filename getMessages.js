const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')
const convertPayload = require('./convertPayload')

function listMessageIds(auth) {
  const gmail = google.gmail({ version: 'v1', auth })

  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: 'me',
      },
      (err, res) => {
        if (err) reject(err)
        resolve(res.data.messages.map(message => message.id))
      }
    )
  })
}

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

async function listMessages(auth) {
  const ids = await listMessageIds(auth)
  const messagePromises = ids.slice(0, 10).map(id => getMessage(auth, id))
  // const messagePromises = [ids[0]].map(id => getMessage(auth, id))

  return Promise.all(messagePromises)
}

authorize()
  .then(listMessages)
  .then(messages =>
    messages.map(message => ({
      // headers: message.headers,
      subject: message.data.payload.headers.find(header => header.name === 'Subject').value,
      from: message.data.payload.headers.find(header => header.name === 'From').value,
      snippet: message.data.snippet,
      payload: convertPayload(message.data.payload),
    }))
  )
  .then(messages => {
    fs.writeFile('messages.json', JSON.stringify(messages), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(err => console.error(err))