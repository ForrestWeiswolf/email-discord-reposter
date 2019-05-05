const fs = require('fs')
const authorize = require('./gmail/authorizeGoogleAPI')
const { listMessages } = require('./gmail/getMessages')
const processMessage = require('./gmail/processMessage')
const DiscordBot = require('./discord/DiscordBot')

if (process.env.NODE_ENV !== 'production') require('./secrets.js')
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
