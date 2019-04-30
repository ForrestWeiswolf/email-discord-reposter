const fs = require('fs')
const authorize = require('./authorizeGoogleAPI')
const { listMessages } = require('./getMessages')
const processMessage = require('./processMessage')
require('./secrets.js')

authorize()
  .then(auth =>
    listMessages(auth, process.env.GMAIL_QUERY)
  )
  .then(messages => messages.map(processMessage))
  .then(messages => {
    fs.writeFile('messages.json', JSON.stringify(messages), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(err => console.error(err))
