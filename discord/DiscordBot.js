const axios = require('axios')

/**
 * A bot capable of posting to a discord server using a webhook
 * @param {string} postHook the webhook URL to post to
 * @param {string} [newThreadRole] the ID of a role. This role will be pinged on the first email in every thread
 */
function DiscordBot(postHook, newThreadRole) {
  this.postHook = postHook
  this.newThreadRole = newThreadRole
}

/**
 * Repost a message
 * @param {string} sender The original sender of the message. The sender listed for the message on discord will be `${sender} (on mailing list)`
 * @param {string} subject The subject of the message. Will precede the body in the discord message.
 * @param {string} body The body of the message.
 */
DiscordBot.prototype.repostMessage = function(sender, subject, body, isReply) {
  // Discord usernames must be <= 32 chars
  // First, remove bracketed email addresses from end of sender name
  let username = sender
  username = username.replace(/<\S+@\S+\.\w+>/, '')

  // Then just cut it off if neccessary
  if (username.length > 31) {
    username = username.slice(0, 30) + '…'
  }

  let pings = ''
  // if there's a NEW_THREAD_ROLE, ping it when the message isn't a reply
  if (isReply && this.newThreadRole) {
    (pings += `<@&${this.newThreadRole}> `)
  }

  let subjectLine = `${pings} **${subject}** (Reposted from mailing list):`

  let message = {
    username,
    content: `${subjectLine}\n\n${body}`,
  }

  return axios.post(this.postHook, message)
}

module.exports = DiscordBot
