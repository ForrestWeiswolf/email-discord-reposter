const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')
const { listMessages, processMessage } = require('./getMessages.js')

authorize()
  .then(auth =>
    listMessages(auth, 'newer_than:36h')
  )
  .then(messages => messages.map(processMessage))
  .then(messages => {
    fs.writeFile('messages.json', JSON.stringify(messages), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(err => console.error(err))
