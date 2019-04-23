const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')

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
  // const messagePromises = ids.slice(0, 10).map(id => getMessage(auth, id))
  const messagePromises = [ids[0]].map(id => getMessage(auth, id))

  return Promise.all(messagePromises)
}

function decodePart(part) {
  if (part.parts) {
    return part.parts.map(decodePart)
  } else {
    return Buffer.from(part.body.data, 'base64').toString('ascii')
  }
}

authorize()
  .then(listMessages)
  .then(messages =>
    messages.map(message => ({
      snippet: message.data.snippet,
      parts: message.data.payload.parts.map(decodePart),
    }))
  )
  .then(messages => {
    console.log(messages)
    fs.writeFile('messages.json', JSON.stringify(messages), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(console.error)
