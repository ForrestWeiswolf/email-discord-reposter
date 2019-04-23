const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')

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

async function listMessages(auth){
  const ids = await listMessageIds(auth)
  const messagePromises = ids.map(id => getMessage(auth, id))
  return Promise.all(messagePromises)
}

authorize()
  .then(listMessages)
  .then(console.log)
