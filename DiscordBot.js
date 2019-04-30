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
  let message = {
    username: `${sender}`,
    content: subject + ':\n\n' + body,
  }

  return axios.post(this.postHook, message)
}

module.exports = DiscordBot
