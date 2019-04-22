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

authorize()
  .then(listMessageIds)
  .then(console.log)
