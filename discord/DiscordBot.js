const axios = require('axios')

/**
 * A bot capable of posting to a discord server using a webhook
 * @param {string} postHook the webhook URL to post to
 */
function DiscordBot(postHook) {
  this.postHook = postHook
}

/**
 * Repost a message
 * @param {string} sender The original sender of the message. The sender listed for the message on discord will be `${sender} (on mailing list)`
 * @param {string} subject The subject of the message. Will precede the body in the discord message.
 * @param {string} body The body of the message.
 */
DiscordBot.prototype.repostMessage = function(sender, subject, body) {
  // Discord usernames must be <= 32 chars
  let username = sender

  // First, remove bracketed email addresses from end of sender name
  username = username.replace(/<\S+@\S+\.\w+>/, '')

  // Then just cut it off if neccessary
  if(username.length > 31){
    username = username.slice(0, 30) + '…'
  }

  let message = {
    username,
    content: `(Reposted from mailing list) **${subject}**:\n\n${body}\n\n`,
  }

  return axios.post(this.postHook, message)
}

module.exports = DiscordBot
