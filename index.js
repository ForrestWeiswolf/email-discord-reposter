const authorize = require('./gmail/authorizeGoogleAPI')
const { listMessages } = require('./gmail/getMessages')
const processMessage = require('./gmail/processMessage')
const DiscordBot = require('./discord/DiscordBot')

if (process.env.NODE_ENV !== 'production') require('./secrets.js')
const bot = new DiscordBot(process.env.POST_HOOK, process.env.NEW_THREAD_ROLE)

function forEachWait(arr, func, wait) {
  let idx = 0
  let interval = setInterval(() => {
    func(arr[idx])
    idx++
    if (idx === arr.length) {
      clearInterval(interval)
    }
  }, wait)
}

authorize()
  .then(auth => listMessages(auth, process.env.GMAIL_QUERY))
  // sort them into chronological order
  .then(messages =>
    messages.sort(
      (a, b) => parseInt(a.data.internalDate) - parseInt(b.data.internalDate)
    )
  )
  .then(messages => messages.map(processMessage))
  .then(messages => {
    // Wait a second between messages so as not to get rate limited by Discord
    forEachWait(
      messages,
      message => {
        bot
          .repostMessage(message.from, message.subject, message.payload, message.isReply)
          .catch(console.log)
      },
      1000
    )
  })
  .catch(err => console.error(err))
