const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')

function listMessageIds(auth) {
  const gmail = google.gmail({ version: 'v1', auth })
  gmail.users.messages.list(
    {
      userId: 'me',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      console.log(res.data.messages.map(message => message.id))
    }
  )
}

authorize(listMessageIds)