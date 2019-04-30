const fs = require('fs')
const authorize = require('./authorizeGoogleAPI')
const { listMessages } = require('./getMessages')
const processMessage = require('./processMessage')
const DiscordBot = require('./DiscordBot')
require('./secrets.js')

const bot = new DiscordBot(process.env.POST_HOOK)

authorize()
  .then(auth => listMessages(auth, process.env.GMAIL_QUERY))
  .then(messages => messages.map(processMessage))
  .then(messages => {
    messages.forEach(message => {
      bot
        .repostMessage(message.from, message.subject, message.payload)
        .catch(console.log)
    })
  })
  .catch(err => console.error(err))
