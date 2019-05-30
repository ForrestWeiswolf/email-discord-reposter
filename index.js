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
    // The messages are in most-to-least recent order, I believe,
    // So we'll reverse to put them in chronological order
    messages.reverse().forEach(message => {
      bot
        .repostMessage(message.from, message.subject, message.payload)
        .catch(console.log)
    })
  })
  .catch(err => console.error(err))
